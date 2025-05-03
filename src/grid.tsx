import React, { useCallback, useEffect, useState } from "react";
import { WidgetModel } from "./widget";
import { useModelState } from "./hooks/widget-model";

import { AgGridReact } from "ag-grid-react";
import {
  AgGridEvent,
  GridApi,
  ColumnApi,
  ValueSetterParams,
  ColumnMenuTab,
  ValueGetterParams,
  ProcessCellForExportParams,
  ModelUpdatedEvent,
  CellFocusedEvent,
  RowNodeTransaction,
  CutStartEvent,
  PasteEndEvent,
  RowClassParams,
  RowStyle,
  FillOperationParams,
  CellRange,
} from "ag-grid-community";
import { DepGraph } from "dependency-graph";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "../css/widget.css";

import CellEditor from "./cellEditor";
import ColumnHeader from "./columnHeader";
import { FormulaCell } from "./formulacell";
import { EvaluationContext } from "./formula";
import { strict as assert } from "assert";
import { WidgetProps } from "./ReactWidget";
import { Cell } from "./Cell";
import {
  constructDependencyGraph,
  checkCycleInDepGraph,
  populatePrecedentsOfAllCells,
  DepGraphOrderingValue, DepNodeType,
} from "./dependencyGraphUtils";

import NameRenderer from "./cellRenderer";
import { areAllValuesNumbersWithConstDiffInHorizRange, areAllValuesNumbersWithContDiffInVertRange, getAllRowNodes } from "./gridUtils";
import { FormulaStringContext } from "./formulaStringVisitor";

enum Position {
  Right,
  Left,
  NoPos,
}

enum PasteType {
  Cut,
  Copy
}

function recalculate(event: AgGridEvent, model: WidgetModel) {
  recalculateAllCells(event.api, event.columnApi, model);
}

let col_num = 1;
export const NAMED_CELL_PREFIX = "#namedcell:";
export const ROW_NUMBER_COL_NAME = "RN";
export const AGGREGATE_COL_NAME = "Aggregation";
const HEADER_CLASS = ".ag-header-cell";
let envVar;
let model;
// By default, set the paste type as copy
// paste type is changed in the CutStartEvent
let pasteType = PasteType.Copy;

//TODO: To make the code more efficient, two properties to each cell
//1. hasError 2. errorMessage instead of checking each time whether a name is valid onCellFocused
export var nameCellMap = new Map<string, string>();

export function recalculateAllCells(gridApi: GridApi, columnApi: ColumnApi, model: WidgetModel) {
  // This is super inefficient, but it will do for now.
  // Iterate over the whole table to populate the precedents of each formula cell
  populatePrecedentsOfAllCells(gridApi, columnApi, envVar);
  // Construct dependency graph using precedents of the formula cells
  let depGraph = constructDependencyGraph(gridApi);
  // Check whether a cycle exists in the dependency graph
  let depGraphOrderingValue: DepGraphOrderingValue = checkCycleInDepGraph(gridApi, depGraph);
  const recalculationOrder = depGraphOrderingValue.ordering;
  const cycles = depGraphOrderingValue.cycles;
  if (cycles.length === 0) {
    // First, recalculate all the cells in the topological ordering
    for (const cellKey of recalculationOrder) {
        if (typeof cellKey === "string" && cellKey.startsWith(NAMED_CELL_PREFIX)) {
          const cellValue = depGraph.getNodeData(cellKey.toString());
          if (cellValue instanceof Cell && cellValue.formulaCell) {
            let ctx = new EvaluationContext(gridApi, columnApi, cellValue.getRowNodeId(), envVar, false);
            cellValue.formulaCell.evaluate(ctx);
          }
        } else if (typeof cellKey === "string") {
          const keys = cellKey.split("+");
          const columnName = keys[0];
          const rowIndex = Number(keys[1]);
          let rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
          let cellVal = rowNode?.data[columnName];
          if (rowNode && rowNode.id) {
            let ctx = new EvaluationContext(gridApi, columnApi, rowNode.id, envVar, false);
            if (cellVal && cellVal.formulaCell) {
              cellVal.formulaCell.evaluate(ctx);
            }
          }
        }
      }
    }
  const columnDefs = gridApi.getColumnDefs();
  let modelValue: any = []; // list of all the row data of the table
  const allRowNodes = getAllRowNodes(gridApi);
  // After the cells in the topological ordering have been recalculated, recalculate all the other cells
  allRowNodes.forEach(rowNode => {
    let rowData = rowNode.data;
    let rowValue = {};
    assert(rowNode.id != undefined);
    if (rowNode.id != undefined) {
        let ctx = new EvaluationContext(gridApi, columnApi, rowNode.id, envVar, false);
        for (const idx in columnDefs) {
            const key = columnDefs[idx]['field'];
            if (key === ROW_NUMBER_COL_NAME || !rowData[key]) {
              continue;
            }
            let nodeKey: string = key + "+" + rowNode.rowIndex;
            if (rowNode.isRowPinned()) {
              nodeKey = key + "+" + rowNode.id; 
            }
            let cellVal = rowData[key];
            rowValue[key] = cellVal.value;
            if (cycles.length === 0 && recalculationOrder.has(nodeKey)) {
              if (cellVal && cellVal.value && (cellVal.value.kind == "NUMBER" || cellVal.value.kind == "STRING")) {
                rowValue[key] = cellVal.value.value;
              }
              continue;
            }
            if (cellVal.formulaCell) {
                cellVal.formulaCell.evaluate(ctx);
                if (cellVal.formulaCell.value.kind == "NUMBER" || cellVal.formulaCell.value.kind == "STRING") {
                  rowValue[key] = cellVal.formulaCell.value.value;
                }
            }
        }
    }
    modelValue.push(rowValue);
  });
  // Update the model state value
  // JSON.parse(JSON.stringify()) is used to avoid serialization issues
  model.set("value", JSON.parse(JSON.stringify(modelValue)));
  // This is over-aggressive. Optimize this if/when it becomes a performance problem.
  gridApi.refreshCells({force: true});
}


/**
 *  Retrieves all the column header document elements
 *  @returns {NodeList} Returns all elements which have class as HEADER_CLASS
 */
function getAllHeaderNodes() {
  return document.querySelectorAll(HEADER_CLASS);
}

interface CellEditingContext {
  formulaMode: boolean;
  cellEditorInstance: any;
  gridOptions: any;
}

