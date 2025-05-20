import { DepNodeType } from './dependencyGraphUtils';
import { Formula, FormulaValue } from './formula';
import { GridApi } from 'ag-grid-community';
import { EvaluationContext } from './formula';
export declare class FormulaCell {
    value: FormulaValue;
    formula: Formula;
    precedents: Set<DepNodeType> | null;
    constructor(formulaString: string, gridApi: GridApi | null, value?: FormulaValue, precedents?: Set<DepNodeType> | null);
    updateFormulaString(newFormulaString: string): void;
    setGridApi(gridApi: GridApi): void;
    evaluate(ctx: EvaluationContext): void;
    toString(): String;
}
