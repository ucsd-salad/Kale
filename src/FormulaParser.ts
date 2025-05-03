// Generated from src/Formula.g4 by ANTLR 4.9.0-SNAPSHOT

 import { GridApi } from "ag-grid-community";

import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { FormulaListener } from "./FormulaListener";
import { FormulaVisitor } from "./FormulaVisitor";


export class FormulaParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly INT = 6;
	public static readonly MUL = 7;
	public static readonly DIV = 8;
	public static readonly PLUS = 9;
	public static readonly MINUS = 10;
	public static readonly COMMA = 11;
	public static readonly DQUOTE = 12;
	public static readonly TRUE = 13;
	public static readonly FALSE = 14;
	public static readonly IDENT = 15;
	public static readonly EQ = 16;
	public static readonly NEQ = 17;
	public static readonly LT = 18;
	public static readonly LTE = 19;
	public static readonly GT = 20;
	public static readonly GTE = 21;
	public static readonly RULE_prog = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_absRowReference = 2;
	public static readonly RULE_relativeRowReference = 3;
	public static readonly RULE_arguments = 4;
	public static readonly RULE_ref = 5;
	public static readonly RULE_absRef = 6;
	public static readonly RULE_envVar = 7;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"prog", "expr", "absRowReference", "relativeRowReference", "arguments", 
		"ref", "absRef", "envVar",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'('", "')'", "'['", "']'", "'@'", undefined, "'*'", "'/'", 
		"'+'", "'-'", "','", "'\"'", undefined, undefined, undefined, "'=='", 
		"'!='", "'<'", "'<='", "'>'", "'>='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, "INT", 
		"MUL", "DIV", "PLUS", "MINUS", "COMMA", "DQUOTE", "TRUE", "FALSE", "IDENT", 
		"EQ", "NEQ", "LT", "LTE", "GT", "GTE",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(FormulaParser._LITERAL_NAMES, FormulaParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return FormulaParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Formula.g4"; }

	// @Override
	public get ruleNames(): string[] { return FormulaParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return FormulaParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}


	    public gridApi: GridApi;

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(FormulaParser._ATN, this);
	}
	// @RuleVersion(0)
	public prog(): ProgContext {
		let _localctx: ProgContext = new ProgContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, FormulaParser.RULE_prog);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 16;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExprContext = new ExprContext(this._ctx, _parentState);
		let _prevctx: ExprContext = _localctx;
		let _startState: number = 2;
		this.enterRecursionRule(_localctx, 2, FormulaParser.RULE_expr, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 47;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				{
				_localctx = new TrueContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 19;
				this.match(FormulaParser.TRUE);
				}
				break;

			case 2:
				{
				_localctx = new FalseContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 20;
				this.match(FormulaParser.FALSE);
				}
				break;

			case 3:
				{
				_localctx = new NegativeExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 21;
				this.match(FormulaParser.MINUS);
				this.state = 22;
				(_localctx as NegativeExpressionContext)._an = this.expr(12);
				}
				break;

			case 4:
				{
				_localctx = new PositiveExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 23;
				this.match(FormulaParser.PLUS);
				this.state = 24;
				(_localctx as PositiveExpressionContext)._an = this.expr(11);
				}
				break;

			case 5:
				{
				_localctx = new FunctionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 25;
				this.match(FormulaParser.IDENT);
				this.state = 26;
				this.match(FormulaParser.T__0);
				this.state = 28;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FormulaParser.T__0) | (1 << FormulaParser.T__2) | (1 << FormulaParser.T__4) | (1 << FormulaParser.INT) | (1 << FormulaParser.PLUS) | (1 << FormulaParser.MINUS) | (1 << FormulaParser.DQUOTE) | (1 << FormulaParser.TRUE) | (1 << FormulaParser.FALSE) | (1 << FormulaParser.IDENT))) !== 0)) {
					{
					this.state = 27;
					this.arguments();
					}
				}

				this.state = 30;
				this.match(FormulaParser.T__1);
				}
				break;

			case 6:
				{
				_localctx = new NumberContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 31;
				this.match(FormulaParser.INT);
				}
				break;

			case 7:
				{
				_localctx = new StringContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 32;
				this.match(FormulaParser.DQUOTE);
				this.state = 36;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
				while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1 + 1) {
						{
						{
						this.state = 33;
						this.matchWildcard();
						}
						}
					}
					this.state = 38;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
				}
				this.state = 39;
				this.match(FormulaParser.DQUOTE);
				}
				break;

			case 8:
				{
				_localctx = new ParenthesesContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 40;
				this.match(FormulaParser.T__0);
				this.state = 41;
				this.expr(0);
				this.state = 42;
				this.match(FormulaParser.T__1);
				}
				break;

			case 9:
				{
				_localctx = new AbsoluteReferenceContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 44;
				this.absRef();
				}
				break;

			case 10:
				{
				_localctx = new ReferenceContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 45;
				this.ref();
				}
				break;

			case 11:
				{
				_localctx = new EnvironmentalVariableContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 46;
				this.envVar();
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 60;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 58;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicationOrDivisionContext(new ExprContext(_parentctx, _parentState));
						(_localctx as MultiplicationOrDivisionContext)._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
						this.state = 49;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 50;
						(_localctx as MultiplicationOrDivisionContext)._operator = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === FormulaParser.MUL || _la === FormulaParser.DIV)) {
							(_localctx as MultiplicationOrDivisionContext)._operator = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 51;
						(_localctx as MultiplicationOrDivisionContext)._right = this.expr(11);
						}
						break;

					case 2:
						{
						_localctx = new AdditionOrSubtractionContext(new ExprContext(_parentctx, _parentState));
						(_localctx as AdditionOrSubtractionContext)._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
						this.state = 52;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 53;
						(_localctx as AdditionOrSubtractionContext)._operator = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === FormulaParser.PLUS || _la === FormulaParser.MINUS)) {
							(_localctx as AdditionOrSubtractionContext)._operator = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 54;
						(_localctx as AdditionOrSubtractionContext)._right = this.expr(10);
						}
						break;

					case 3:
						{
						_localctx = new ComparisonContext(new ExprContext(_parentctx, _parentState));
						(_localctx as ComparisonContext)._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
						this.state = 55;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 56;
						(_localctx as ComparisonContext)._operator = this._input.LT(1);
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FormulaParser.EQ) | (1 << FormulaParser.NEQ) | (1 << FormulaParser.LT) | (1 << FormulaParser.LTE) | (1 << FormulaParser.GT) | (1 << FormulaParser.GTE))) !== 0))) {
							(_localctx as ComparisonContext)._operator = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 57;
						(_localctx as ComparisonContext)._right = this.expr(9);
						}
						break;
					}
					}
				}
				this.state = 62;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public absRowReference(): AbsRowReferenceContext {
		let _localctx: AbsRowReferenceContext = new AbsRowReferenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, FormulaParser.RULE_absRowReference);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 63;
			this.match(FormulaParser.T__2);
			this.state = 64;
			_localctx._INT = this.match(FormulaParser.INT);
			this.state = 65;
			this.match(FormulaParser.T__3);
			 _localctx.rowNodeID =  this.gridApi.getDisplayedRowAtIndex((_localctx._INT != null ? Number(_localctx._INT.text) : 0))?.id; 
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public relativeRowReference(): RelativeRowReferenceContext {
		let _localctx: RelativeRowReferenceContext = new RelativeRowReferenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, FormulaParser.RULE_relativeRowReference);
		try {
			this.state = 78;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 68;
				this.match(FormulaParser.T__2);
				this.state = 69;
				this.match(FormulaParser.MINUS);
				this.state = 70;
				_localctx._an = this.expr(0);
				this.state = 71;
				this.match(FormulaParser.T__3);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 73;
				this.match(FormulaParser.T__2);
				this.state = 74;
				this.match(FormulaParser.PLUS);
				this.state = 75;
				_localctx._an = this.expr(0);
				this.state = 76;
				this.match(FormulaParser.T__3);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, FormulaParser.RULE_arguments);
		let _la: number;
		try {
			this.state = 104;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 80;
				this.relativeRowReference();
				this.state = 85;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === FormulaParser.COMMA) {
					{
					{
					this.state = 81;
					this.match(FormulaParser.COMMA);
					this.state = 82;
					this.relativeRowReference();
					}
					}
					this.state = 87;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 88;
				this.absRowReference();
				this.state = 93;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === FormulaParser.COMMA) {
					{
					{
					this.state = 89;
					this.match(FormulaParser.COMMA);
					this.state = 90;
					this.absRowReference();
					}
					}
					this.state = 95;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 96;
				this.expr(0);
				this.state = 101;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === FormulaParser.COMMA) {
					{
					{
					this.state = 97;
					this.match(FormulaParser.COMMA);
					this.state = 98;
					this.expr(0);
					}
					}
					this.state = 103;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ref(): RefContext {
		let _localctx: RefContext = new RefContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, FormulaParser.RULE_ref);
		try {
			this.state = 119;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 106;
				this.match(FormulaParser.IDENT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 107;
				this.match(FormulaParser.IDENT);
				this.state = 108;
				this.match(FormulaParser.T__2);
				this.state = 109;
				this.match(FormulaParser.MINUS);
				this.state = 110;
				_localctx._an = this.expr(0);
				this.state = 111;
				this.match(FormulaParser.T__3);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 113;
				this.match(FormulaParser.IDENT);
				this.state = 114;
				this.match(FormulaParser.T__2);
				this.state = 115;
				this.match(FormulaParser.PLUS);
				this.state = 116;
				_localctx._an = this.expr(0);
				this.state = 117;
				this.match(FormulaParser.T__3);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public absRef(): AbsRefContext {
		let _localctx: AbsRefContext = new AbsRefContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, FormulaParser.RULE_absRef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 121;
			this.match(FormulaParser.IDENT);
			this.state = 122;
			this.match(FormulaParser.T__2);
			this.state = 123;
			_localctx._INT = this.match(FormulaParser.INT);
			this.state = 124;
			this.match(FormulaParser.T__3);
			 _localctx.rowNodeID =  this.gridApi.getDisplayedRowAtIndex((_localctx._INT != null ? Number(_localctx._INT.text) : 0))?.id; 
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public envVar(): EnvVarContext {
		let _localctx: EnvVarContext = new EnvVarContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, FormulaParser.RULE_envVar);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 127;
			this.match(FormulaParser.T__4);
			this.state = 128;
			this.match(FormulaParser.IDENT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expr_sempred(_localctx as ExprContext, predIndex);
		}
		return true;
	}
	private expr_sempred(_localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 10);

		case 1:
			return this.precpred(this._ctx, 9);

		case 2:
			return this.precpred(this._ctx, 8);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x17\x85\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03\x1F\n\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03%\n\x03\f\x03\x0E\x03(\v\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x032" +
		"\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x07\x03=\n\x03\f\x03\x0E\x03@\v\x03\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x05\x05Q\n\x05\x03\x06\x03\x06\x03\x06\x07\x06V\n" +
		"\x06\f\x06\x0E\x06Y\v\x06\x03\x06\x03\x06\x03\x06\x07\x06^\n\x06\f\x06" +
		"\x0E\x06a\v\x06\x03\x06\x03\x06\x03\x06\x07\x06f\n\x06\f\x06\x0E\x06i" +
		"\v\x06\x05\x06k\n\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07z\n\x07" +
		"\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03&\x02" +
		"\x03\x04\n\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x02" +
		"\x05\x03\x02\t\n\x03\x02\v\f\x03\x02\x12\x17\x02\x93\x02\x12\x03\x02\x02" +
		"\x02\x041\x03\x02\x02\x02\x06A\x03\x02\x02\x02\bP\x03\x02\x02\x02\nj\x03" +
		"\x02\x02\x02\fy\x03\x02\x02\x02\x0E{\x03\x02\x02\x02\x10\x81\x03\x02\x02" +
		"\x02\x12\x13\x05\x04\x03\x02\x13\x03\x03\x02\x02\x02\x14\x15\b\x03\x01" +
		"\x02\x152\x07\x0F\x02\x02\x162\x07\x10\x02\x02\x17\x18\x07\f\x02\x02\x18" +
		"2\x05\x04\x03\x0E\x19\x1A\x07\v\x02\x02\x1A2\x05\x04\x03\r\x1B\x1C\x07" +
		"\x11\x02\x02\x1C\x1E\x07\x03\x02\x02\x1D\x1F\x05\n\x06\x02\x1E\x1D\x03" +
		"\x02\x02\x02\x1E\x1F\x03\x02\x02\x02\x1F \x03\x02\x02\x02 2\x07\x04\x02" +
		"\x02!2\x07\b\x02\x02\"&\x07\x0E\x02\x02#%\v\x02\x02\x02$#\x03\x02\x02" +
		"\x02%(\x03\x02\x02\x02&\'\x03\x02\x02\x02&$\x03\x02\x02\x02\')\x03\x02" +
		"\x02\x02(&\x03\x02\x02\x02)2\x07\x0E\x02\x02*+\x07\x03\x02\x02+,\x05\x04" +
		"\x03\x02,-\x07\x04\x02\x02-2\x03\x02\x02\x02.2\x05\x0E\b\x02/2\x05\f\x07" +
		"\x0202\x05\x10\t\x021\x14\x03\x02\x02\x021\x16\x03\x02\x02\x021\x17\x03" +
		"\x02\x02\x021\x19\x03\x02\x02\x021\x1B\x03\x02\x02\x021!\x03\x02\x02\x02" +
		"1\"\x03\x02\x02\x021*\x03\x02\x02\x021.\x03\x02\x02\x021/\x03\x02\x02" +
		"\x0210\x03\x02\x02\x022>\x03\x02\x02\x0234\f\f\x02\x0245\t\x02\x02\x02" +
		"5=\x05\x04\x03\r67\f\v\x02\x0278\t\x03\x02\x028=\x05\x04\x03\f9:\f\n\x02" +
		"\x02:;\t\x04\x02\x02;=\x05\x04\x03\v<3\x03\x02\x02\x02<6\x03\x02\x02\x02" +
		"<9\x03\x02\x02\x02=@\x03\x02\x02\x02><\x03\x02\x02\x02>?\x03\x02\x02\x02" +
		"?\x05\x03\x02\x02\x02@>\x03\x02\x02\x02AB\x07\x05\x02\x02BC\x07\b\x02" +
		"\x02CD\x07\x06\x02\x02DE\b\x04\x01\x02E\x07\x03\x02\x02\x02FG\x07\x05" +
		"\x02\x02GH\x07\f\x02\x02HI\x05\x04\x03\x02IJ\x07\x06\x02\x02JQ\x03\x02" +
		"\x02\x02KL\x07\x05\x02\x02LM\x07\v\x02\x02MN\x05\x04\x03\x02NO\x07\x06" +
		"\x02\x02OQ\x03\x02\x02\x02PF\x03\x02\x02\x02PK\x03\x02\x02\x02Q\t\x03" +
		"\x02\x02\x02RW\x05\b\x05\x02ST\x07\r\x02\x02TV\x05\b\x05\x02US\x03\x02" +
		"\x02\x02VY\x03\x02\x02\x02WU\x03\x02\x02\x02WX\x03\x02\x02\x02Xk\x03\x02" +
		"\x02\x02YW\x03\x02\x02\x02Z_\x05\x06\x04\x02[\\\x07\r\x02\x02\\^\x05\x06" +
		"\x04\x02][\x03\x02\x02\x02^a\x03\x02\x02\x02_]\x03\x02\x02\x02_`\x03\x02" +
		"\x02\x02`k\x03\x02\x02\x02a_\x03\x02\x02\x02bg\x05\x04\x03\x02cd\x07\r" +
		"\x02\x02df\x05\x04\x03\x02ec\x03\x02\x02\x02fi\x03\x02\x02\x02ge\x03\x02" +
		"\x02\x02gh\x03\x02\x02\x02hk\x03\x02\x02\x02ig\x03\x02\x02\x02jR\x03\x02" +
		"\x02\x02jZ\x03\x02\x02\x02jb\x03\x02\x02\x02k\v\x03\x02\x02\x02lz\x07" +
		"\x11\x02\x02mn\x07\x11\x02\x02no\x07\x05\x02\x02op\x07\f\x02\x02pq\x05" +
		"\x04\x03\x02qr\x07\x06\x02\x02rz\x03\x02\x02\x02st\x07\x11\x02\x02tu\x07" +
		"\x05\x02\x02uv\x07\v\x02\x02vw\x05\x04\x03\x02wx\x07\x06\x02\x02xz\x03" +
		"\x02\x02\x02yl\x03\x02\x02\x02ym\x03\x02\x02\x02ys\x03\x02\x02\x02z\r" +
		"\x03\x02\x02\x02{|\x07\x11\x02\x02|}\x07\x05\x02\x02}~\x07\b\x02\x02~" +
		"\x7F\x07\x06\x02\x02\x7F\x80\b\b\x01\x02\x80\x0F\x03\x02\x02\x02\x81\x82" +
		"\x07\x07\x02\x02\x82\x83\x07\x11\x02\x02\x83\x11\x03\x02\x02\x02\r\x1E" +
		"&1<>PW_gjy";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FormulaParser.__ATN) {
			FormulaParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(FormulaParser._serializedATN));
		}

		return FormulaParser.__ATN;
	}

}

