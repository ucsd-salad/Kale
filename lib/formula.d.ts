import { ColumnApi, GridApi } from "ag-grid-community";
import { FormulaStringContext } from "./formulaStringVisitor";
import { ProgContext } from "./FormulaParser";
import { FormulaCell } from "./formulacell";
export declare const NUMBER = "NUMBER";
export declare const BOOLEAN = "BOOLEAN";
export declare const STRING = "STRING";
export declare const ERROR = "ERROR";
export declare const EMPTY = "EMPTY";
export declare const REFERENCE = "REFERENCE";
export declare const ROW_REFERENCE = "ROW_REFERENCE";
export declare const QUERY = "QUERY";
export declare const TRUE = "TRUE";
export declare const FALSE = "FALSE";
export declare const BOOLEAN_STRING_MAPPING: Map<boolean, string>;
type DecimalValue = {
    kind: "NUMBER";
    value: Number;
};
type BooleanValue = {
    kind: "BOOLEAN";
    value: Boolean;
};
type StringValue = {
    kind: "STRING";
    value: string;
};
type FormulaError = {
    kind: "ERROR";
    value: string;
};
type EmptyCellValue = {
    kind: "EMPTY";
    value: string;
};
type ReferenceValue = {
    kind: "REFERENCE";
    value: string;
};
type RowReferenceValue = {
    kind: "ROW_REFERENCE";
    value: number;
};
type QueryValue = {
    kind: "QUERY";
    referenced_column: any;
    vector: number[] | boolean[];
};
export declare let formulaError: (msg: string) => FormulaError;
export declare let formulaNumber: (x: Number) => DecimalValue;
export declare let formulaBoolean: (b: Boolean) => BooleanValue;
export declare let formulaString: (s: string) => StringValue;
export declare let emptyCell: EmptyCellValue;
export declare let referenceValue: (r: string) => ReferenceValue;
export declare let rowReferenceValue: (r: number) => RowReferenceValue;
export declare let queryValue: (referenced_column: any, vector: number[] | boolean[]) => QueryValue;
export type FormulaValue = DecimalValue | BooleanValue | StringValue | FormulaError | EmptyCellValue;
export declare class EvaluationContext {
    gridApi: GridApi;
    columnApi: ColumnApi;
    inRowId: string;
    envVar: object;
    trackingDependencies: boolean;
    constructor(gridApi: GridApi, columnApi: ColumnApi, inRowId: string, envVar: object, trackingDependencies: boolean);
    getCellValue(colName: string, rowId: string): FormulaValue;
    getColumnValueReference(colName: string, focuscedColumn: string | undefined): ReferenceValue | FormulaError;
    getRowReference(rowIndex: number): FormulaError | RowReferenceValue;
    getValueOfColumnCell(nodeData: any): Number | number | undefined;
    applyFnOnColumnValues(colName: any, result: any, callableFunc: (...args: any) => any): any;
    applyFnOnRowValues(rowIndex: number, result: any, callableFunc: (...args: any) => any): any;
}
export declare class Formula {
    str: string;
    gridApi: GridApi | null;
    tree: ProgContext | undefined;
    constructor(str: string, gridApi: GridApi | null);
    createTree(): void;
    getFormula(ctx: FormulaStringContext): any;
    value(ctx: EvaluationContext, formulaCell: FormulaCell): FormulaValue;
}
export {};
