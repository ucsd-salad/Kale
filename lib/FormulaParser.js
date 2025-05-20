"use strict";
// Generated from src/Formula.g4 by ANTLR 4.9.0-SNAPSHOT
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarContext = exports.AbsRefContext = exports.RefContext = exports.ArgumentsContext = exports.RelativeRowReferenceContext = exports.AbsRowReferenceContext = exports.EnvironmentalVariableContext = exports.ReferenceContext = exports.AbsoluteReferenceContext = exports.ParenthesesContext = exports.StringContext = exports.NumberContext = exports.FunctionContext = exports.ComparisonContext = exports.AdditionOrSubtractionContext = exports.MultiplicationOrDivisionContext = exports.PositiveExpressionContext = exports.NegativeExpressionContext = exports.FalseContext = exports.TrueContext = exports.ExprContext = exports.ProgContext = exports.FormulaParser = void 0;
const ATN_1 = require("antlr4ts/atn/ATN");
const ATNDeserializer_1 = require("antlr4ts/atn/ATNDeserializer");
const FailedPredicateException_1 = require("antlr4ts/FailedPredicateException");
const Parser_1 = require("antlr4ts/Parser");
const ParserRuleContext_1 = require("antlr4ts/ParserRuleContext");
const ParserATNSimulator_1 = require("antlr4ts/atn/ParserATNSimulator");
const RecognitionException_1 = require("antlr4ts/RecognitionException");
const Token_1 = require("antlr4ts/Token");
const VocabularyImpl_1 = require("antlr4ts/VocabularyImpl");
const Utils = __importStar(require("antlr4ts/misc/Utils"));
class FormulaParser extends Parser_1.Parser {
    // @Override
    // @NotNull
    get vocabulary() {
        return FormulaParser.VOCABULARY;
    }
    // tslint:enable:no-trailing-whitespace
    // @Override
    get grammarFileName() { return "Formula.g4"; }
    // @Override
    get ruleNames() { return FormulaParser.ruleNames; }
    // @Override
    get serializedATN() { return FormulaParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new FailedPredicateException_1.FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator_1.ParserATNSimulator(FormulaParser._ATN, this);
    }
    // @RuleVersion(0)
    prog() {
        let _localctx = new ProgContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, FormulaParser.RULE_prog);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 16;
                this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    expr(_p) {
        if (_p === undefined) {
            _p = 0;
        }
        let _parentctx = this._ctx;
        let _parentState = this.state;
        let _localctx = new ExprContext(this._ctx, _parentState);
        let _prevctx = _localctx;
        let _startState = 2;
        this.enterRecursionRule(_localctx, 2, FormulaParser.RULE_expr, _p);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 47;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 2, this._ctx)) {
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
                            _localctx._an = this.expr(12);
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
                            _localctx._an = this.expr(11);
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
                            while (_alt !== 1 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
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
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        if (this._parseListeners != null) {
                            this.triggerExitRuleEvent();
                        }
                        _prevctx = _localctx;
                        {
                            this.state = 58;
                            this._errHandler.sync(this);
                            switch (this.interpreter.adaptivePredict(this._input, 3, this._ctx)) {
                                case 1:
                                    {
                                        _localctx = new MultiplicationOrDivisionContext(new ExprContext(_parentctx, _parentState));
                                        _localctx._left = _prevctx;
                                        this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
                                        this.state = 49;
                                        if (!(this.precpred(this._ctx, 10))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
                                        }
                                        this.state = 50;
                                        _localctx._operator = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(_la === FormulaParser.MUL || _la === FormulaParser.DIV)) {
                                            _localctx._operator = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 51;
                                        _localctx._right = this.expr(11);
                                    }
                                    break;
                                case 2:
                                    {
                                        _localctx = new AdditionOrSubtractionContext(new ExprContext(_parentctx, _parentState));
                                        _localctx._left = _prevctx;
                                        this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
                                        this.state = 52;
                                        if (!(this.precpred(this._ctx, 9))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
                                        }
                                        this.state = 53;
                                        _localctx._operator = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(_la === FormulaParser.PLUS || _la === FormulaParser.MINUS)) {
                                            _localctx._operator = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 54;
                                        _localctx._right = this.expr(10);
                                    }
                                    break;
                                case 3:
                                    {
                                        _localctx = new ComparisonContext(new ExprContext(_parentctx, _parentState));
                                        _localctx._left = _prevctx;
                                        this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expr);
                                        this.state = 55;
                                        if (!(this.precpred(this._ctx, 8))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
                                        }
                                        this.state = 56;
                                        _localctx._operator = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FormulaParser.EQ) | (1 << FormulaParser.NEQ) | (1 << FormulaParser.LT) | (1 << FormulaParser.LTE) | (1 << FormulaParser.GT) | (1 << FormulaParser.GTE))) !== 0))) {
                                            _localctx._operator = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 57;
                                        _localctx._right = this.expr(9);
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
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(_parentctx);
        }
        return _localctx;
    }
    // @RuleVersion(0)
    absRowReference() {
        var _a;
        let _localctx = new AbsRowReferenceContext(this._ctx, this.state);
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
                _localctx.rowNodeID = (_a = this.gridApi.getDisplayedRowAtIndex((_localctx._INT != null ? Number(_localctx._INT.text) : 0))) === null || _a === void 0 ? void 0 : _a.id;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    relativeRowReference() {
        let _localctx = new RelativeRowReferenceContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, FormulaParser.RULE_relativeRowReference);
        try {
            this.state = 78;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 5, this._ctx)) {
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
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    arguments() {
        let _localctx = new ArgumentsContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, FormulaParser.RULE_arguments);
        let _la;
        try {
            this.state = 104;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 9, this._ctx)) {
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
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    ref() {
        let _localctx = new RefContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, FormulaParser.RULE_ref);
        try {
            this.state = 119;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 10, this._ctx)) {
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
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    absRef() {
        var _a;
        let _localctx = new AbsRefContext(this._ctx, this.state);
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
                _localctx.rowNodeID = (_a = this.gridApi.getDisplayedRowAtIndex((_localctx._INT != null ? Number(_localctx._INT.text) : 0))) === null || _a === void 0 ? void 0 : _a.id;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    envVar() {
        let _localctx = new EnvVarContext(this._ctx, this.state);
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
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    sempred(_localctx, ruleIndex, predIndex) {
        switch (ruleIndex) {
            case 1:
                return this.expr_sempred(_localctx, predIndex);
        }
        return true;
    }
    expr_sempred(_localctx, predIndex) {
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
    static get _ATN() {
        if (!FormulaParser.__ATN) {
            FormulaParser.__ATN = new ATNDeserializer_1.ATNDeserializer().deserialize(Utils.toCharArray(FormulaParser._serializedATN));
        }
        return FormulaParser.__ATN;
    }
}
exports.FormulaParser = FormulaParser;
FormulaParser.T__0 = 1;
FormulaParser.T__1 = 2;
FormulaParser.T__2 = 3;
FormulaParser.T__3 = 4;
FormulaParser.T__4 = 5;
FormulaParser.INT = 6;
FormulaParser.MUL = 7;
FormulaParser.DIV = 8;
FormulaParser.PLUS = 9;
FormulaParser.MINUS = 10;
FormulaParser.COMMA = 11;
FormulaParser.DQUOTE = 12;
FormulaParser.TRUE = 13;
FormulaParser.FALSE = 14;
FormulaParser.IDENT = 15;
FormulaParser.EQ = 16;
FormulaParser.NEQ = 17;
FormulaParser.LT = 18;
FormulaParser.LTE = 19;
FormulaParser.GT = 20;
FormulaParser.GTE = 21;
FormulaParser.RULE_prog = 0;
FormulaParser.RULE_expr = 1;
FormulaParser.RULE_absRowReference = 2;
FormulaParser.RULE_relativeRowReference = 3;
FormulaParser.RULE_arguments = 4;
FormulaParser.RULE_ref = 5;
FormulaParser.RULE_absRef = 6;
FormulaParser.RULE_envVar = 7;
// tslint:disable:no-trailing-whitespace
FormulaParser.ruleNames = [
    "prog", "expr", "absRowReference", "relativeRowReference", "arguments",
    "ref", "absRef", "envVar",
];
FormulaParser._LITERAL_NAMES = [
    undefined, "'('", "')'", "'['", "']'", "'@'", undefined, "'*'", "'/'",
    "'+'", "'-'", "','", "'\"'", undefined, undefined, undefined, "'=='",
    "'!='", "'<'", "'<='", "'>'", "'>='",
];
FormulaParser._SYMBOLIC_NAMES = [
    undefined, undefined, undefined, undefined, undefined, undefined, "INT",
    "MUL", "DIV", "PLUS", "MINUS", "COMMA", "DQUOTE", "TRUE", "FALSE", "IDENT",
    "EQ", "NEQ", "LT", "LTE", "GT", "GTE",
];
FormulaParser.VOCABULARY = new VocabularyImpl_1.VocabularyImpl(FormulaParser._LITERAL_NAMES, FormulaParser._SYMBOLIC_NAMES, []);
FormulaParser._serializedATN = "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x17\x85\x04\x02" +
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
class ProgContext extends ParserRuleContext_1.ParserRuleContext {
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_prog; }
    // @Override
    enterRule(listener) {
        if (listener.enterProg) {
            listener.enterProg(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitProg) {
            listener.exitProg(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitProg) {
            return visitor.visitProg(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ProgContext = ProgContext;
class ExprContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_expr; }
    copyFrom(ctx) {
        super.copyFrom(ctx);
    }
}
exports.ExprContext = ExprContext;
class TrueContext extends ExprContext {
    TRUE() { return this.getToken(FormulaParser.TRUE, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterTrue) {
            listener.enterTrue(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitTrue) {
            listener.exitTrue(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTrue) {
            return visitor.visitTrue(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TrueContext = TrueContext;
class FalseContext extends ExprContext {
    FALSE() { return this.getToken(FormulaParser.FALSE, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterFalse) {
            listener.enterFalse(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFalse) {
            listener.exitFalse(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFalse) {
            return visitor.visitFalse(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FalseContext = FalseContext;
class NegativeExpressionContext extends ExprContext {
    MINUS() { return this.getToken(FormulaParser.MINUS, 0); }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterNegativeExpression) {
            listener.enterNegativeExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitNegativeExpression) {
            listener.exitNegativeExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitNegativeExpression) {
            return visitor.visitNegativeExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.NegativeExpressionContext = NegativeExpressionContext;
class PositiveExpressionContext extends ExprContext {
    PLUS() { return this.getToken(FormulaParser.PLUS, 0); }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterPositiveExpression) {
            listener.enterPositiveExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPositiveExpression) {
            listener.exitPositiveExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPositiveExpression) {
            return visitor.visitPositiveExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PositiveExpressionContext = PositiveExpressionContext;
class MultiplicationOrDivisionContext extends ExprContext {
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    MUL() { return this.tryGetToken(FormulaParser.MUL, 0); }
    DIV() { return this.tryGetToken(FormulaParser.DIV, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterMultiplicationOrDivision) {
            listener.enterMultiplicationOrDivision(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMultiplicationOrDivision) {
            listener.exitMultiplicationOrDivision(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMultiplicationOrDivision) {
            return visitor.visitMultiplicationOrDivision(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MultiplicationOrDivisionContext = MultiplicationOrDivisionContext;
class AdditionOrSubtractionContext extends ExprContext {
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    PLUS() { return this.tryGetToken(FormulaParser.PLUS, 0); }
    MINUS() { return this.tryGetToken(FormulaParser.MINUS, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterAdditionOrSubtraction) {
            listener.enterAdditionOrSubtraction(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAdditionOrSubtraction) {
            listener.exitAdditionOrSubtraction(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAdditionOrSubtraction) {
            return visitor.visitAdditionOrSubtraction(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AdditionOrSubtractionContext = AdditionOrSubtractionContext;
class ComparisonContext extends ExprContext {
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    EQ() { return this.tryGetToken(FormulaParser.EQ, 0); }
    NEQ() { return this.tryGetToken(FormulaParser.NEQ, 0); }
    LT() { return this.tryGetToken(FormulaParser.LT, 0); }
    LTE() { return this.tryGetToken(FormulaParser.LTE, 0); }
    GT() { return this.tryGetToken(FormulaParser.GT, 0); }
    GTE() { return this.tryGetToken(FormulaParser.GTE, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterComparison) {
            listener.enterComparison(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitComparison) {
            listener.exitComparison(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComparison) {
            return visitor.visitComparison(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComparisonContext = ComparisonContext;
class FunctionContext extends ExprContext {
    IDENT() { return this.getToken(FormulaParser.IDENT, 0); }
    arguments() {
        return this.tryGetRuleContext(0, ArgumentsContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterFunction) {
            listener.enterFunction(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFunction) {
            listener.exitFunction(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunction) {
            return visitor.visitFunction(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionContext = FunctionContext;
class NumberContext extends ExprContext {
    INT() { return this.getToken(FormulaParser.INT, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterNumber) {
            listener.enterNumber(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitNumber) {
            listener.exitNumber(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitNumber) {
            return visitor.visitNumber(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.NumberContext = NumberContext;
class StringContext extends ExprContext {
    DQUOTE(i) {
        if (i === undefined) {
            return this.getTokens(FormulaParser.DQUOTE);
        }
        else {
            return this.getToken(FormulaParser.DQUOTE, i);
        }
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterString) {
            listener.enterString(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitString) {
            listener.exitString(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitString) {
            return visitor.visitString(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringContext = StringContext;
class ParenthesesContext extends ExprContext {
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterParentheses) {
            listener.enterParentheses(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParentheses) {
            listener.exitParentheses(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParentheses) {
            return visitor.visitParentheses(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ParenthesesContext = ParenthesesContext;
class AbsoluteReferenceContext extends ExprContext {
    absRef() {
        return this.getRuleContext(0, AbsRefContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterAbsoluteReference) {
            listener.enterAbsoluteReference(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAbsoluteReference) {
            listener.exitAbsoluteReference(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAbsoluteReference) {
            return visitor.visitAbsoluteReference(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AbsoluteReferenceContext = AbsoluteReferenceContext;
class ReferenceContext extends ExprContext {
    ref() {
        return this.getRuleContext(0, RefContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterReference) {
            listener.enterReference(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitReference) {
            listener.exitReference(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitReference) {
            return visitor.visitReference(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ReferenceContext = ReferenceContext;
class EnvironmentalVariableContext extends ExprContext {
    envVar() {
        return this.getRuleContext(0, EnvVarContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    enterRule(listener) {
        if (listener.enterEnvironmentalVariable) {
            listener.enterEnvironmentalVariable(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnvironmentalVariable) {
            listener.exitEnvironmentalVariable(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnvironmentalVariable) {
            return visitor.visitEnvironmentalVariable(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnvironmentalVariableContext = EnvironmentalVariableContext;
class AbsRowReferenceContext extends ParserRuleContext_1.ParserRuleContext {
    INT() { return this.getToken(FormulaParser.INT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_absRowReference; }
    // @Override
    enterRule(listener) {
        if (listener.enterAbsRowReference) {
            listener.enterAbsRowReference(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAbsRowReference) {
            listener.exitAbsRowReference(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAbsRowReference) {
            return visitor.visitAbsRowReference(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AbsRowReferenceContext = AbsRowReferenceContext;
class RelativeRowReferenceContext extends ParserRuleContext_1.ParserRuleContext {
    MINUS() { return this.tryGetToken(FormulaParser.MINUS, 0); }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    PLUS() { return this.tryGetToken(FormulaParser.PLUS, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_relativeRowReference; }
    // @Override
    enterRule(listener) {
        if (listener.enterRelativeRowReference) {
            listener.enterRelativeRowReference(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRelativeRowReference) {
            listener.exitRelativeRowReference(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRelativeRowReference) {
            return visitor.visitRelativeRowReference(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RelativeRowReferenceContext = RelativeRowReferenceContext;
class ArgumentsContext extends ParserRuleContext_1.ParserRuleContext {
    relativeRowReference(i) {
        if (i === undefined) {
            return this.getRuleContexts(RelativeRowReferenceContext);
        }
        else {
            return this.getRuleContext(i, RelativeRowReferenceContext);
        }
    }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(FormulaParser.COMMA);
        }
        else {
            return this.getToken(FormulaParser.COMMA, i);
        }
    }
    absRowReference(i) {
        if (i === undefined) {
            return this.getRuleContexts(AbsRowReferenceContext);
        }
        else {
            return this.getRuleContext(i, AbsRowReferenceContext);
        }
    }
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_arguments; }
    // @Override
    enterRule(listener) {
        if (listener.enterArguments) {
            listener.enterArguments(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitArguments) {
            listener.exitArguments(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitArguments) {
            return visitor.visitArguments(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ArgumentsContext = ArgumentsContext;
class RefContext extends ParserRuleContext_1.ParserRuleContext {
    IDENT() { return this.getToken(FormulaParser.IDENT, 0); }
    MINUS() { return this.tryGetToken(FormulaParser.MINUS, 0); }
    expr() {
        return this.tryGetRuleContext(0, ExprContext);
    }
    PLUS() { return this.tryGetToken(FormulaParser.PLUS, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_ref; }
    // @Override
    enterRule(listener) {
        if (listener.enterRef) {
            listener.enterRef(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRef) {
            listener.exitRef(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRef) {
            return visitor.visitRef(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RefContext = RefContext;
class AbsRefContext extends ParserRuleContext_1.ParserRuleContext {
    IDENT() { return this.getToken(FormulaParser.IDENT, 0); }
    INT() { return this.getToken(FormulaParser.INT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_absRef; }
    // @Override
    enterRule(listener) {
        if (listener.enterAbsRef) {
            listener.enterAbsRef(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAbsRef) {
            listener.exitAbsRef(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAbsRef) {
            return visitor.visitAbsRef(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AbsRefContext = AbsRefContext;
class EnvVarContext extends ParserRuleContext_1.ParserRuleContext {
    IDENT() { return this.getToken(FormulaParser.IDENT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return FormulaParser.RULE_envVar; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnvVar) {
            listener.enterEnvVar(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnvVar) {
            listener.exitEnvVar(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnvVar) {
            return visitor.visitEnvVar(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnvVarContext = EnvVarContext;
//# sourceMappingURL=FormulaParser.js.map