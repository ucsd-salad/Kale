import { DepGraph } from "dependency-graph";
import { DepGraphCycleError } from "dependency-graph";
import { GridApi, ColumnApi, IRowNode } from "ag-grid-community";
import { EvaluationContext, formulaError } from "./formula";
import { Cell } from "./Cell";
import { NAMED_CELL_PREFIX } from "./grid";
import { getAllRowNodes } from "./gridUtils";

export type DepGraphOrderingValue = {
  ordering: Set<DepNodeType>;
  cycles: string[][];
};

export type DepNodeType = String | Cell;

export let depGraphOrderingValue = (
  ordering: Set<DepNodeType>,
  cycles: string[][]
): DepGraphOrderingValue => {
  return {
    ordering: ordering,
    cycles: cycles,
  };
};

/**
 *  Constructs and returns dependency graph by creating a node for each formula cell
 *  and establishes dependencies between them depending on the precedents of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {DepGraph} Returns the dependency graph
 */
export function constructDependencyGraph(gridApi: GridApi) {
  let depGraph = new DepGraph<DepNodeType>();
  let allRowNodes: IRowNode[] = getAllRowNodes(gridApi);
  // Iterate over each row of the grid
  allRowNodes.forEach(rowNode => {
    let rowData = rowNode.data;
    if (rowNode.rowIndex != undefined) {
      // Iterate through each column of the row node
      for (let columnName in rowData) {
        let cellVal = rowData[columnName];
        if (cellVal && cellVal.formulaCell) {
          let nodeKey = columnName + "+" + rowNode.rowIndex;
          // If the node is footer row (pinned row), use rowNodeId instead of rowIndex
          // Reason: rowIndex of first footer row is 0 which is same as first row of the table
          // rowNodeId of the footer row node is of the format "b"-rowIndex
          if (rowNode.isRowPinned()) {
            nodeKey = columnName + "+" + rowNode.id; 
          }
          // Create a node for the key if not already exists
          if (!depGraph.hasNode(nodeKey)) {
            depGraph.addNode(nodeKey);
          }
          if (cellVal.name) {
            // If the cell is named, then set the node data to the corresponding cell
            if(!depGraph.hasNode(cellVal.name)) {
              depGraph.addNode(cellVal.name, cellVal);
            } else {
              depGraph.setNodeData(cellVal.name, cellVal);
            }
            // A named cell node depends on itself
            // This is required since in dependency graph,
            // nodes can exist due to named cell references and relative references
            depGraph.addDependency(cellVal.name, nodeKey);
          }
          cellVal.formulaCell.precedents?.forEach((precedent) => {
            // Create a node for the precedent key if not already exists
            if (typeof precedent === "string") {
              const precedentStr = precedent.toString();
              if (!depGraph.hasNode(precedentStr)) {
                if (precedentStr.startsWith(NAMED_CELL_PREFIX)) {
                  depGraph.addNode(precedentStr.substring(11));
                } else {
                  depGraph.addNode(precedentStr);
                }
              }
              // Add a directed edge from the node to the precedent
              // Example: If a cell A refers to another cell B, then a directed
              // edge exists from node A to node B.
              if (precedentStr.startsWith(NAMED_CELL_PREFIX)) {
                depGraph.addDependency(nodeKey, precedentStr.substring(11));
              } else {
                depGraph.addDependency(nodeKey, precedentStr);
              }
            }
          });
        }
      }
    }
  });
  return depGraph;
}

/**
 *  Checks whether a cycle exists in the dependency graph; if it exists
 *  then it populates the error in each cell involved in the cycle
 *  In case of multiple cycles, only one cycle is detected
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {depGraph} DepGraph<DepNodeType> - Dependency graph
 *  @returns {DepGraph} Returns the topological ordering and cycle if exists in the dependency graph
 */
export function checkCycleInDepGraph(
  gridApi: GridApi,
  depGraph: DepGraph<DepNodeType>
) {
  let recalculationOrder;
  let cycles: string[][] = [];
  while (true) {
    try {
      recalculationOrder = depGraph.overallOrder();
      break;
    } catch (e) {
      if (e instanceof DepGraphCycleError) {
        const cycle = e.cyclePath;
        if (cycle.length > 0) {
          cycle.forEach((cycleNode) => {
            if (depGraph.getNodeData(cycleNode) instanceof Cell) {
              const cellVal = depGraph.getNodeData(cycleNode);
              if (cellVal instanceof Cell && cellVal.formulaCell) {
                cellVal.formulaCell.value = formulaError("cyclic error");
              }
            } else {
              const keys = cycleNode.split("+");
              const columnName = keys[0];
              const rowIndex = Number(keys[1]);
              let rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
              let cellVal = rowNode?.data[columnName];
              if (cellVal.formulaCell) {
                cellVal.formulaCell.value = formulaError("cyclic error");
              }
            }
          });
          // Remove all the nodes in the cycle from the dep graph
          cycle.forEach((cycleNode) => {
            depGraph.removeNode(cycleNode);
          })
        } else {
          console.log(e.message);
        }
        gridApi.refreshCells({ force: true });
        cycles.push(e.cyclePath);
      }
    }
  }
  return depGraphOrderingValue(new Set<DepNodeType>(recalculationOrder), cycles);
}

/**
 *  Populates the precedents of all formula cells by visiting each formula cell
 *  and parsing the formula of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {columnApi} ColumnApi - Column API instance associated with the grid
 *  @param {envVar} - Environment variables of the jupyter notebook
 */
export function populatePrecedentsOfAllCells(
  gridApi: GridApi,
  columnApi: ColumnApi,
  envVar
) {
  const allRowNodes = getAllRowNodes(gridApi);
  // Iterate over all the cells, parse them and populate the precedents
  allRowNodes.forEach(rowNode => {
    let rowData = rowNode.data;
    if (rowNode.id != undefined) {
      let ctx = new EvaluationContext(
        gridApi,
        columnApi,
        rowNode.id,
        envVar,
        true
      );
      for (let key in rowData) {
        let cellVal = rowData[key];
        if (cellVal && cellVal.formulaCell) {
          cellVal.formulaCell.evaluate(ctx);
        }
      }
    }
  });
}
