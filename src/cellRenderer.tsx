import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Cell } from "./Cell";
import { FormulaCell } from "./formulacell";
import { ROW_NUMBER_COL_NAME } from './grid';

/* 
Cell Renderer: There is Value Formatter and Cell Renderer. 
Cell Renderer is better because Value Formatter is for text markup while Cell Renderer allows you to put whatever HTML you want into a cell.
This means that there is redundant code both here and in Create Grid. It is better to keep the Cell Renderer code because Create Grid does not allow styling elements inside of it.
*/
//export interface and export default:
//I just copied and pasted the example from ag-grid and then modified it for this context lol
export interface cellRendererParams extends ICellRendererParams {
  value: Cell;
}

export default (props: cellRendererParams) => {
  //check for null values
  if (props.data === null) {
    return "";
  }
  if (props.column === undefined || null) {
    return "";
  }

  if (props.column.getColId() === ROW_NUMBER_COL_NAME) {
    return props.rowIndex;
  }

  //obtain cell object then check if it's null
  let cell = props.data[props.column.getColId()];

  if (cell === null) {
    return "";
  }

  //get the name and value
  let name = cell.name;
  let value = cell.value;

  //check if name or value are null, then set them to empty strings so it doesn't show up as "null" on the grid
  if (name === null) {
    name = "";
  }
  if (value === null) {
    value = "";
  }
  if (value === false || value === true) {
    value = value.toString().toUpperCase();
  }
  
  if (cell.formulaCell !== null){
    if (cell.formulaCell instanceof FormulaCell) {
      if (cell.formulaCell.value !== null && cell.formulaCell.value.value !== null && cell.formulaCell.value.value!=undefined) {
        value = cell.formulaCell.value.value.toString();
      }
      else if (cell.formulaCell.value !== null && cell.formulaCell.value.vector && cell.formulaCell.value.vector instanceof Array) {
        value = "It's a vector. Can't display it";
      }
    }
    // else { 
    //   value="Its a vector. Can't display it"
    // }
  }

  //style the value and name next to each other
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          // Add dotted border to the right of the name
          borderRight: "1px dotted",
          paddingRight: "4px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          backgroundColor: "#ECCAFF",
        }}
      >
        {name}
      </span>
      <span style={{marginLeft: "8px", marginRight: "5px" }}>{value}</span>
    </div>
  );
};