// Use this file for grid border functions, buttons, adding cols, saving, etc. (this file file sort of combines everything together)
// Create a new file called grid, that is primarily for grid functions and re-rendering the grid.
// Add buttons in here, create separate file for each button, add functionality to button files.

import React from "react";
import { WidgetModel } from "./widget";
import {
  createGrid,
  createAddColButton,
  createAddRowButton,
  createAddRowAfterButton,
  createAddRowBeforeButton,
  createDeleteRowButton,
  createCopyRowsButton,
} from "./grid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../css/react-widget.css';
import { GridOptions } from "ag-grid-community";

export interface WidgetProps {
  model: WidgetModel;
  gridOptions: any;
  initialData: any[];
}

export default function ReactWidget(props: WidgetProps) {
  let grid = createGrid(props);
  let colButton = createAddColButton(props);
  let rowButton = createAddRowButton(props);
  // let rowAfterButton = createAddRowAfterButton(props);
  // let rowBeforeButton = createAddRowBeforeButton(props);
  let deleteRowButton = createDeleteRowButton(props);
  let copyRowsButton = createCopyRowsButton(props);

  return (
    <div>
      <div className="action-buttons">
        {colButton}
        {rowButton}
        {deleteRowButton}
        {copyRowsButton}
      </div>
      {grid}
    </div>
  );
}