"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
// Class composition of FormulaCell and NameCell
class Cell {
    // rowNodeId of the cell remains cell even if the order of rows are permuted
    constructor(params) {
        this.name = null;
        this.formulaCell = null;
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
    setValue(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    setFormulaCell(formulaCell) {
        this.formulaCell = formulaCell;
    }
    getFormulaCell() {
        return this.formulaCell;
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setRowNodeId(rowNodeId) {
        this.rowNodeId = rowNodeId;
    }
    getRowNodeId() {
        return this.rowNodeId;
    }
}
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map