import { GridApi } from "ag-grid-community";
import { ATN } from "antlr4ts/atn/ATN";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { RuleContext } from "antlr4ts/RuleContext";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { FormulaListener } from "./FormulaListener";
import { FormulaVisitor } from "./FormulaVisitor";
export declare class FormulaParser extends Parser {
    static readonly T__0 = 1;
    static readonly T__1 = 2;
    static readonly T__2 = 3;
    static readonly T__3 = 4;
    static readonly T__4 = 5;
    static readonly INT = 6;
    static readonly MUL = 7;
    static readonly DIV = 8;
    static readonly PLUS = 9;
    static readonly MINUS = 10;
    static readonly COMMA = 11;
    static readonly DQUOTE = 12;
    static readonly TRUE = 13;
    static readonly FALSE = 14;
    static readonly IDENT = 15;
    static readonly EQ = 16;
    static readonly NEQ = 17;
    static readonly LT = 18;
    static readonly LTE = 19;
    static readonly GT = 20;
    static readonly GTE = 21;
    static readonly RULE_prog = 0;
    static readonly RULE_expr = 1;
    static readonly RULE_absRowReference = 2;
    static readonly RULE_relativeRowReference = 3;
    static readonly RULE_arguments = 4;
    static readonly RULE_ref = 5;
    static readonly RULE_absRef = 6;
    static readonly RULE_envVar = 7;
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException;
    gridApi: GridApi;
    constructor(input: TokenStream);
    prog(): ProgContext;
    expr(): ExprContext;
    expr(_p: number): ExprContext;
    absRowReference(): AbsRowReferenceContext;
    relativeRowReference(): RelativeRowReferenceContext;
    arguments(): ArgumentsContext;
    ref(): RefContext;
    absRef(): AbsRefContext;
    envVar(): EnvVarContext;
    sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean;
    private expr_sempred;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
export declare class ProgContext extends ParserRuleContext {
    expr(): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ExprContext extends ParserRuleContext {
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    copyFrom(ctx: ExprContext): void;
}
export declare class TrueContext extends ExprContext {
    TRUE(): TerminalNode;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class FalseContext extends ExprContext {
    FALSE(): TerminalNode;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class NegativeExpressionContext extends ExprContext {
    _an: ExprContext;
    MINUS(): TerminalNode;
    expr(): ExprContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class PositiveExpressionContext extends ExprContext {
    _an: ExprContext;
    PLUS(): TerminalNode;
    expr(): ExprContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class MultiplicationOrDivisionContext extends ExprContext {
    _left: ExprContext;
    _operator: Token;
    _right: ExprContext;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    MUL(): TerminalNode | undefined;
    DIV(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class AdditionOrSubtractionContext extends ExprContext {
    _left: ExprContext;
    _operator: Token;
    _right: ExprContext;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    PLUS(): TerminalNode | undefined;
    MINUS(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ComparisonContext extends ExprContext {
    _left: ExprContext;
    _operator: Token;
    _right: ExprContext;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    EQ(): TerminalNode | undefined;
    NEQ(): TerminalNode | undefined;
    LT(): TerminalNode | undefined;
    LTE(): TerminalNode | undefined;
    GT(): TerminalNode | undefined;
    GTE(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class FunctionContext extends ExprContext {
    IDENT(): TerminalNode;
    arguments(): ArgumentsContext | undefined;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class NumberContext extends ExprContext {
    INT(): TerminalNode;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class StringContext extends ExprContext {
    DQUOTE(): TerminalNode[];
    DQUOTE(i: number): TerminalNode;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ParenthesesContext extends ExprContext {
    expr(): ExprContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class AbsoluteReferenceContext extends ExprContext {
    absRef(): AbsRefContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ReferenceContext extends ExprContext {
    ref(): RefContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class EnvironmentalVariableContext extends ExprContext {
    envVar(): EnvVarContext;
    constructor(ctx: ExprContext);
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class AbsRowReferenceContext extends ParserRuleContext {
    rowNodeID: string | undefined;
    _INT: Token;
    INT(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class RelativeRowReferenceContext extends ParserRuleContext {
    _an: ExprContext;
    MINUS(): TerminalNode | undefined;
    expr(): ExprContext;
    PLUS(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ArgumentsContext extends ParserRuleContext {
    relativeRowReference(): RelativeRowReferenceContext[];
    relativeRowReference(i: number): RelativeRowReferenceContext;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    absRowReference(): AbsRowReferenceContext[];
    absRowReference(i: number): AbsRowReferenceContext;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class RefContext extends ParserRuleContext {
    _an: ExprContext;
    IDENT(): TerminalNode;
    MINUS(): TerminalNode | undefined;
    expr(): ExprContext | undefined;
    PLUS(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class AbsRefContext extends ParserRuleContext {
    rowNodeID: string | undefined;
    _INT: Token;
    IDENT(): TerminalNode;
    INT(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class EnvVarContext extends ParserRuleContext {
    IDENT(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: FormulaListener): void;
    exitRule(listener: FormulaListener): void;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