// Kept it global due to its dependency on methods outside the scope of createGrid component
let cellEditingContext: CellEditingContext = {
  formulaMode: false,
  cellEditorInstance: null,
  gridOptions: null,
};

//Function that checks if the input into the Name Bar is valid
export function validateName(
  name: string,
  id: string,
  columnApi : ColumnApi | null,
  cellMap: Map<string, string>
): object {
  let result = { hasError: false, message: "" };
  if (name === null || name === ""){
    return result;
  }

  if (name.includes(" ")) {
    result.hasError = true;
    result.message = "ERROR: Cell Name Cannot Contain Spaces";
  }

  let columnHeaderList = columnApi?.getColumns();
  if(columnHeaderList === null || columnHeaderList === undefined || columnHeaderList.length === 0) {
    columnHeaderList = [];
  }
  for(let i = 0; i < columnHeaderList.length; i++){
    if(columnHeaderList[i]["colId"] === name){
      result.hasError = true;
      result.message = "ERROR: Cell Name Cannot Be The Same As Column Name";
      return result;
    }
  }
  for (const [cellId, cellName] of cellMap) {
    if (cellName === name && cellName !== "" && cellId !== id) {
      result.hasError = true;
      result.message = "Cell Name Already Exists";
      break;
    }
  }
  return result;
}

/**
 *  Defines an event handler for when the user clicks on a column header in a table.
 *  @param {event} event - The onClick event that triggered the event handler.
 */
function onHeaderCellClicked(event) {
  // Set the column value only if formula Mode is ON
  if (cellEditingContext.formulaMode && cellEditingContext.cellEditorInstance) {
    const headerColumnClicked: string = event.target.outerText;
    cellEditingContext.cellEditorInstance.setValue("=" + headerColumnClicked);
  }
}

/**
 *  Handles editing of a cell in a table by checking if the cell value starts with "="
 *  and setting formula mode accordingly.
 *  @param {event} event - The event triggered by the cell editing.
 */
const onCellValueEdited = (event) => {
  const colorArray = ["#F4E7DD", "#ECDBDB", "#E6F0DE", "#E7E2F7", "#DFE6FB"];
  var colorCount = 0;
  const cellValue = event.target.value;
  // Set formula mode if cellValue starts with "="
  if (cellValue.startsWith("=")) {
    cellEditingContext.formulaMode = true;
    let colValue = cellValue.substring(1);
    let gridOptions = cellEditingContext.gridOptions;
    let columnDefs = gridOptions.api.getColumnDefs();
    const breakpoint = /\[|[-+]?\d|\]|\+|\-|\*|\/|\%|\s/;
    let columnsArray = colValue.split(breakpoint);
    columnDefs.forEach((obj) => {
      let i = 0;
      while (i < columnsArray.length) {
        let element = columnsArray[i];
        if (element != "") {
          if (obj.field == element) {
            obj.cellStyle = {
              backgroundColor: colorArray[colorCount % 5],
            };
            colorCount += 1;
            break;
          }
        }
        i = i + 1;
      }
      if (i == columnsArray.length) {
        obj.cellStyle = {
          backgroundColor: "#ffffff",
        };
      }
    });
    gridOptions.api.setColumnDefs(columnDefs);
  } else {
    cellEditingContext.formulaMode = false;
  }
};

/**
 *  Handles renaming of column
 */

export const renameColumn = (
  gridOptions,
  colId,
  oldColumnName,
  newColumnName,
  
  element,
  model
) => {
  // Don't do anything if the column name is same
  if (oldColumnName === newColumnName || newColumnName === null || newColumnName === undefined) { 
    return "";
  }

  let rowValues: any = [];
  const allRowNodes = getAllRowNodes(gridOptions.api);
  // Push existing row values of the old column name
  allRowNodes.forEach(node => {
    rowValues.push(node.data[oldColumnName]);
  });
  let newColumnDef;
  // Change column defs to include new column
  const newColumnDefs = gridOptions.api.getColumnDefs()?.map((col) => {
    if (col.colId === colId) {
      newColumnDef = col;
      newColumnDef.field = newColumnName;
      newColumnDef.colId = newColumnName;
    }
    return col;
  });
  gridOptions.api.setColumnDefs(newColumnDefs);
  // gridOptions.columnDefs = newColumnDefs;
  // Set the data for all the rows in the new column name
  allRowNodes.forEach((node, index) => {
    node.setDataValue(newColumnName, rowValues[index]);
  });
  // Delete row data for old column name
  allRowNodes.forEach((node, _) => {
    delete node.data[oldColumnName];
  });
  gridOptions.api.refreshHeader();
  // Add on click event listener for the new column header element
  element.addEventListener("click", (event) => {
    onHeaderCellClicked(event);
  })
};

const cellValueSetter = (
  params: ValueSetterParams,
  model: WidgetModel
): boolean => {
  if (params.node?.id === undefined) {
    return true;
  }
  const columnName = params.colDef.field;
  // If the oldValue is null, which implies the cell doesn't exist yet; create a new cell
  if (!params.oldValue && columnName) {
    params.data[columnName] = new Cell(params.newValue);
  }
  // If the newValue is null, then set the current cell value as null
  // newValue for a cell would be null when you cut paste from the cell
  if (!params.newValue && columnName) {
    params.data[columnName] = params.newValue;
  }
  // If the newValue is not a formulaCell, then just update the value attribute of the current cell
  if (params.newValue && !params.newValue.formulaCell && columnName) {
    params.data[columnName].value = params.newValue.value;
    // Set the formulaCell attribute to null
    params.data[columnName].formulaCell = null;
  }
  // If the pasteType is cut, then also copy the name
  if (pasteType === PasteType.Cut && columnName) {
    params.data[columnName].name = params.newValue.name;
  }
  // If the newValue is a formulaCell, then copy the formulaCell object into the formulaCell attribute
  // of the current cell
  if (params.newValue && params.newValue.formulaCell && columnName) {
    const formulaCellObj = params.newValue.formulaCell;
    params.data[columnName].formulaCell = new FormulaCell(
      formulaCellObj.formula.str,
      params.api,
      formulaCellObj.formula.value,
      formulaCellObj.formula.precedents
    );
  }
  // Update precedents of all the cells
  populatePrecedentsOfAllCells(params.api, params.columnApi, envVar);
  // Construct dependency graph
  let depGraph: DepGraph<DepNodeType> = constructDependencyGraph(params.api);
  const depGraphOrderingValue: DepGraphOrderingValue = checkCycleInDepGraph(params.api, depGraph);
  const cycles = depGraphOrderingValue.cycles;
  // If cycle exists, need to call recalculateCells to populate error
  // in all the cells involved in the cycle
  // const columnName = params.colDef.field;
  let nodeKey = columnName + "+" + params.node?.rowIndex;
  if (params.node?.isRowPinned()) {
    nodeKey = columnName + "+" + params.node?.id; 
  }
  if (cycles.length > 0) {
    let isNodeInvolvedInCycle = false;
    for (const cycle of cycles) {
      isNodeInvolvedInCycle ||= cycle.includes(nodeKey);
      if (isNodeInvolvedInCycle) {
        break;
      }
    }
    return true;
  }
  // If this is the first time the cell is visited, recalculate all other cells;
  // since other cells might depend on this cell
  recalculateAllCells(params.api, params.columnApi, model);
  return true;
};

