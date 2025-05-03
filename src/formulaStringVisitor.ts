import { GridApi } from "ag-grid-community";
import {
  FormulaValue,
  ERROR,
  STRING,
  NUMBER,
  EMPTY,
  formulaString,
  formulaError,
  queryValue,
  QUERY,
} from "./formula";

import {
  AdditionOrSubtractionContext,
  FunctionContext,
  MultiplicationOrDivisionContext,
  NegativeExpressionContext,
  PositiveExpressionContext,
  NumberContext,
  ReferenceContext,
  StringContext,
  EnvironmentalVariableContext,
  AbsoluteReferenceContext,
  AbsRowReferenceContext,
  RelativeRowReferenceContext,
  ExprContext,
  ParenthesesContext,
  TrueContext,
  FalseContext,
  ComparisonContext,
} from "./FormulaParser";
import { FormulaVisitor } from "./FormulaVisitor";

import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { getAllRowNodes } from "./gridUtils";

export class FormulaStringContext {
  gridApi: GridApi;

  constructor(gridApi: GridApi) {
    this.gridApi = gridApi;
  }
}

export class FormulaStringVisitor
  extends AbstractParseTreeVisitor<FormulaValue>
  implements FormulaVisitor<FormulaValue>
{
  evaluationContext: FormulaStringContext;

  constructor(ctx: FormulaStringContext) {
    super();
    this.evaluationContext = ctx;
  }

  protected defaultResult(): FormulaValue {
    return formulaError("Default formulaStringVisitor result should not be used.");
  }

  visitTrue(ctx: TrueContext): any {
    return formulaString(ctx.text.toString());
  }

  visitFalse(ctx: FalseContext): any {
    return formulaString(ctx.text.toString());
  }

  visitFunction(ctx: FunctionContext): any {
    let args: AbsRowReferenceContext[] | ExprContext[] | null | undefined = null;
    args = ctx.arguments()?.absRowReference();
    if (!args || args.length === 0) {
      args = ctx.arguments()?.relativeRowReference();
    }
    if (!args || args.length === 0) {
        args = ctx.arguments()?.expr();
      }

    let functionName = ctx.IDENT().text;
    let argList = [] as any;

    for (let arg of args!) {
      let argValue = arg.accept(this);
      argList.push(argValue);
    }

    let formulaStr = `${functionName}(`;
    for (let i = 0; i < argList.length; i++) {
      const arg = argList[i];
      formulaStr += arg.value;
      if (i < argList.length - 1) {
        formulaStr += ", ";
      }
    }
    formulaStr += ")";
    return formulaString(formulaStr);
  }

  visitMultiplicationOrDivision(
    ctx: MultiplicationOrDivisionContext
  ): FormulaValue {
    const left = this.visit(ctx._left).value;
    const right = this.visit(ctx._right).value;

    if (ctx.MUL() != undefined) {
      return formulaString(left + "*" + right);
    } else {
      return formulaString(left + "/" + right);
    }
  }

  visitAdditionOrSubtraction(ctx: AdditionOrSubtractionContext): FormulaValue {
    const left = this.visit(ctx._left);
    const right = this.visit(ctx._right);

    if (ctx.PLUS() != undefined) {
      return formulaString(left.value + "+" + right.value);
    } else {
      return formulaString(left.value + "-" + right.value);
    }
  }

  visitComparison(ctx: ComparisonContext): FormulaValue {
    const left = this.visit(ctx._left);
    const right = this.visit(ctx._right);

    if (ctx.EQ() !== undefined) {
      return formulaString(left.value + "==" + right.value);
    } else if (ctx.GT() !== undefined) {
      return formulaString(left.value + ">" + right.value);
    } else if (ctx.GTE() !== undefined) {
      return formulaString(left.value + ">=" + right.value);
    } else if (ctx.LT() !== undefined) {
      return formulaString(left.value + "<" + right.value);
    } else if (ctx.LTE() !== undefined) {
      return formulaString(left.value + "<=" + right.value);
    } else {
      return formulaString(left.value + "!=" + right.value);
    }
  }

  visitNumber(ctx: NumberContext): FormulaValue {
    return formulaString(ctx.text);
  }

  visitString(ctx: StringContext): FormulaValue {
    return formulaString(ctx.text);
  }

  visitParentheses(ctx: ParenthesesContext): FormulaValue {
    let innerExpr = this.visit(ctx.expr());
    const formulaText = "(" + innerExpr.value + ")";
    return formulaString(formulaText);
  }

  visitPositiveExpression(ctx: PositiveExpressionContext): FormulaValue {
    let arbitraryExpression = this.visit(ctx._an);
    return formulaString("+" + arbitraryExpression.value);
  }

  visitNegativeExpression(ctx: NegativeExpressionContext): FormulaValue {
    let arbitraryExpression = this.visit(ctx._an);
    return formulaString("-" + arbitraryExpression.value);
  }

  visitAbsRowReference(ctx: AbsRowReferenceContext): FormulaValue {
    const formulaText: string = "[" + ctx.INT().text + "]";
    return formulaString(formulaText);
  }

  visitRelativeRowReference(ctx: RelativeRowReferenceContext): FormulaValue {
    let plusMinus = "";
    
    if (ctx.PLUS()) {
        plusMinus = "+";
      } else if (ctx.MINUS()) {
        plusMinus = "-";
      }

    const rowIndexExpr = this.visit(ctx.expr());
    const formulaText: string = "[" + plusMinus + rowIndexExpr.value + "]";
    return formulaString(formulaText);
  }

  visitAbsoluteReference(ctx: AbsoluteReferenceContext): FormulaValue {
    let ident = ctx.absRef().IDENT();
    let index = ctx.absRef().INT().text;
    let id = String(ctx.absRef().rowNodeID);

    if (index === null || index === undefined) {
      return formulaError("bug");
    }

    if (id == null) {
      return formulaError("Row " + index + " does not exist.");
    }
    let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);
    if (referencedRowNode?.id === undefined) {
      return formulaError("Row " + index + " does not exist.");
    }
    let formulaText = ident.text + "[" + referencedRowNode.rowIndex + "]";
    return formulaString(formulaText);
  }

  visitReference(ctx: ReferenceContext): any {
    let ident = ctx.ref().IDENT();
    let indexExpr = ctx.ref().expr();
    if (indexExpr === undefined || indexExpr === null) {
      return formulaString(ident.text);
    }

    // If the formula reference has no index (referencing whole column) and the reference is inside a function,
    // add a dependency between current formuala cell and each row of the referenced column
    if (!indexExpr) {
      // Check if the identifier is a name of named cell
      // Iterate over all the nodes of the table
      let foundNamedCell = false;
      let colName: string | null = null;
      let rowNodeId: string | undefined | null = null;
      let cell = null;
      const allRowNodes = getAllRowNodes(this.evaluationContext.gridApi);
      allRowNodes.forEach((rowNode) => {
        if (foundNamedCell) {
          return;
        }
        const rowData = rowNode.data;
        for (const key in rowData) {
          const cellValue = rowData[key];
          if (cellValue && cellValue.name === ident.text) {
            foundNamedCell = true;
            colName = key;
            rowNodeId = rowNode.id;
            cell = cellValue;
          }
        }
      });
      if (foundNamedCell && colName && rowNodeId) {
        const nameId = ident.text;
        return formulaString(ident.text);
      }
    }

    let index: any = { kind: "NUMBER", value: new Number(0) };
    if (indexExpr != undefined) {
      index = indexExpr.accept(this);
    }

    switch (index.kind) {
      case ERROR:
        return formulaError("Error in offset: " + index.value);
      case NUMBER:
        let offset = index.value;

        let referencedRowIndex: Number = Math.trunc(offset);
        if (indexExpr && ctx.ref().PLUS()) {
          return formulaString(ident.text + "[+" + indexExpr?.text + "]");
        } else if (indexExpr && ctx.ref().MINUS()) {
          return formulaString(ident.text + "[-" + indexExpr?.text + "]");
        }

        // referencedRowIndex = Math.trunc(offset);
        let referencedRowNode =
          this.evaluationContext.gridApi.getDisplayedRowAtIndex(
            referencedRowIndex.valueOf()
          );
        if (referencedRowNode?.id == null) {
          return formulaError("Row " + referencedRowIndex + " does not exist.");
        }
        // If the column does not exist in the row data, throw an error
        if (!(ident.text in referencedRowNode.data)) {
          return formulaError("Column " + ident.text + " does not exist.");
        }
       

      case STRING:
        if (indexExpr && ctx.ref().PLUS()) {
          return formulaString(ident.text + "[+" + index?.value + "]");
        } else if (indexExpr && ctx.ref().MINUS()) {
          return formulaString(ident.text + "[-" + index?.value + "]");
        }
        const value = index.value;
        if (value.includes('>') || value.includes('<') || value.includes('>=') || value.includes('<=')) {
            return formulaString(ident.text + "[" + value + "]");
        }
        return formulaString(ident.text + "[" + index.value + "]");

      case EMPTY:
        return formulaError("Missing offset.");
    }
    // Get the cell Column which has the reference.
    let focuscedColumn = this.evaluationContext.gridApi
      ?.getFocusedCell()
      ?.column.getColId();

    return formulaString(ident.text);
  }

  visitEnvironmentalVariable(ctx: EnvironmentalVariableContext): FormulaValue {
    let ident = ctx.envVar().IDENT();
    return formulaString(ident.text);
  }
}
