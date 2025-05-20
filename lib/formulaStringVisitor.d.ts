import { GridApi } from "ag-grid-community";
import { FormulaValue } from "./formula";
import { AdditionOrSubtractionContext, FunctionContext, MultiplicationOrDivisionContext, NegativeExpressionContext, PositiveExpressionContext, NumberContext, ReferenceContext, StringContext, EnvironmentalVariableContext, AbsoluteReferenceContext, AbsRowReferenceContext, RelativeRowReferenceContext, ParenthesesContext, TrueContext, FalseContext, ComparisonContext } from "./FormulaParser";
import { FormulaVisitor } from "./FormulaVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
export declare class FormulaStringContext {
    gridApi: GridApi;
    constructor(gridApi: GridApi);
}
export declare class FormulaStringVisitor extends AbstractParseTreeVisitor<FormulaValue> implements FormulaVisitor<FormulaValue> {
    evaluationContext: FormulaStringContext;
    constructor(ctx: FormulaStringContext);
    protected defaultResult(): FormulaValue;
    visitTrue(ctx: TrueContext): any;
    visitFalse(ctx: FalseContext): any;
    visitFunction(ctx: FunctionContext): any;
    visitMultiplicationOrDivision(ctx: MultiplicationOrDivisionContext): FormulaValue;
    visitAdditionOrSubtraction(ctx: AdditionOrSubtractionContext): FormulaValue;
    visitComparison(ctx: ComparisonContext): FormulaValue;
    visitNumber(ctx: NumberContext): FormulaValue;
    visitString(ctx: StringContext): FormulaValue;
    visitParentheses(ctx: ParenthesesContext): FormulaValue;
    visitPositiveExpression(ctx: PositiveExpressionContext): FormulaValue;
    visitNegativeExpression(ctx: NegativeExpressionContext): FormulaValue;
    visitAbsRowReference(ctx: AbsRowReferenceContext): FormulaValue;
    visitRelativeRowReference(ctx: RelativeRowReferenceContext): FormulaValue;
    visitAbsoluteReference(ctx: AbsoluteReferenceContext): FormulaValue;
    visitReference(ctx: ReferenceContext): any;
    visitEnvironmentalVariable(ctx: EnvironmentalVariableContext): FormulaValue;
}
