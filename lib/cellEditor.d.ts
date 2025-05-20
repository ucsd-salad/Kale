import React from "react";
import { ColDef, GridApi, ColumnApi, Column, RowNode } from "ag-grid-community";
import { FormulaCell } from "./formulacell";
interface IforwardRefProps {
    api: GridApi;
    colApi: ColumnApi;
    keyPress?: number;
    charPress?: string;
    value?: string | number | boolean | FormulaCell;
    context: {
        [key: string]: (event: any) => void;
    };
    colDef: ColDef;
    data: object;
    column: Column;
    node: RowNode;
}
interface IforwardRefForwardedRef {
}
declare const _default: React.ForwardRefExoticComponent<IforwardRefProps & React.RefAttributes<IforwardRefForwardedRef>>;
export default _default;