export class ProgContext extends ParserRuleContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_prog; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterProg) {
			listener.enterProg(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitProg) {
			listener.exitProg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitProg) {
			return visitor.visitProg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_expr; }
	public copyFrom(ctx: ExprContext): void {
		super.copyFrom(ctx);
	}
}
export class TrueContext extends ExprContext {
	public TRUE(): TerminalNode { return this.getToken(FormulaParser.TRUE, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterTrue) {
			listener.enterTrue(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitTrue) {
			listener.exitTrue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitTrue) {
			return visitor.visitTrue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FalseContext extends ExprContext {
	public FALSE(): TerminalNode { return this.getToken(FormulaParser.FALSE, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterFalse) {
			listener.enterFalse(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitFalse) {
			listener.exitFalse(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitFalse) {
			return visitor.visitFalse(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NegativeExpressionContext extends ExprContext {
	public _an!: ExprContext;
	public MINUS(): TerminalNode { return this.getToken(FormulaParser.MINUS, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterNegativeExpression) {
			listener.enterNegativeExpression(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitNegativeExpression) {
			listener.exitNegativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitNegativeExpression) {
			return visitor.visitNegativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PositiveExpressionContext extends ExprContext {
	public _an!: ExprContext;
	public PLUS(): TerminalNode { return this.getToken(FormulaParser.PLUS, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterPositiveExpression) {
			listener.enterPositiveExpression(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitPositiveExpression) {
			listener.exitPositiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitPositiveExpression) {
			return visitor.visitPositiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiplicationOrDivisionContext extends ExprContext {
	public _left!: ExprContext;
	public _operator!: Token;
	public _right!: ExprContext;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public MUL(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.DIV, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterMultiplicationOrDivision) {
			listener.enterMultiplicationOrDivision(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitMultiplicationOrDivision) {
			listener.exitMultiplicationOrDivision(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitMultiplicationOrDivision) {
			return visitor.visitMultiplicationOrDivision(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AdditionOrSubtractionContext extends ExprContext {
	public _left!: ExprContext;
	public _operator!: Token;
	public _right!: ExprContext;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.PLUS, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MINUS, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterAdditionOrSubtraction) {
			listener.enterAdditionOrSubtraction(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitAdditionOrSubtraction) {
			listener.exitAdditionOrSubtraction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitAdditionOrSubtraction) {
			return visitor.visitAdditionOrSubtraction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ComparisonContext extends ExprContext {
	public _left!: ExprContext;
	public _operator!: Token;
	public _right!: ExprContext;
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public EQ(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.EQ, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.NEQ, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.LT, 0); }
	public LTE(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.LTE, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.GT, 0); }
	public GTE(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.GTE, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterComparison) {
			listener.enterComparison(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitComparison) {
			listener.exitComparison(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitComparison) {
			return visitor.visitComparison(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FunctionContext extends ExprContext {
	public IDENT(): TerminalNode { return this.getToken(FormulaParser.IDENT, 0); }
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterFunction) {
			listener.enterFunction(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitFunction) {
			listener.exitFunction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitFunction) {
			return visitor.visitFunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NumberContext extends ExprContext {
	public INT(): TerminalNode { return this.getToken(FormulaParser.INT, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterNumber) {
			listener.enterNumber(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitNumber) {
			listener.exitNumber(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitNumber) {
			return visitor.visitNumber(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringContext extends ExprContext {
	public DQUOTE(): TerminalNode[];
	public DQUOTE(i: number): TerminalNode;
	public DQUOTE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FormulaParser.DQUOTE);
		} else {
			return this.getToken(FormulaParser.DQUOTE, i);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterString) {
			listener.enterString(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitString) {
			listener.exitString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitString) {
			return visitor.visitString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenthesesContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterParentheses) {
			listener.enterParentheses(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitParentheses) {
			listener.exitParentheses(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitParentheses) {
			return visitor.visitParentheses(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AbsoluteReferenceContext extends ExprContext {
	public absRef(): AbsRefContext {
		return this.getRuleContext(0, AbsRefContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterAbsoluteReference) {
			listener.enterAbsoluteReference(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitAbsoluteReference) {
			listener.exitAbsoluteReference(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitAbsoluteReference) {
			return visitor.visitAbsoluteReference(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ReferenceContext extends ExprContext {
	public ref(): RefContext {
		return this.getRuleContext(0, RefContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterReference) {
			listener.enterReference(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitReference) {
			listener.exitReference(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitReference) {
			return visitor.visitReference(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EnvironmentalVariableContext extends ExprContext {
	public envVar(): EnvVarContext {
		return this.getRuleContext(0, EnvVarContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterEnvironmentalVariable) {
			listener.enterEnvironmentalVariable(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitEnvironmentalVariable) {
			listener.exitEnvironmentalVariable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitEnvironmentalVariable) {
			return visitor.visitEnvironmentalVariable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbsRowReferenceContext extends ParserRuleContext {
	public rowNodeID: string | undefined;
	public _INT!: Token;
	public INT(): TerminalNode { return this.getToken(FormulaParser.INT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_absRowReference; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterAbsRowReference) {
			listener.enterAbsRowReference(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitAbsRowReference) {
			listener.exitAbsRowReference(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitAbsRowReference) {
			return visitor.visitAbsRowReference(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelativeRowReferenceContext extends ParserRuleContext {
	public _an!: ExprContext;
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MINUS, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.PLUS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_relativeRowReference; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterRelativeRowReference) {
			listener.enterRelativeRowReference(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitRelativeRowReference) {
			listener.exitRelativeRowReference(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitRelativeRowReference) {
			return visitor.visitRelativeRowReference(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public relativeRowReference(): RelativeRowReferenceContext[];
	public relativeRowReference(i: number): RelativeRowReferenceContext;
	public relativeRowReference(i?: number): RelativeRowReferenceContext | RelativeRowReferenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RelativeRowReferenceContext);
		} else {
			return this.getRuleContext(i, RelativeRowReferenceContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FormulaParser.COMMA);
		} else {
			return this.getToken(FormulaParser.COMMA, i);
		}
	}
	public absRowReference(): AbsRowReferenceContext[];
	public absRowReference(i: number): AbsRowReferenceContext;
	public absRowReference(i?: number): AbsRowReferenceContext | AbsRowReferenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AbsRowReferenceContext);
		} else {
			return this.getRuleContext(i, AbsRowReferenceContext);
		}
	}
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_arguments; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterArguments) {
			listener.enterArguments(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitArguments) {
			listener.exitArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RefContext extends ParserRuleContext {
	public _an!: ExprContext;
	public IDENT(): TerminalNode { return this.getToken(FormulaParser.IDENT, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MINUS, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.PLUS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_ref; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterRef) {
			listener.enterRef(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitRef) {
			listener.exitRef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitRef) {
			return visitor.visitRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbsRefContext extends ParserRuleContext {
	public rowNodeID: string | undefined;
	public _INT!: Token;
	public IDENT(): TerminalNode { return this.getToken(FormulaParser.IDENT, 0); }
	public INT(): TerminalNode { return this.getToken(FormulaParser.INT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_absRef; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterAbsRef) {
			listener.enterAbsRef(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitAbsRef) {
			listener.exitAbsRef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitAbsRef) {
			return visitor.visitAbsRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnvVarContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(FormulaParser.IDENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_envVar; }
	// @Override
	public enterRule(listener: FormulaListener): void {
		if (listener.enterEnvVar) {
			listener.enterEnvVar(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaListener): void {
		if (listener.exitEnvVar) {
			listener.exitEnvVar(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaVisitor<Result>): Result {
		if (visitor.visitEnvVar) {
			return visitor.visitEnvVar(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


