import React, { useState, useRef, ReactElement } from "react";
import { EvaluationContext } from "./formula";
import { nameCellMap } from "./grid";

// Custom Column Header Component
// https://www.ag-grid.com/react-data-grid/component-header/
//const { cellIsValid } = getCellIsValidState();
export var columnHeaderList;

function validateColumnHeaderName(
  name: string,
  id: string,
  columnHeaderList
): object {
  let result = { hasError: false, message: "" };

  //if name is empty
  if (name.length === 0) {
    result.hasError = true;
    result.message = "ERROR: Cannot Be Empty";
  }
  //if name contains spaces
  if (name.includes(" ")) {
    result.hasError = true;
    result.message = "ERROR: Cannot Contain Spaces";
  }
  for (const [cellId, cellName] of nameCellMap) {
    if (cellName === name) {
      result.hasError = true;
      result.message = "ERROR: Name Already Exists For Name Cell";
      return result;
    }
  }
  //if name already exists for a column header
  for (let i = 0; i < columnHeaderList.length; i++) {
    if (
      columnHeaderList[i].colId === name &&
      columnHeaderList[i].colId !== "" &&
      columnHeaderList[i].instanceId !== id
    ) {
      result.hasError = true;
      result.message = "ERROR: Name Already Exists";
      return result;
    }
  }
  return result;
}

