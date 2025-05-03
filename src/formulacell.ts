import { DepNodeType } from './dependencyGraphUtils';
import { Formula, FormulaValue, ERROR, STRING, NUMBER, EMPTY, formulaNumber, BOOLEAN} from './formula'

import { GridApi } from 'ag-grid-community';

import { EvaluationContext } from './formula';

export class FormulaCell {
    value: FormulaValue;
    formula: Formula;
    // Set of cells on which this formula cell depend on
    precedents: Set<DepNodeType> | null;

    constructor(formulaString: string,  gridApi: GridApi | null, value?: FormulaValue, precedents?: Set<DepNodeType> | null) {
        this.value = formulaNumber(new Number(0.0));
        this.formula = new Formula(formulaString, gridApi);
        this.precedents = new Set();
        if (value) {
            this.value = value;
        }
        if (precedents) {
            this.precedents = precedents;
        }
    }

    
    updateFormulaString(newFormulaString: string) {
        this.formula.str = newFormulaString;
        this.formula.createTree();
    }
    setGridApi(gridApi: GridApi) { 
        this.formula.gridApi = gridApi;
    }
      
    evaluate(ctx: EvaluationContext) {
        this.value = this.formula.value(ctx, this);
    }

    toString(): String {            
        switch(this.value.kind) {
            case ERROR:
                return "Error: " + this.value.value;
            case NUMBER:
                return this.value.toString();
            case STRING: 
                return this.value.value;
            case BOOLEAN:
                return this.value.toString();
            case EMPTY:
                return "";
        }
    }
}