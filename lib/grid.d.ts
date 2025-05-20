import React from "react";
import { WidgetModel } from "./widget";
import { GridApi, ColumnApi } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "../css/widget.css";
import { WidgetProps } from "./ReactWidget";
declare enum Position {
    Right = 0,
    Left = 1,
    NoPos = 2
}
export declare const NAMED_CELL_PREFIX = "#namedcell:";
export declare const ROW_NUMBER_COL_NAME = "#";
export declare const AGGREGATE_COL_NAME = "Aggregation";
export declare var nameCellMap: Map<string, string>;
export declare function recalculateAllCells(gridApi: GridApi, columnApi: ColumnApi, model: WidgetModel): void;
export declare function validateName(name: string, id: string, columnApi: ColumnApi | null, cellMap: Map<string, string>): object;
/**
 *  Handles renaming of column
 */
export declare const renameColumn: (gridOptions: any, colId: any, oldColumnName: any, newColumnName: any, element: any, model: any) => "" | undefined;
export declare function createGrid(props: WidgetProps): React.JSX.Element;
export declare function addColumn(props: any, id: string | undefined, pos: Position): void;
export declare function addRow(props: any, pos?: string): void;
export declare function createAddColButton(props: WidgetProps): React.JSX.Element;
export declare function createAddRowButton(props: WidgetProps): React.JSX.Element;
export declare function createAddRowAfterButton(props: WidgetProps): React.JSX.Element;
export declare function createAddRowBeforeButton(props: WidgetProps): React.JSX.Element;
export declare function createDeleteRowButton(props: WidgetProps): React.JSX.Element;
export declare function createCopyRowsButton(props: WidgetProps): React.JSX.Element;
export declare function deleteColumn(props: any, id?: string): void;
export declare function deleteRow(props: any): void;
export declare function copyRows(props: any): void;
export declare function extractCols(gridApi: GridApi, columnApi: ColumnApi): import("ag-grid-community").Column<any>[] | null;
export {};
