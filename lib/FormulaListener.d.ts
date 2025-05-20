import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
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
 * This interface defines a complete listener for a parse tree produced by
 * `FormulaParser`.
 */
export interface FormulaListener extends ParseTreeListener {
    /**
     * Enter a parse tree produced by the `True`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterTrue?: (ctx: TrueContext) => void;
    /**
     * Exit a parse tree produced by the `True`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitTrue?: (ctx: TrueContext) => void;
    /**
     * Enter a parse tree produced by the `False`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterFalse?: (ctx: FalseContext) => void;
    /**
     * Exit a parse tree produced by the `False`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitFalse?: (ctx: FalseContext) => void;
    /**
     * Enter a parse tree produced by the `NegativeExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterNegativeExpression?: (ctx: NegativeExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `NegativeExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitNegativeExpression?: (ctx: NegativeExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `PositiveExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterPositiveExpression?: (ctx: PositiveExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `PositiveExpression`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitPositiveExpression?: (ctx: PositiveExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `MultiplicationOrDivision`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterMultiplicationOrDivision?: (ctx: MultiplicationOrDivisionContext) => void;
    /**
     * Exit a parse tree produced by the `MultiplicationOrDivision`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitMultiplicationOrDivision?: (ctx: MultiplicationOrDivisionContext) => void;
    /**
     * Enter a parse tree produced by the `AdditionOrSubtraction`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterAdditionOrSubtraction?: (ctx: AdditionOrSubtractionContext) => void;
    /**
     * Exit a parse tree produced by the `AdditionOrSubtraction`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitAdditionOrSubtraction?: (ctx: AdditionOrSubtractionContext) => void;
    /**
     * Enter a parse tree produced by the `Comparison`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterComparison?: (ctx: ComparisonContext) => void;
    /**
     * Exit a parse tree produced by the `Comparison`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitComparison?: (ctx: ComparisonContext) => void;
    /**
     * Enter a parse tree produced by the `Function`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterFunction?: (ctx: FunctionContext) => void;
    /**
     * Exit a parse tree produced by the `Function`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitFunction?: (ctx: FunctionContext) => void;
    /**
     * Enter a parse tree produced by the `Number`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterNumber?: (ctx: NumberContext) => void;
    /**
     * Exit a parse tree produced by the `Number`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitNumber?: (ctx: NumberContext) => void;
    /**
     * Enter a parse tree produced by the `String`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterString?: (ctx: StringContext) => void;
    /**
     * Exit a parse tree produced by the `String`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitString?: (ctx: StringContext) => void;
    /**
     * Enter a parse tree produced by the `Parentheses`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterParentheses?: (ctx: ParenthesesContext) => void;
    /**
     * Exit a parse tree produced by the `Parentheses`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitParentheses?: (ctx: ParenthesesContext) => void;
    /**
     * Enter a parse tree produced by the `AbsoluteReference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterAbsoluteReference?: (ctx: AbsoluteReferenceContext) => void;
    /**
     * Exit a parse tree produced by the `AbsoluteReference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitAbsoluteReference?: (ctx: AbsoluteReferenceContext) => void;
    /**
     * Enter a parse tree produced by the `Reference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterReference?: (ctx: ReferenceContext) => void;
    /**
     * Exit a parse tree produced by the `Reference`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitReference?: (ctx: ReferenceContext) => void;
    /**
     * Enter a parse tree produced by the `EnvironmentalVariable`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterEnvironmentalVariable?: (ctx: EnvironmentalVariableContext) => void;
    /**
     * Exit a parse tree produced by the `EnvironmentalVariable`
     * labeled alternative in `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitEnvironmentalVariable?: (ctx: EnvironmentalVariableContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.prog`.
     * @param ctx the parse tree
     */
    enterProg?: (ctx: ProgContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.prog`.
     * @param ctx the parse tree
     */
    exitProg?: (ctx: ProgContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    enterExpr?: (ctx: ExprContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.expr`.
     * @param ctx the parse tree
     */
    exitExpr?: (ctx: ExprContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.absRowReference`.
     * @param ctx the parse tree
     */
    enterAbsRowReference?: (ctx: AbsRowReferenceContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.absRowReference`.
     * @param ctx the parse tree
     */
    exitAbsRowReference?: (ctx: AbsRowReferenceContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.relativeRowReference`.
     * @param ctx the parse tree
     */
    enterRelativeRowReference?: (ctx: RelativeRowReferenceContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.relativeRowReference`.
     * @param ctx the parse tree
     */
    exitRelativeRowReference?: (ctx: RelativeRowReferenceContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.arguments`.
     * @param ctx the parse tree
     */
    enterArguments?: (ctx: ArgumentsContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.arguments`.
     * @param ctx the parse tree
     */
    exitArguments?: (ctx: ArgumentsContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.ref`.
     * @param ctx the parse tree
     */
    enterRef?: (ctx: RefContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.ref`.
     * @param ctx the parse tree
     */
    exitRef?: (ctx: RefContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.absRef`.
     * @param ctx the parse tree
     */
    enterAbsRef?: (ctx: AbsRefContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.absRef`.
     * @param ctx the parse tree
     */
    exitAbsRef?: (ctx: AbsRefContext) => void;
    /**
     * Enter a parse tree produced by `FormulaParser.envVar`.
     * @param ctx the parse tree
     */
    enterEnvVar?: (ctx: EnvVarContext) => void;
    /**
     * Exit a parse tree produced by `FormulaParser.envVar`.
     * @param ctx the parse tree
     */
    exitEnvVar?: (ctx: EnvVarContext) => void;
}