const cellValueGetter = (params: ValueGetterParams) => {
  const colName = params.colDef.field;
  if (colName === ROW_NUMBER_COL_NAME) {
    return params.node?.rowIndex;
  }
  if (!colName) {
    return "";
  }
  if (!params.data[colName]) {
    return null;
  }
  if (params.data[colName] && params.data[colName].formulaCell) {
    return params.data[colName].formulaCell.value.value;
  }
  return params.data[colName].value;
};

// Context to pass to gridOptions and columnDefs
const context = {
  onCellValueEdited: onCellValueEdited,
  recalculateAllCells: (gridApi, columnApi) => {
    recalculateAllCells(gridApi, columnApi, model);
  },
  envVar: envVar,
};

export function createGrid(props: WidgetProps) {
  const [modelState, updateModelState] = useModelState("value");
  envVar = useModelState("env_variables");
  updateModelState(modelState);

  // inputRows is an array of of objects. Each object has properties
  // whose names are col names and whose values are strings or numbers.
  const inputRows: Map<string, any>[] = props.initialData;

  // rowsWithCells is an array of objects. Each object has properties
  // whose names are col names and whose values are strings, numbers, or formula cells.
  var rowsWithCells: any[] = [];
  for (let row of inputRows) {
    var rowWithCells: any = new Object();
    // Value is assigned by the cell-renderer automatically
    rowWithCells[ROW_NUMBER_COL_NAME] = null;
    // Add 'Aggregation' column to each row with 0 value
    // rowWithCells[AGGREGATE_COL_NAME] = new Cell({column: AGGREGATE_COL_NAME, value: 0});
    for (let cell of Object.entries(row)) {
      let col_name = cell[0];
      let cell_val = cell[1];
      let cellValue = new Cell({column: col_name});
      if (typeof cell_val == "string" && cell_val.startsWith("=")) {
        let formulaCell = new FormulaCell(cell_val.substr(1), null);
        cellValue.setFormulaCell(formulaCell);
      } else {
        col_name = cell[0];
        let cell_val = cell[1];

        // let toolTips = "<span style='marginLeft:5px;'border-left: 1px solid;background-color:red;>&nbsp;"+ cellValue.name +"</span>";
        cellValue.setValue(cell_val);
      }
      rowWithCells[col_name] = cellValue;
    }
    rowsWithCells.push(rowWithCells);
  }

  model = props.model;

  const [rowData, setRowData] = useState(rowsWithCells);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  // Formula text inside the formula bar
  const [formulaBarText, setFormulaBarText] = useState("");

  // Name text inside of the name bar
  const [nameBarText, setNameBarText] = useState("");

  const onGridReady = (event) => {
    // Set api and columnApi states when the grid is ready
    setGridApi(event.api);
    setColumnApi(event.columnApi);

    if (event.api != null) { 
      event.api?.forEachNode(rowNode => {
          for (const key in rowNode.data) {
            const cell = rowNode.data[key];
            
            if (cell && cell.formulaCell != null) {
              cell.formulaCell.setGridApi(event.api);
              cell.formulaCell.formula.createTree();
              cell.formulaCell.evaluate(new EvaluationContext(event.api,event.columnApi,rowNode.id,envVar,false));
            }
          }
      });
    }
    // If you want to resize all columns
    event.columnApi.autoSizeAllColumns();
    let headerNodes = getAllHeaderNodes();
    // Add onclick event listener to each header node.
    // When user is editing a cell and clicks on column header, this event
    // is used to fetch the column name clicked to set the value in cell.
    headerNodes.forEach((headerNode) => {
      headerNode.addEventListener("click", (event) => {
        onHeaderCellClicked(event);
      })
    });
    const allRowNodes = getAllRowNodes(event.api);
    // Set row node ids for all the cells
    allRowNodes.forEach(rowNode => {
      const rowData = rowNode.data;
      for (const col in rowData) {
        let cell = rowData[col];
        if (cell) {
          cell.setRowNodeId(rowNode.id);
        }
      }
    })


    recalculate(event, props.model);
  };

  const handleRowDragEnd = (event) => {
    // Code to be executed when the row dragging has stopped
    console.log("Row dragging has stopped");
    recalculate(event, props.model);
  };

  const onRowEditingStarted = (event) => {
    console.log("never called - not doing row editing");
  };

  const onRowEditingStopped = (event) => {
    console.log("never called - not doing row editing");
  };

  const onCellEditingStarted = (event) => {

    // Save the cell editor instance when cell editing start.
    // This instance is used to call setValue method when column header is clicked
    // while formula mode is active on the cell editor.
    const instances = event.api.getCellEditorInstances();
    if (instances.length > 0) {
      cellEditingContext.cellEditorInstance = instances[0];
    }
    // Set the formula mode depending on the type of cell instance
    const cellText = event.value?.formula;
    if (cellText) {
      cellEditingContext.formulaMode = true;
    } else {
      cellEditingContext.formulaMode = false;
    }
  };

  const onColumnMoved = (event) => {
    if (event.column != null) {
      recalculate(event, props.model);
      // After any cell value change, we need to update model state with the latest data
      updateModelValue(event);
    }
  };

  const onCellFocused = (e: CellFocusedEvent) => {
    //check for null values
    if (!e.column) {
      return;
    }
    if (e.rowIndex == null) {
      return;
    }
    //clear name bar text
    setNameBarText("");
    setFormulaBarText("");
    setNameIsValid({ hasError: false, message: "" });
    //get the location of the cell
    const colSelected = e.column["colId"];
    const rowIndex = e.rowIndex;
    const rowNode = e.api.getDisplayedRowAtIndex(rowIndex);
    //check for null value
    if (!rowNode) {
      return;
    }
    //obtain the cell to set the name bar and formula bar text
    const cellVal = rowNode.data[colSelected];
    //set the name bar text
    if (cellVal.name) {
      setNameBarText(cellVal.name);
    }
    if (cellVal.formulaCell) {
      let ctx = new FormulaStringContext(
        e.api,
      );
      setFormulaBarText(cellVal.formulaCell.formula.getFormula(ctx));
    } else {
      setFormulaBarText("");
    }
    //set the error message
    var id = rowIndex + "_" + colSelected;
    let isNameValid = validateName(cellVal.name, id, e.columnApi, nameCellMap);
    setNameIsValid({
      hasError: isNameValid["hasError"],
      message: isNameValid["message"],
    });
  };
  // Updates the model state value with the latest table data
  const updateModelValue = (event) => {
    let modelValue: any = [];
    const columnDefs = event.api.getColumnDefs();
    event.api.forEachNode((rowNode) => {
      const rowData = rowNode.data;
      let rowValue = {};
      for (const key in columnDefs) {
        const field = columnDefs[key]["field"];
        const cellVal = rowData[field];
        rowValue[field] = cellVal;
        if (cellVal && cellVal.value) {
          if (
            cellVal.value.kind == "NUMBER" ||
            cellVal.value.kind == "STRING"
          ) {
            rowValue[field] = cellVal.value.value;
          } else if (cellVal.value.kind == "ERROR") {
            rowValue[field] = cellVal.value;
          }
        }
      }
      modelValue.push(rowValue);
    });
    updateModelState(JSON.parse(JSON.stringify(modelValue)));
  };

  const onCellEditingStopped = (event) => {
    // Set formulaMode to false when cell editing stops
    cellEditingContext.formulaMode = false;
    cellEditingContext.cellEditorInstance = null;
    let gridOptions = cellEditingContext.gridOptions;
    let columnDefs = gridOptions.api.getColumnDefs();
    columnDefs.forEach((obj) => {
      obj.cellStyle = {
        backgroundColor: "#ffffff",
      };
    });
    gridOptions.api.setColumnDefs([]);
    gridOptions.api.setColumnDefs(columnDefs);
    gridOptions.columnDefs = columnDefs;
    // After any cell value change, we need to update model state with the latest data
    updateModelValue(event);
  };

  // Event which gets called when data is pasted from the clipboard onto any cell
  const processCellFromClipboard = (params: ProcessCellForExportParams) => {
    const colName = params.column.getColId();
    if (colName && params.node) {
      // Parse the clipboard data as a JSON
      const nodeData = JSON.parse(params.value);
      // Create a cell instance from the nodeData object
      const cell = new Cell(nodeData);
      if (typeof nodeData === "object" && nodeData.formulaCell) {
        // If the nodeData contains the formula, then update the formula bar text
        setFormulaBarText(nodeData.formulaCell.formula.str);
      }
      return cell;
    }
  };

  // Event which gets called when data is copied (copy/cut) into the clipboard
  const processCellForClipboard = (params: ProcessCellForExportParams) => {
    const colName: string = params.column.getColId();
    if (colName && params.node) {
      const cell = params.node.data[colName];
      let value;
      if (cell.formulaCell) {
        // If the cell is formula cell, we don't need to copy the gridApi and tree inside
        // cell.formulaCell.formula; set them to null while converting to JSON
        const formulaParseTree = cell.formulaCell.formula.tree;
        cell.formulaCell.formula.tree = null;
        cell.formulaCell.formula.gridApi = null;
        value = JSON.stringify(cell);
        // Restore the tree and gridApi
        cell.formulaCell.formula.tree = formulaParseTree;
        cell.formulaCell.formula.gridApi = params.api;
      } else {
        // Store the cell value in the clipboard as a string (needs to be parsed as a json when pasting)
        value = JSON.stringify(cell);
      }
      return value;
    }
  };

  // Event handler for CutStartEvent (triggered when ctrl+x is pressed on a cell)
  const onCutStart = (params: CutStartEvent) => {
    // Change the paste type to cut
    pasteType = PasteType.Cut;
  }

  // Event handler for PasteEndEvent (triggered when paste is completed)
  const onPasteEnd = (params: PasteEndEvent) => {
    // Change the paste type to copy again
    pasteType = PasteType.Copy;
    // Update the name bar text to the name of the focused cell
    const focusedCell = params.api.getFocusedCell();
    if (focusedCell) {
      const rowIndex = focusedCell.rowIndex;
      const colName = focusedCell.column.getColId();
      const rowNode = params.api.getDisplayedRowAtIndex(rowIndex);
      const cellValue = rowNode?.data[colName];
      if (cellValue) {
        setNameBarText(cellValue.name);
      }
    }
  }
  
  useEffect(() => {
    setRowData(rowsWithCells);
    props.gridOptions.api = gridApi;
    props.gridOptions.columnApi = columnApi;
    // props.gridOptions = {
    //   ...props.gridOptions,
    //   api: gridApi,
    //   columnApi: columnApi,
    // };
  }, [gridApi, columnApi, formulaBarText]);

  let columns = Object.keys(rowsWithCells[0]);

  let columnList = columns.map((column, index) => {
    let columnProperties = {
      field: column,
      editable: true,
      resizable: true,
      autoHeight: true,
      sortable: true,

      cellRenderer: NameRenderer,
      cellEditor: "formulaEditor",
      menuTabs: ["generalMenuTab"] as ColumnMenuTab[],
      headerValueGetter: (params) => {
        return params.colDef.field; // returns the header name as it is without capitalizing
      },
      valueSetter: (params: ValueSetterParams) =>
        cellValueSetter(params, props.model),
      valueGetter: (params: ValueGetterParams) => cellValueGetter(params),
      context: context,
      // headerComponent: ColumnHeader,
      // headerComponentParams: {
      //   enableSorting: true,
      //   enableMenu: true,
      //   menuIcon: "fa-bars",
      //   renameColumn: (
      //     gridOptions,
      //     colId,
      //     oldColumnName,
      //     newColumnName,
      //     element
      //   ) => {
      //     renameColumn(
      //       gridOptions,
      //       colId,
      //       oldColumnName,
      //       newColumnName,
      //       element,
      //       props.model
      //     );
      //   },
      //   onHeaderCellClicked: onHeaderCellClicked,
      // },
      cellDataType: false,
      lockPinned: true, // column cannot be pinned by dragging
    };
    if (column === ROW_NUMBER_COL_NAME) {
      columnProperties["cellClass"]=(params)=>{  
      // this introduces a new classname for these cells
        return 'firstColumnColor'; 
      };
      columnProperties["editable"] = false;
      columnProperties["rowDrag"] = true; // enable row-drag to reorder rows
      columnProperties["maxWidth"] = 80;
      columnProperties["headerName"] = "";
      columnProperties["sortable"] = false;
      columnProperties["suppressMovable"] = true; // column cannot be dragged
      columnProperties["lockPosition"] = "left"; // lock position fixed to the left
      columnProperties["resizable"] = false;
      columnProperties["suppressFillHandle"] = true;
    }
    if (column === AGGREGATE_COL_NAME) {
      columnProperties["headerName"] = "";
      columnProperties["lockPosition"] = "right";
    }
    return columnProperties;
  });

  const getMainMenuItems = useCallback((params) => {
    // For first column (Row_number), only allow 'Add Column Right' action
    if (params.column.colId === ROW_NUMBER_COL_NAME) {
      return [
        {
          name: "Add Column Right",
          action: () => {
            addColumn(props, params.column.getId(), Position.Right);
          },
        },
      ];
    }
    if (params.column.colId === AGGREGATE_COL_NAME) {
      return [
        {
          name: "Add Column Left",
          action: () => {
            addColumn(props, params.column.getId(), Position.Left);
          },
        },
      ];
    }
    return [
      {
        name: "Add Column Right",
        action: () => {
          addColumn(props, params.column.getId(), Position.Right);
        },
      },
      {
        name: "Add Column Left",
        action: () => {
          addColumn(props, params.column.getId(), Position.Left);
        },
      },
      {
        name: "Delete Column",
        action: () => {
          deleteColumn(props, params.column.getId());
        },
      },
    ];
  }, []);

  const onModelUpdated = (event: ModelUpdatedEvent) => {
    recalculate(event, props.model);
  }

  // Callback method for fill handle event
  const fillOperation = (fillOperationParams: FillOperationParams) => {
    const direction: string = fillOperationParams.direction;
    const currentIndex: number = fillOperationParams.currentIndex; // Array index of currently processed value from array of all values to be processed
    const curRowIndex: (number | null) = fillOperationParams.rowNode.rowIndex; // Row index of currently processed value
    if (curRowIndex === null) {
      return;
    }
    const curRowNode = fillOperationParams.api.getDisplayedRowAtIndex(curRowIndex);
    const initialValuesLength = fillOperationParams.initialValues.length; // Length of range selected used for fill-handle
    const colName = fillOperationParams.column.getColId();
    if (curRowIndex === null || curRowIndex === undefined) {
      return;
    }
    const selectedRange: CellRange[] | null = fillOperationParams.api.getCellRanges(); // Get the selected range being used for fill-handle
    if (!selectedRange || selectedRange.length === 0) {
      return;
    }

    const startRowIndex = selectedRange[0].startRow?.rowIndex;
    if (startRowIndex === null || startRowIndex === undefined) {
      return;
    }
    const startRowNode = fillOperationParams.api.getDisplayedRowAtIndex(startRowIndex);
    const endRowIndex = selectedRange[0].endRow?.rowIndex;
    if (endRowIndex === null || endRowIndex === undefined) {
      return;
    }
    const endRowNode = fillOperationParams.api.getDisplayedRowAtIndex(endRowIndex);

    // First, determine if the elements in the selected range are all numbers and have constant consecutive difference
    // If yes, use the constant difference to populate the values in the subsequent rows
    let areAllValuesNums: ([boolean, (number | null)] | null) = null;
    if (direction === "up" || direction === "down") {
      areAllValuesNums = areAllValuesNumbersWithContDiffInVertRange(fillOperationParams.api, selectedRange, fillOperationParams.column.getColId());
    } else if (direction === "left" || direction === "right") {
      areAllValuesNums = areAllValuesNumbersWithConstDiffInHorizRange(fillOperationParams.api, selectedRange, curRowIndex);
    }

    if (areAllValuesNums && Array.isArray(areAllValuesNums) && areAllValuesNums[0] === true) {
      let curCellValue = fillOperationParams.rowNode.data[colName];
      const constDiff = areAllValuesNums[1];
      if (constDiff !== null) {
        const selectedRangeColumns = selectedRange[0].columns;
        if (direction === "down") {
          let cellValue = endRowNode?.data[colName].value;
          if (startRowIndex > endRowIndex) {
            cellValue = startRowNode?.data[colName].value;
          }
          curCellValue.formulaCell = null;
          curCellValue.value = cellValue + constDiff * (currentIndex + 1);
          return curCellValue;
        } else if (direction == "up") {
          let cellValue = startRowNode?.data[colName].value;
          if (startRowIndex > endRowIndex) {
            cellValue = endRowNode?.data[colName].value;
          }
          curCellValue.formulaCell = null;
          curCellValue.value = cellValue + (-constDiff) * (currentIndex + 1);
          return curCellValue;
        } else if (direction === "right") {
          const lastSelectedColName = selectedRangeColumns[selectedRangeColumns.length - 1].getColId();
          const lastSelectedCellValue = curRowNode?.data[lastSelectedColName].value;
          const curCellValue = curRowNode?.data[colName];
          curCellValue.formulaCell = null;
          curCellValue.value = lastSelectedCellValue + constDiff * (currentIndex + 1);
          return curCellValue;
        } else if (direction === "left") {
          const firstSelectedColName = selectedRangeColumns[0].getColId();
          const firstSelectedCellValue = curRowNode?.data[firstSelectedColName].value;
          const curCellValue = curRowNode?.data[colName];
          curCellValue.formulaCell = null;
          curCellValue.value = firstSelectedCellValue + (-constDiff) * (currentIndex + 1);
          return curCellValue;
        }
      }
    }
    if (direction === "up" || direction === "down") {
      // startRowIndex indicates the row index of first row in the selected range
      // endRowIndex indicates the row index of last row in the selected range
      let startRowIndex = selectedRange[0].startRow?.rowIndex;
      let endRowIndex = selectedRange[0].endRow?.rowIndex;
      if (startRowIndex === null || startRowIndex === undefined || endRowIndex === null || endRowIndex === undefined) {
        return;
      }
      let relStartRowIndex = Math.min(startRowIndex, endRowIndex);
      // correspondingIndex indicates the array index in the selected range which should overwrite the value of currently processed value 
      let correspondingIndex = currentIndex % initialValuesLength;
      if (direction === "up") {
        // In case of upward direction, the index is reversed
        correspondingIndex = (initialValuesLength - 1) - correspondingIndex;
      }
      let correspondingRowIndex = relStartRowIndex + correspondingIndex;
      // Get the row node at corresponding index
      const correspondingRowNode = fillOperationParams.api.getDisplayedRowAtIndex(correspondingRowIndex);
      const correspondingCellValue = correspondingRowNode?.data[colName];
      let curCellValue = fillOperationParams.rowNode.data[colName];
      if (correspondingCellValue.formulaCell) {
        curCellValue.formulaCell = correspondingCellValue.formulaCell;
        return curCellValue;
      }
      curCellValue.formulaCell = null;
      curCellValue.value = correspondingCellValue.value;
      return curCellValue;
    } else if (direction === "left" || direction === "right") {
      const selectedRangeColumns = selectedRange[0].columns; // Get the columns in the selected range
      const allColumns = fillOperationParams.columnApi.getAllDisplayedColumns(); // Get all the columns in the table
      let allColumnNames: string[] = [];
      allColumns.forEach(col => {
        allColumnNames.push(col.getColId());
      })
      const firstColumnIndex = allColumnNames.indexOf(selectedRangeColumns[0].getColId());
      const currentIndex = fillOperationParams.currentIndex;
      let correspondingIndex = currentIndex % initialValuesLength;
      if (direction === "left") {
        correspondingIndex = (initialValuesLength - 1) - correspondingIndex;
      }
      const correspodingColIndex = firstColumnIndex + correspondingIndex;
      const correspondingColname = allColumnNames[correspodingColIndex];
      const cellValue = fillOperationParams.rowNode.data[correspondingColname];
      return cellValue;
    }
  }

  const createFooterData = () => {
    var row: any[] = [];
    var footerData = {};
    columns.forEach(column => {
      footerData[column] = new Cell({column: column, value: 0});
    })
    row.push(footerData);
    return row;
  }

  props.gridOptions.rowData = rowData;
  props.gridOptions.columnDefs = columnList;
  props.gridOptions.onGridReady = onGridReady;
  props.gridOptions.onModelUpdated = onModelUpdated;
  props.gridOptions.onRowEditingStarted = onRowEditingStarted;
  props.gridOptions.onRowEditingStopped = onRowEditingStopped;
  props.gridOptions.onCellEditingStarted = onCellEditingStarted;
  props.gridOptions.onCellEditingStopped = onCellEditingStopped;
  props.gridOptions.onCellFocused = onCellFocused;
  props.gridOptions.getMainMenuItems = getMainMenuItems;
  props.gridOptions.onColumnMoved = onColumnMoved;
  props.gridOptions.processCellForClipboard = processCellForClipboard;
  props.gridOptions.processCellFromClipboard = processCellFromClipboard;
  props.gridOptions.onCutStart = onCutStart;
  props.gridOptions.onPasteEnd = onPasteEnd;
  props.gridOptions.suppressMenuHide = true;
  props.gridOptions.rowSelection = "multiple";
  props.gridOptions.components = {
    agCellEditor: CellEditor,
  };
  props.gridOptions.context = context;
  props.gridOptions.rowDragManaged = true;
  // props.gridOptions.suppressColumnVirtualisation = true;
  props.gridOptions.enableRangeSelection = true;
  props.gridOptions.alwaysShowHorizontalScroll = true;
  props.gridOptions.suppressHorizontalScroll = false;
  props.gridOptions.stopEditingWhenCellsLoseFocus = true;
  props.gridOptions.getRowStyle = (params: RowClassParams): RowStyle | undefined => {
    if (params.node.rowPinned) {
      return { fontWeight: "bold" };
    }
  };
  props.gridOptions.pinnedBottomRowData = createFooterData();
  props.gridOptions.enableFillHandle = true;
  props.gridOptions.fillOperation = fillOperation;
  props.gridOptions.maintainColumnOrder = true;


  // props.gridOptions = {
  //   ...props.gridOptions,
  //   rowData: rowData,
  //   columnDefs: columnList,
  //   onGridReady: onGridReady,
  //   onModelUpdated: onModelUpdated,
  //   onRowEditingStarted: onRowEditingStarted,
  //   onRowEditingStopped: onRowEditingStopped,
  //   onCellEditingStarted: onCellEditingStarted,
  //   onCellEditingStopped: onCellEditingStopped,
  //   onCellFocused: onCellFocused,
  //   getMainMenuItems: getMainMenuItems,
  //   onColumnMoved: onColumnMoved,
  //   processCellForClipboard: processCellForClipboard,
  //   processCellFromClipboard: processCellFromClipboard,
  //   onCutStart: onCutStart,
  //   onPasteEnd: onPasteEnd,
  //   suppressMenuHide: true,
  //   rowSelection: 'multiple',
  //   components: {
  //     agCellEditor: CellEditor,
  //   },
  //   context: context,
  //   rowDragManaged: true,
  //   suppressColumnVirtualisation: true,
  //   enableRangeSelection: true,
  //   alwaysShowHorizontalScroll: true,
  //   suppressHorizontalScroll: false,
  //   stopEditingWhenCellsLoseFocus: true,
  //   getRowStyle: (params: RowClassParams): RowStyle | undefined => {
  //     if (params.node.rowPinned) {
  //       return { fontWeight: 'bold' };
  //     }
  //   },
  //   pinnedBottomRowData: createFooterData(),
  //   enableFillHandle: true,
  //   fillOperation: fillOperation,
  // };

  //Use State for checking if the input for name is valid
  const [nameIsValid, setNameIsValid] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });

  //Event listener for when the enter key is pressed, cell loses focus
  const onEnterKeyPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // The stopPropagation() method of the Event interface prevents further propagation of the current event in the capturing and bubbling phases
      event.stopPropagation();
      if (gridApi === null) {
        return;
      }
      const gridApi_: GridApi = gridApi;
      const focusedCell = gridApi_.getFocusedCell();
      if (!focusedCell) {
        return;
      }
      const rowIndex = focusedCell.rowIndex;
      const column = focusedCell.column.getColId();

      // Unfocus the cell from the input field by index
      gridApi_.setFocusedCell(rowIndex, column);
    }
  };
  const handleFormulaBarChange = (event) => {
    //Check if gridApi is defined
    if (!gridApi) {
      return;
    }
    if (!columnApi) {
      return;
    }

    //obtain the focused cell + location
    const gridApi_: GridApi = gridApi;
    const columnApi_: ColumnApi = columnApi;
    const focusedCell = gridApi_.getFocusedCell();
    if (!focusedCell) {
      return;
    }
    const rowIndex = focusedCell.rowIndex;
    const column = focusedCell.column.getColId();
    const rowNode = gridApi_.getDisplayedRowAtIndex(rowIndex);

    //get value of the cell that is being edited
    const cellValue = rowNode?.data[column];
   
    //ge the new formula from the formulaBar
    let formula_new = event.target.value;

    if (cellValue.formulaCell == null) { 
      cellValue.formulaCell=new FormulaCell(
        formula_new,
        gridApi_
      );
    }
 
    setFormulaBarText(formula_new);   
    cellValue.formulaCell.updateFormulaString(formula_new);

    if (rowNode && typeof rowNode.id === 'string') { // Check if rowNode.id is a string
      const evaluationContext = new EvaluationContext(gridApi, columnApi, rowNode.id, envVar, false);
      cellValue.formulaCell.evaluate(evaluationContext);
      // Evaluate the formula inside the FormulaCell
      gridApi_.refreshCells({
        rowNodes: [rowNode],
        columns: [column],
        force: true,
      });
    }  
  };

  

  const updateNameBarText = (event) => {
    //Check if gridApi is defined
    if (!gridApi) {
      return;
    }
    if(!columnApi){
      return;
    }
    //obtain the focused cell + location
    const gridApi_: GridApi = gridApi;
    const columnApi_: ColumnApi = columnApi;
    const focusedCell = gridApi_.getFocusedCell();
    if (!focusedCell) {
      return;
    }
    const rowIndex = focusedCell.rowIndex;
    const column = focusedCell.column.getColId();
    const rowNode = gridApi_.getDisplayedRowAtIndex(rowIndex);

    //get value of the cell that is being edited
    const cellValue = rowNode?.data[column];

    //Obtain the name of the event
    //const cell_name = event.target.value;
    let cell_name = event.target.value;
    var id = rowIndex + "_" + column;

    //if cell input is empty
    if (cell_name === "") {
      //clear error message
      setNameBarText("");
      cellValue.name = "";

      //check if rowNode is null
      if (rowNode === null || rowNode === undefined) {
        return;
      }

      //refresh grid
      gridApi_.refreshCells({
        rowNodes: [rowNode],
        columns: [column],
        force: true,
      });

      nameCellMap.set(id, "");
      return;
    
   
    // Recalculate all the cells after name is updated, 
    // since some cells may be referencing old named cell
    recalculateAllCells(gridApi_, columnApi_, props.model);
  }

      setNameBarText(cell_name);

      //set the validity of validateName method in the useState property
      let isNameValid = validateName(cell_name, id, columnApi, nameCellMap);

      setNameIsValid({
        hasError: isNameValid["hasError"],
        message: isNameValid["message"],
      });

      //set the name of the cell in the cell and the nameCellMap
      cellValue.name = cell_name;

      if (!isNameValid["hasError"]) {
        var nameExists = false;
        nameCellMap.set(id, cell_name);
      }

      //Refresh the column to display the name next to each value
      if (!rowNode) {
        return;
      }
      gridApi_.refreshCells({
        rowNodes: [rowNode],
        columns: [column],
        force: true,
      });
    //  ------
  };



  //Styling the Formula and Name Bar
  const barStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  };
  const textStyle = { marginRight: "1.2rem", verticalAlign: "middle" };
  const spanStyle = {
    display: "inline-block",
    padding: "0.4rem 0.5rem",
  };
  const nameBarInvalidStyle = {
    borderColor: "#FF0000",
    cursor: "pointer",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
  };

  let grid = (
    <div style={{ height: 1080, width: "100%" }}>
      <div style={{ height: "0.8rem" }}></div>
      <div style={barStyle}>
        <label
          htmlFor="formulaBar"
          style={{ marginRight: "1.2rem", verticalAlign: "middle" }}
        >
          Formula Bar
        </label>
        <input
          id="formulaBar"
          value={formulaBarText}
          onKeyDown={(e) => onEnterKeyPressed(e)}
          onChange={(e) => handleFormulaBarChange(e)}
          style={{
            height: "1.1rem",
            backgroundColor: "#F0F0F0",
            verticalAlign: "middle",
          }}
        />
      </div>
      <div style={barStyle}>
        <label htmlFor="nameBar" style={textStyle}>
          Name Bar
        </label>
        <input
          id="nameBar"
          placeholder="Insert Name Here"
          value={nameBarText}
          onKeyDown={(e) => onEnterKeyPressed(e)}
          onChange={(e) => updateNameBarText(e)}
          style={{
            height: "1.1rem",
            backgroundColor: nameBarText ? "#FFFFFF" : "#F0F0F0",
            verticalAlign: "middle",
            color: nameBarText ? "#000000" : "#808080",
            borderColor: nameIsValid["hasError"] ? "#FF0000" : "#000000",
            ...spanStyle,
            ...(!nameIsValid["hasError"] ? {} : nameBarInvalidStyle),
          }}
        />
        {nameIsValid["hasError"] && (
          <span style={{ ...spanStyle, marginLeft: "0.5rem" }}>
            {nameIsValid["message"]}
          </span>
        )}
      </div>
      <div
        className="ag-theme-alpine"
        style={{
          height: 600,
          maxHeight: 1000,
          width: 1000,
          marginBottom: "auto",
          resize: "both",
          overflow: "auto",
        }}
      >
        <AgGridReact
          maintainColumnOrder={true}
          gridOptions={props.gridOptions}
          onCellFocused={onCellFocused}
          onRowDragEnd={handleRowDragEnd}
        ></AgGridReact>
      </div>
    </div>
  );
  cellEditingContext.gridOptions = props.gridOptions;
  return grid;
}

