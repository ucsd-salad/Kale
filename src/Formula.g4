grammar Formula;

@header { import { GridApi } from "ag-grid-community";}

@members {
    public gridApi: GridApi;
}

fragment DIGIT: '0' ..'9';

INT: DIGIT+ | DIGIT+ ('.' DIGIT*)? | ('.' DIGIT+);
MUL: '*';
DIV: '/';
PLUS: '+';
MINUS: '-';
COMMA: ',';
DQUOTE: '"';
TRUE: [Tt][Rr][Uu][Ee];
FALSE: [Ff][Aa][Ll][Ss][Ee];
IDENT: [A-Za-z0-9_]+;

// Comparison Operators
EQ: '==';
NEQ: '!=';
LT: '<';
LTE: '<=';
GT: '>';
GTE: '>=';

prog: expr;
expr:
	TRUE																	# True
	| FALSE																	# False
	| MINUS an = expr														# NegativeExpression
	| PLUS an = expr														# PositiveExpression
	| left = expr operator = (MUL | DIV) right = expr						# MultiplicationOrDivision
	| left = expr operator = (PLUS | MINUS) right = expr					# AdditionOrSubtraction
	| left = expr operator = (EQ | NEQ | LT | LTE | GT | GTE) right = expr	# Comparison
	| IDENT '(' arguments? ')'												# Function
	| INT																	# Number
	| DQUOTE (.)*? DQUOTE													# String
	| '(' expr ')'															# Parentheses
	| absRef																# AbsoluteReference
	| ref																	# Reference
	| envVar																# EnvironmentalVariable;
absRowReference
    returns [rowNodeID: string | undefined]:
        '[' INT ']' { $rowNodeID = this.gridApi.getDisplayedRowAtIndex($INT.int)?.id; };

relativeRowReference:
     '[' MINUS an = expr ']'
	| '[' PLUS an = expr ']';

arguments:
    // TODO: combine these. These should not be separate productions, and references should be special cases of exprs.
    relativeRowReference (COMMA relativeRowReference)* 
    | absRowReference (COMMA absRowReference)*
	| expr (COMMA expr)*;
ref:
	IDENT
	| IDENT '[' MINUS an = expr ']'
	| IDENT '[' PLUS an = expr ']';
    
absRef
	returns[rowNodeID: string | undefined]:
	IDENT '[' INT ']' { $rowNodeID = this.gridApi.getDisplayedRowAtIndex($INT.int)?.id; };
envVar: '@' IDENT;