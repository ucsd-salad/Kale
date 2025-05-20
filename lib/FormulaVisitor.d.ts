import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { TrueContext } from "./FormulaParser";
import { FalseContext } from "./FormulaParser";
import { NegativeExpressionContext } from "./FormulaParser";
import { PositiveExpressionContext } from "./FormulaParser";
import { MultiplicationOrDivisionContext } from "./FormulaParser";
import { AdditionOrSubtractionContext } from "./FormulaParser";
import { ComparisonContext } from "./FormulaParser";
import { FunctionContext } from "./FormulaParser";
import { NumberContext } from "./FormulaParser";
import { StringContext } from "./FormulaParser";
import { ParenthesesContext } from "./FormulaParser";
import { AbsoluteReferenceContext } from "./FormulaParser";
import { ReferenceContext } from "./FormulaParser";
import { EnvironmentalVariableContext } from "./FormulaParser";
import { ProgContext } from "./FormulaParser";
import { ExprContext } from "./FormulaParser";
import { AbsRowReferenceContext } from "./FormulaParser";
import { RelativeRowReferenceContext } from "./FormulaParser";
import { ArgumentsContext } from "./FormulaParser";
import { RefContext } from "./FormulaParser";
import { AbsRefContext } from "./FormulaParser";
import { EnvVarContext } from "./FormulaParser";
/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `FormulaParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface FormulaVisitor<Result> extends ParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by the `True`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTrue?: (ctx: TrueContext) => Result;
    /**
     * Visit a parse tree produced by the `False`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFalse?: (ctx: FalseContext) => Result;
    /**
     * Visit a parse tree produced by the `NegativeExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNegativeExpression?: (ctx: NegativeExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `PositiveExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPositiveExpression?: (ctx: PositiveExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `MultiplicationOrDivision`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMultiplicationOrDivision?: (ctx: MultiplicationOrDivisionContext) => Result;
    /**
     * Visit a parse tree produced by the `AdditionOrSubtraction`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAdditionOrSubtraction?: (ctx: AdditionOrSubtractionContext) => Result;
    /**
     * Visit a parse tree produced by the `Comparison`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparison?: (ctx: ComparisonContext) => Result;
    /**
     * Visit a parse tree produced by the `Function`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunction?: (ctx: FunctionContext) => Result;
    /**
     * Visit a parse tree produced by the `Number`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNumber?: (ctx: NumberContext) => Result;
    /**
     * Visit a parse tree produced by the `String`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitString?: (ctx: StringContext) => Result;
    /**
     * Visit a parse tree produced by the `Parentheses`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParentheses?: (ctx: ParenthesesContext) => Result;
    /**
     * Visit a parse tree produced by the `AbsoluteReference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAbsoluteReference?: (ctx: AbsoluteReferenceContext) => Result;
    /**
     * Visit a parse tree produced by the `Reference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReference?: (ctx: ReferenceContext) => Result;
    /**
     * Visit a parse tree produced by the `EnvironmentalVariable`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnvironmentalVariable?: (ctx: EnvironmentalVariableContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.prog`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProg?: (ctx: ProgContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpr?: (ctx: ExprContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.absRowReference`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAbsRowReference?: (ctx: AbsRowReferenceContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.relativeRowReference`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRelativeRowReference?: (ctx: RelativeRowReferenceContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.arguments`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArguments?: (ctx: ArgumentsContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.ref`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRef?: (ctx: RefContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.absRef`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAbsRef?: (ctx: AbsRefContext) => Result;
    /**
     * Visit a parse tree produced by `FormulaParser.envVar`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnvVar?: (ctx: EnvVarContext) => Result;
}