export function addColumn(props, id = "None", pos: Position) {
  let cols = props.gridOptions.api.getColumnDefs();
  let newName = "Column_".concat(col_num.toString());
  col_num += 1;

  let new_col = {
    field: newName,
    editable: true,
    resizable: true,
    autoHeight: true,
    sortable: true,
    cellEditor: "formulaEditor",
    menuTabs: ["generalMenuTab"] as ColumnMenuTab[],
    valueSetter: (params: ValueSetterParams): boolean =>
      cellValueSetter(params, props.model),
    valueGetter: (params: ValueGetterParams) => cellValueGetter(params),
    headerValueGetter: (params) => {
      return params.colDef.field; // returns the header name as it is without capitalizing
    },
    context: context,
    // headerComponent: ColumnHeader,
    // headerComponentParams: {
    //   enableSorting: true,
    //   menuIcon: "fa-bars",
    //   renameColumn: (
    //     gridOptions,
    //     colId,
    //     oldColumnName,
    //     newColumnName,
    //     element
    //   ) => {
    //     renameColumn(
    //       gridOptions,
    //       colId,
    //       oldColumnName,
    //       newColumnName,
    //       element,
    //       props.model
    //     );
    //   },
    //   onHeaderCellClicked: onHeaderCellClicked,
    // },
    cellDataType: false,
  };

  // This looks through our columns to see if that column exists in the table
  // if the column exists, we want to add a new column in between two columns,
  // so we find the index of where to insert and then insert the new column there.
  if (cols.some((e) => e["field"] == id)) {
    let idx = 0;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i]["field"] == id) {
        idx = i;
        break;
      }
    }
    if (pos == Position.Right) {
      cols.splice(idx + 1, 0, new_col);
    } else if ((pos = Position.Left)) {
      cols.splice(idx, 0, new_col);
    }
  } else {
    cols?.push(new_col);
  }
  // props.gridOptions.api.setColumnDefs([]);
  props.gridOptions.api.setColumnDefs(cols);
  props.gridOptions.columnDefs = cols;

  // Loop through each row and update the new column value
  const allRowNodes = getAllRowNodes(props.gridOptions.api);
  allRowNodes.forEach(node => {
    let cellValue = new Cell({column: newName, rowNodeId: node.id});
    cellValue.setValue(0);
    node.setDataValue(new_col.field, cellValue);
  });

  // Add onClick event listener to newly added column
  const columnSelector: string = HEADER_CLASS + `[col-id="${newName}"]`;
  const headerNode = document.querySelector(columnSelector);
  headerNode?.addEventListener("click", (event) => {
    onHeaderCellClicked(event);
  });
  recalculate(props.gridOptions, props.model);
}

