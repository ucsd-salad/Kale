"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaCell = void 0;
const formula_1 = require("./formula");
class FormulaCell {
    constructor(formulaString, gridApi, value, precedents) {
        this.value = (0, formula_1.formulaNumber)(new Number(0.0));
        this.formula = new formula_1.Formula(formulaString, gridApi);
        this.precedents = new Set();
        if (value) {
            this.value = value;
        }
        if (precedents) {
            this.precedents = precedents;
        }
    }
    updateFormulaString(newFormulaString) {
        this.formula.str = newFormulaString;
        this.formula.createTree();
    }
    setGridApi(gridApi) {
        this.formula.gridApi = gridApi;
    }
    evaluate(ctx) {
        this.value = this.formula.value(ctx, this);
    }
    toString() {
        switch (this.value.kind) {
            case formula_1.ERROR:
                return "Error: " + this.value.value;
            case formula_1.NUMBER:
                return this.value.toString();
            case formula_1.STRING:
                return this.value.value;
            case formula_1.BOOLEAN:
                return this.value.toString();
            case formula_1.EMPTY:
                return "";
        }
    }
}
exports.FormulaCell = FormulaCell;
//# sourceMappingURL=formulacell.js.map