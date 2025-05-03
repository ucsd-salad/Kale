// Superclass for the name and formula bar
import { FormulaCell } from "./formulacell";

// Class composition of FormulaCell and NameCell
export class Cell {
    name: string | null = null;
    formulaCell: FormulaCell | null = null;
    value: any;
    rowNodeId: string; // stores the rowNodeId of the grid table 
    // rowNodeId of the cell remains cell even if the order of rows are permuted

    constructor(params) {
        if (params.name) {
            this.name = params.name;
        }
        if (params.formulaCell) {
            this.formulaCell = params.formulaCell;
        }
        if (params.value !== null || params.value !== undefined) {
            this.value = params.value;
        }
        if (params.rowNodeId) {
            this.rowNodeId = params.rowNodeId;
        }
    }
  
    setValue(value: any) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    setFormulaCell(formulaCell: FormulaCell) {
        this.formulaCell = formulaCell;
    }

    getFormulaCell() {
        return this.formulaCell;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setRowNodeId(rowNodeId: string) {
        this.rowNodeId = rowNodeId;
    }

    getRowNodeId() {
        return this.rowNodeId;
    }
}