export function addRow(props, pos = "None") {
  const cols = props.gridOptions.api.getColumnDefs();
  // Create a dummy row with value for each column initialized to 0
  const initialRowValue = {};
  cols.forEach((column) => {
    const columnName = column.colId;
    let cellValue = new Cell({column: columnName});
    cellValue.setValue(0);
    initialRowValue[columnName] = cellValue;
  })
  let newRowNodeId: string | null | undefined = null;
  let txnRes: RowNodeTransaction | null = null;
  if (props.gridOptions.api.getSelectedRows().length == 0) {
    txnRes = props.gridOptions.api?.applyTransaction({ add: [initialRowValue] });
  } else {
    let addIndex = props.gridOptions.api.getSelectedNodes()[0]["rowIndex"];
    if (pos == "After") {
      txnRes = props.gridOptions.api?.applyTransaction({ add: [initialRowValue], addIndex: addIndex + 1 });
    } else if (pos == "Before") {
      txnRes = props.gridOptions.api?.applyTransaction({ add: [initialRowValue], addIndex: addIndex });
    } else{
      txnRes = props.gridOptions.api?.applyTransaction({ add: [initialRowValue] });
    }
  }
  if (txnRes && txnRes.add && txnRes.add.length > 0) {
    newRowNodeId = txnRes.add[0].id;
    // Update row node ids for all the cells in the newly added row
    let rowNode = props.gridOptions.getRowNode(newRowNodeId);
    const rowData = rowNode.data;
    for (const col in rowData) {
      let cell = rowData[col];
      if (cell) {
        cell.setRowNodeId(rowNode.id);
      }
    }
  }
  recalculate(props.gridOptions, props.model);
}

