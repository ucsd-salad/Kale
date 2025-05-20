"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depGraphOrderingValue = void 0;
exports.constructDependencyGraph = constructDependencyGraph;
exports.checkCycleInDepGraph = checkCycleInDepGraph;
exports.populatePrecedentsOfAllCells = populatePrecedentsOfAllCells;
const dependency_graph_1 = require("dependency-graph");
const dependency_graph_2 = require("dependency-graph");
const formula_1 = require("./formula");
const Cell_1 = require("./Cell");
const grid_1 = require("./grid");
const gridUtils_1 = require("./gridUtils");
let depGraphOrderingValue = (ordering, cycles) => {
    return {
        ordering: ordering,
        cycles: cycles,
    };
};
exports.depGraphOrderingValue = depGraphOrderingValue;
/**
 *  Constructs and returns dependency graph by creating a node for each formula cell
 *  and establishes dependencies between them depending on the precedents of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {DepGraph} Returns the dependency graph
 */
function constructDependencyGraph(gridApi) {
    let depGraph = new dependency_graph_1.DepGraph();
    let allRowNodes = (0, gridUtils_1.getAllRowNodes)(gridApi);
    // Iterate over each row of the grid
    allRowNodes.forEach(rowNode => {
        var _a;
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
                        if (!depGraph.hasNode(cellVal.name)) {
                            depGraph.addNode(cellVal.name, cellVal);
                        }
                        else {
                            depGraph.setNodeData(cellVal.name, cellVal);
                        }
                        // A named cell node depends on itself
                        // This is required since in dependency graph,
                        // nodes can exist due to named cell references and relative references
                        depGraph.addDependency(cellVal.name, nodeKey);
                    }
                    (_a = cellVal.formulaCell.precedents) === null || _a === void 0 ? void 0 : _a.forEach((precedent) => {
                        // Create a node for the precedent key if not already exists
                        if (typeof precedent === "string") {
                            const precedentStr = precedent.toString();
                            if (!depGraph.hasNode(precedentStr)) {
                                if (precedentStr.startsWith(grid_1.NAMED_CELL_PREFIX)) {
                                    depGraph.addNode(precedentStr.substring(11));
                                }
                                else {
                                    depGraph.addNode(precedentStr);
                                }
                            }
                            // Add a directed edge from the node to the precedent
                            // Example: If a cell A refers to another cell B, then a directed
                            // edge exists from node A to node B.
                            if (precedentStr.startsWith(grid_1.NAMED_CELL_PREFIX)) {
                                depGraph.addDependency(nodeKey, precedentStr.substring(11));
                            }
                            else {
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
function checkCycleInDepGraph(gridApi, depGraph) {
    let recalculationOrder;
    let cycles = [];
    while (true) {
        try {
            recalculationOrder = depGraph.overallOrder();
            break;
        }
        catch (e) {
            if (e instanceof dependency_graph_2.DepGraphCycleError) {
                const cycle = e.cyclePath;
                if (cycle.length > 0) {
                    cycle.forEach((cycleNode) => {
                        if (depGraph.getNodeData(cycleNode) instanceof Cell_1.Cell) {
                            const cellVal = depGraph.getNodeData(cycleNode);
                            if (cellVal instanceof Cell_1.Cell && cellVal.formulaCell) {
                                cellVal.formulaCell.value = (0, formula_1.formulaError)("cyclic error");
                            }
                        }
                        else {
                            const keys = cycleNode.split("+");
                            const columnName = keys[0];
                            const rowIndex = Number(keys[1]);
                            let rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
                            let cellVal = rowNode === null || rowNode === void 0 ? void 0 : rowNode.data[columnName];
                            if (cellVal.formulaCell) {
                                cellVal.formulaCell.value = (0, formula_1.formulaError)("cyclic error");
                            }
                        }
                    });
                    // Remove all the nodes in the cycle from the dep graph
                    cycle.forEach((cycleNode) => {
                        depGraph.removeNode(cycleNode);
                    });
                }
                else {
                    console.log(e.message);
                }
                gridApi.refreshCells({ force: true });
                cycles.push(e.cyclePath);
            }
        }
    }
    return (0, exports.depGraphOrderingValue)(new Set(recalculationOrder), cycles);
}
/**
 *  Populates the precedents of all formula cells by visiting each formula cell
 *  and parsing the formula of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {columnApi} ColumnApi - Column API instance associated with the grid
 *  @param {envVar} - Environment variables of the jupyter notebook
 */
function populatePrecedentsOfAllCells(gridApi, columnApi, envVar) {
    const allRowNodes = (0, gridUtils_1.getAllRowNodes)(gridApi);
    // Iterate over all the cells, parse them and populate the precedents
    allRowNodes.forEach(rowNode => {
        let rowData = rowNode.data;
        if (rowNode.id != undefined) {
            let ctx = new formula_1.EvaluationContext(gridApi, columnApi, rowNode.id, envVar, true);
            for (let key in rowData) {
                let cellVal = rowData[key];
                if (cellVal && cellVal.formulaCell) {
                    cellVal.formulaCell.evaluate(ctx);
                }
            }
        }
    });
}
//# sourceMappingURL=dependencyGraphUtils.js.map