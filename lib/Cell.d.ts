import { FormulaCell } from "./formulacell";
export declare class Cell {
    name: string | null;
    formulaCell: FormulaCell | null;
    value: any;
    rowNodeId: string;
    constructor(params: any);
    setValue(value: any): void;
    getValue(): any;
    setFormulaCell(formulaCell: FormulaCell): void;
    getFormulaCell(): FormulaCell | null;
    setName(name: string): void;
    getName(): string | null;
    setRowNodeId(rowNodeId: string): void;
    getRowNodeId(): string;
}