export function createAddColButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => addColumn(props, "None", Position.NoPos)}
    >
      Add Column
    </button>
  );
  return button;
}

export function createAddRowButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => addRow(props)}
    >
      Add Row
    </button>
  );
  return button;
}

export function createAddRowAfterButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => addRow(props, "After")}
    >
      Add Row After
    </button>
  );
  return button;
}

export function createAddRowBeforeButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => addRow(props, "Before")}
    >
      Add Row Before
    </button>
  );
  return button;
}

export function createDeleteRowButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => deleteRow(props)}
    >
      Delete Row
    </button>
  );
  return button;
}

export function createCopyRowsButton(props: WidgetProps) {
  let button = (
    <button
      style={{ height: "4rem", width: "6rem" }}
      onClick={() => copyRows(props)}
    >
      Copy Rows
    </button>
  );
  return button;
}


export function deleteColumn(props, id = "None") {
  let cols = props.gridOptions.api.getColumnDefs();
  if (cols.some((e) => e["field"] == id)) {
    let idx = 0;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i]["field"] == id) {
        idx = i;
      }
    }
    // Remove first column at index idx
    cols.splice(idx, 1);
    // Delete row data for old column name
    props.gridOptions.api.forEachNode((node, _) => {
      delete node.data[id];
    });
    props.gridOptions.api.setColumnDefs([]);
    props.gridOptions.api.setColumnDefs(cols);
    props.gridOptions.columnDefs = cols;
    recalculate(props.gridOptions, props.model);
  }
}

export function deleteRow(props) {
  const selectedRows = props.gridOptions.api.getSelectedRows();
  props.gridOptions.api.applyTransaction({ remove: selectedRows });
  recalculate(props.gridOptions, props.model);
}

export function copyRows(props) {
  let val = props.gridOptions.api.getSelectedRows();
  navigator.clipboard.writeText(convertToTabSeparated(JSON.stringify(val)));
}

function convertToTabSeparated(input: string): string {
  try {
    const data = JSON.parse(input);

    if (!Array.isArray(data)) {
      throw new Error("Input JSON is not an array.");
    }

    return data
      .map(row => {
        // Filter out the "RN" field and keep the nested objects
        return Object.entries(row)
          .filter(([key]) => key !== "RN")
          .map(([, value]) => JSON.stringify(value))
          .join("\t");
      })
      .join("\n");
  } catch (error) {
    console.error("Failed to parse input or format output:", error);
    return "";
  }
}

export function extractCols(gridApi: GridApi, columnApi: ColumnApi) {
  return columnApi.getColumns();
}