export default (props) => {
  const [editing, setEditing] = useState(false); // indicates whether the header is in edit mode or not
  const [headerName, setHeaderName] = useState(props.displayName);

  const [isValidHeaderName, setIsValidHeaderName] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });

  const previousHeaderName = props.displayName;
  const refButton = useRef(null);
  const ROW_NUMBER_COL_NAME = "RN";
  const ASC = "asc";
  const DESC = "desc";
  const NO_SORT = "";

  // Show the menu items
  const onMenuClicked = () => {
    props.showColumnMenu(refButton.current);
  };

  let menu: ReactElement | null = null;
  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => onMenuClicked()}
      >
        <i className={`fa ${props.menuIcon}`}></i>
      </div>
    );
  }

  const onBlur = () => {
    setEditing(false);
    if (!isValidHeaderName.hasError) {
      props.renameColumn(
        props,
        props.column.colId,
        previousHeaderName,
        headerName,
        props.eGridHeader
      );
    }
    // Else, keep the current column name
    else {
      setHeaderName(previousHeaderName);
    }
  };

  const onEnterKeyPressed = (event) => {
    if (event.key === "Enter") {
      setEditing(false);
      // If the cell name is valid, rename column
      if (!isValidHeaderName.hasError) {
        props.renameColumn(
          props,
          props.column.colId,
          previousHeaderName,
          headerName,
          props.eGridHeader
        );
      }
      // Else, keep the current column name
      else {
        setHeaderName(previousHeaderName);
      }
    }
  };
  
  // Event listener on change of column header name
  const onHeaderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    let colName = event.target.value;
    setMessage(colName);

    columnHeaderList = props.columnApi.getColumns();
  };

  // Event listener on click of column header
  const onHeaderColumnClicked = (event) => {

    setMessage(event.target.textContent);

    if (headerName == ROW_NUMBER_COL_NAME) {
      return;
    }
    // Click of column header has two different behaviors:
    // 1. If no cell is being edited, then it allows to rename the column header name
    // 2. Else, if a cell is being edited, then it allows to populate the column name in the cell (Formula mode)
    if (props.api.getEditingCells().length == 0) {
      // temporarily disable column renaming
      // setEditing(true);
    } else {
      props.onHeaderCellClicked(event);
    }
  };

  //sets the column name and message
  const setMessage = (colName: string): void => {
    //obtain the column name
    let colId = props.column.instanceId;

    setIsValidHeaderName({
      hasError: false,
      message: "",
    });
    //check if column name is valid
    let colVal = validateColumnHeaderName(
      colName,
      colId,
      props.columnApi.getColumns()
    );
    setIsValidHeaderName({
      hasError: colVal["hasError"],
      message: colVal["message"],
    });
    //set the column name in the header
    setHeaderName(colName);
    //update the columnHeaderList
    columnHeaderList = props.columnApi.getColumns();
  };

  // Evaluates the cell value (returns the evaluated value if the cell has a formula,
  // else just return the cell value if the cell contains a value of primitive type)
  const evaluateCellValue = (cellValue, gridApi, columnApi, rowId) => {
    if (!cellValue.formulaCell) {
      return cellValue.value;
    }
    let ctx = new EvaluationContext(
      gridApi,
      columnApi,
      rowId,
      props.context.envVar,
      false
    );
    cellValue.formulaCell.evaluate(ctx);
    return cellValue.formulaCell.value.value;
  };

  type Dictionary = { [key: string]: object };

  const onSortRequested = (order, event) => {
    if (order == NO_SORT) {
      // Restore original order
      return;
    }
    const colName = props.column.getColId();
    let table: Dictionary[] = [];
    // Store the table data as a list of row node data
    // Push all the row nodes except the footer node
    props.api.forEachNode((rowNode) => {
      table.push(rowNode);
    });
    // Store table based on current column
    table.sort((rowNode1, rowNode2) => {
      // Read current column value
      const cellValue1 = rowNode1.data[colName];
      const cellValue2 = rowNode2.data[colName];
      const evaluatedCellValue1 = evaluateCellValue(
        cellValue1,
        props.api,
        props.columnApi,
        rowNode1.id
      );
      const evaluatedCellValue2 = evaluateCellValue(
        cellValue2,
        props.api,
        props.columnApi,
        rowNode1.id
      );
      if (order == ASC) {
        if (evaluatedCellValue1 < evaluatedCellValue2) {
          return -1;
        }
        if (evaluatedCellValue1 > evaluatedCellValue2) {
          return 1;
        }
        return 0;
      } else if (order == DESC) {
        if (evaluatedCellValue1 > evaluatedCellValue2) {
          return -1;
        }
        if (evaluatedCellValue1 < evaluatedCellValue2) {
          return 1;
        }
        return 0;
      }
      return 0;
    });
    let rowData: object[] = [];

    table.forEach((rowNode) => {
      rowData.push(rowNode.data);
    });

    //iterate through column and update nameCellMap
    rowData.forEach((node, index) => {
      const colSelected = props.column.getColId();
      const newId = index + "_" + colSelected;
      const cellVal = node[colSelected];
      if(cellVal != null && cellVal.name){
        for(const [key, value] of nameCellMap){
          if(nameCellMap.get(key) === cellVal.name){
            nameCellMap.delete(key);
          }
        }
        nameCellMap.set(newId, cellVal.name);
      }
    });
    // Update the row data of the table
    props.api.setRowData(rowData);
  };

  let sortElement: ReactElement | null = null;
  // if (props.enableSorting) {
    sortElement = (
      <div>
        <div
          style={{ display: "inline-block" }}
          onClick={(event) => onSortRequested(ASC, event)}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </div>
        <div
          style={{ display: "inline-block" }}
          onClick={(event) => onSortRequested(DESC, event)}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </div>
      </div>
    );
  // }

  const invalidHeaderStyle = {
    border: isValidHeaderName.hasError ? "2px solid red" : "none",
  };

  return (
    <div>
      {editing ? (
        <div>
          <input
            type="text"
            value={headerName}
            onChange={onHeaderNameChange}
            autoFocus
            onBlur={onBlur}
            onKeyDown={(e) => onEnterKeyPressed(e)}
            style={invalidHeaderStyle}
          />
          {isValidHeaderName["hasError"] && (
            <div
              style={{
                color: "red",
                whiteSpace: "normal",
                resize: "both",
                fontSize: "10px",
              }}
            >
              {isValidHeaderName["message"]}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="columnHeader" onClick={onHeaderColumnClicked}>
            {headerName === ROW_NUMBER_COL_NAME ? "" : headerName}
          </div>
          <span style={{ marginLeft: "0.15rem", display: "inline-block" }}>
            {menu}
          </span>
          <span style={{ marginLeft: "1rem", display: "inline-block" }}>
            {headerName !== ROW_NUMBER_COL_NAME && sortElement}
          </span>
        </div>
      )}
    </div>
  );
};
