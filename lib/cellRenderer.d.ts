import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Cell } from "./Cell";
export interface cellRendererParams extends ICellRendererParams {
    value: Cell;
}
declare const _default: (props: cellRendererParams) => number | "" | React.JSX.Element;
export default _default;
