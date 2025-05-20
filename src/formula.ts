import { ColumnApi, GridApi } from "ag-grid-community";
import { FormulaStringContext } from "./formulaStringVisitor";
import { BailErrorStrategy, CharStreams } from "antlr4ts";
import { FormulaLexer } from "./FormulaLexer";
import {
  AdditionOrSubtractionContext,
  FormulaParser,
  FunctionContext,
  MultiplicationOrDivisionContext,
  NegativeExpressionContext,
  PositiveExpressionContext,
  NumberContext,
  ReferenceContext,
  ParenthesesContext,
  StringContext,
  EnvironmentalVariableContext,
  AbsRowReferenceContext,
  RelativeRowReferenceContext,
  ExprContext,
  AbsoluteReferenceContext,
  TrueContext,
  FalseContext,
  ComparisonContext,
} from "./FormulaParser";
import { FormulaVisitor } from "./FormulaVisitor";
import { CommonTokenStream } from "antlr4ts";

import { ProgContext } from "./FormulaParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { strict as assert } from "assert";
import { FormulaCell } from "./formulacell";
import { NAMED_CELL_PREFIX, AGGREGATE_COL_NAME } from "./grid";
import { getAllRowNodes } from "./gridUtils";
import { FormulaStringVisitor } from "./formulaStringVisitor";
import { areArgsValid, invalidArgsMessage,collectValuesFunc,sumFunc,incrementFunc} from "./functionsImpl/ifFunction";
import { ABS, COUNT, IF, MAX, MIN, SUM, MEDIAN , LARGE, AVERAGE, ROUND } from "./functionNames";
import { none } from "@hookstate/core";
export const NUMBER = "NUMBER";
export const BOOLEAN = "BOOLEAN";
export const STRING = "STRING";
export const ERROR = "ERROR";
export const EMPTY = "EMPTY";
export const REFERENCE = "REFERENCE";
export const ROW_REFERENCE = "ROW_REFERENCE";
export const QUERY = "QUERY";
export const TRUE = "TRUE";
export const FALSE = "FALSE";
export const BOOLEAN_STRING_MAPPING = new Map<boolean, string>([
  [true, TRUE],
  [false, FALSE]
]);

type DecimalValue = {
  kind: "NUMBER";
  value: Number;
};

type BooleanValue = {
  kind: "BOOLEAN";
  value: Boolean;
};

type StringValue = {
  kind: "STRING";
  value: string;
};

type FormulaError = {
  kind: "ERROR";
  value: string;
};

type EmptyCellValue = {
  kind: "EMPTY";
  value: string;
};

type ReferenceValue = {
  kind: "REFERENCE";
  value: string;
};

type RowReferenceValue = {
  kind: "ROW_REFERENCE";
  value: number;
}

// type QueryValue = {

//   kind: "QUERY";
//   value: any;
//   value_left: any;

// }

type QueryValue = {
  kind: "QUERY";
  referenced_column: any;
  vector: number[] | boolean[];
}

export let formulaError = (msg: string): FormulaError => {
  return {
    kind: ERROR,
    value: msg,
  };
};

export let formulaNumber = (x: Number): DecimalValue => {
  return {
    kind: NUMBER,
    value: x,
  };
};

export let formulaBoolean = (b: Boolean): BooleanValue => {
  return {
    kind: BOOLEAN,
    value: b,
  }
}

export let formulaString = (s: string): StringValue => {
  return {
    kind: STRING,
    value: s,
  };
};

export let emptyCell: EmptyCellValue = {
  kind: EMPTY,
  value: ''
};

export let referenceValue = (r: string): ReferenceValue => {
  return {
    kind: REFERENCE,
    value: r,
  };
};

export let rowReferenceValue = (r: number): RowReferenceValue => {
  return {
    kind: ROW_REFERENCE,
    value: r,
  }
}

// export let queryValue = (r: , value_left: any = null): QueryValue => {
//   return {
//     kind: QUERY,
//     value: r,
//     value_left: value_left,
//   };
// };

export let queryValue = (referenced_column: any, vector: number[] | boolean[]): QueryValue => {
  return {
    kind: "QUERY",
    referenced_column: referenced_column,
    vector: vector
  };
};

function isQueryValue(obj: any): obj is QueryValue {
  return obj && obj.kind === "QUERY" && "vector" in obj;
}

function asQueryValue(value: any): QueryValue | null {
  if (value && value.kind === "QUERY") {
      return value;
  }
  return null;
}

export type FormulaValue =
  | DecimalValue
  | BooleanValue
  | StringValue
  | FormulaError
  | EmptyCellValue;
  // | QueryValue;

export class EvaluationContext {
  gridApi: GridApi;
  columnApi: ColumnApi;
  inRowId: string;
  envVar: object;
  // If trackingDependencies is false, then visiting the nodes won't affect precedents member field of the formula cell
  // Else, it would find and update the precedents of the formula cell
  trackingDependencies: boolean;

  constructor(gridApi: GridApi, columnApi: ColumnApi, inRowId: string, envVar: object, trackingDependencies: boolean) {
    this.gridApi = gridApi;
    this.columnApi = columnApi;
    this.inRowId = inRowId;
    this.envVar = envVar;
    this.trackingDependencies = trackingDependencies;
  }

  getCellValue(colName: string, rowId: string): FormulaValue {
    let rowData = this.gridApi.getRowNode(rowId);
    if (rowData == null) {
      return emptyCell;
    }
    let cellValue = rowData.data[colName];

    if (cellValue && cellValue.formulaCell) {
      return cellValue.formulaCell.value;
    } else if (cellValue && typeof cellValue.value === "string") {
      return formulaString(cellValue.value);
    } else if (cellValue && typeof cellValue.value === "number") {
      return formulaNumber(new Number(cellValue.value));
    } else if (cellValue && typeof cellValue.value === "boolean") {
      return formulaBoolean(new Boolean(cellValue.value));
    } else {
      return emptyCell;
    }
  }

  getColumnValueReference(
    colName: string,
    focuscedColumn: string | undefined
  ): ReferenceValue | FormulaError {
    // if (focuscedColumn === colName) {
    //   return formulaError("Cannot reference itself");
    // }

    if (this.columnApi.getColumn(colName)) {
      return referenceValue(colName);
    } else {
      return formulaError("Column " + colName + " not found");
    }
  }

  getRowReference(rowIndex: number) {
    // Check the row index bounds
    const totalRows = this.gridApi.getDisplayedRowCount();
    if (rowIndex >= 0 && rowIndex < totalRows) {
      return rowReferenceValue(rowIndex);
    } else {
      return formulaError("Row " + rowIndex + "does not exist");
    }
  }

  // get value of cell with a numerical value
  getValueOfColumnCell(nodeData: any): Number | number | undefined {
    if (!nodeData) {
      return 0;
    }
    if (nodeData.formulaCell && nodeData.formulaCell.value.kind === NUMBER) {
      const formulaCalculatedValue = nodeData.formulaCell.value.value;
      return formulaCalculatedValue;
    }

    if (typeof nodeData.value === "number") {
      return nodeData.value;
    }
  }
  
  applyFnOnColumnValues(colName: any, result: any, callableFunc: (...args: any) => any): any {
    let errorPresent = false;
    let error;
    this.gridApi.forEachNode((node) => {
      if (errorPresent) {
        return;
      }
      const cellData = node.data[colName];
      if (cellData && cellData.formulaCell && cellData.formulaCell.value && cellData.formulaCell.value.kind == "ERROR") {
        errorPresent = true;
        error = cellData.formulaCell.value;
        return;
      }
      const cellValue = this.getValueOfColumnCell(cellData);
      if (cellValue) {
        result = callableFunc(result, cellValue);
      }
    });
    if (errorPresent) {
      return error;
    }
    return result;
  }

  applyFnOnRowValues(rowIndex: number, result: any, callableFunc: (...args: any) => any): any {
    // Get row node using the row index
    const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
    const rowData = rowNode?.data;
    // Iterate through all the cells of the row and apply the callableFunc
    for (const col in rowData) {
      if (col === AGGREGATE_COL_NAME) {
        continue;
      }
      const cellData = rowData[col];
      if (cellData && cellData.formulaCell && cellData.formulaCell.value && cellData.formulaCell.value.kind == "ERROR") {
        return cellData.formulaCell.value;
      }
      const cellValue = this.getValueOfColumnCell(cellData);
      if (cellValue) {
        result = callableFunc(result, cellValue);
      }
    }
    return result;
  }
}

class FormulaEvaluationVisitor
  extends AbstractParseTreeVisitor<FormulaValue>
  implements FormulaVisitor<FormulaValue>
{
  evaluationContext: EvaluationContext;
  formulaCell: FormulaCell;
  insideFunction: boolean;
  insideQuery: boolean;

  protected defaultResult(): FormulaValue {
    return formulaError("Default result should not be used.");
  }

  constructor(ctx: EvaluationContext, formulaCell: FormulaCell) {
    super();
    this.evaluationContext = ctx;
    this.formulaCell = formulaCell;
    this.insideFunction = false;
    this.insideQuery= false;
  }

  visitTrue(ctx: TrueContext): FormulaValue {
    return formulaString(TRUE);
  }

  visitFalse(ctx: FalseContext): FormulaValue {
    return formulaString(FALSE);
  }

  visitFunction(ctx: FunctionContext): any {
    let args: (AbsRowReferenceContext[] | ExprContext[] | null | undefined) = null;
    args = ctx.arguments()?.absRowReference();

    if (!args || args.length === 0) {
      args = ctx.arguments()?.relativeRowReference();
    }

    if (!args || args.length === 0) {
        args = ctx.arguments()?.expr();
    }

    let functionName = ctx.IDENT().text.toUpperCase();

    // determine whether or not to evaluate references before entering function
    if (functionName === "ROUND"
      || (functionName === "AVERAGE" && args && args.length > 1)
      || (functionName === "SUM" && args && args.length > 1)
      || (functionName === "MAX" && args && args.length > 1)
      || (functionName === "MIN" && args && args.length > 1)) {
      this.insideFunction = false;
    } else {
      this.insideFunction = true;
    }

    let argList = [] as any;

    if (functionName === IF) {
      if (!args || !areArgsValid(args)) {
        return formulaError(
          invalidArgsMessage(args?.length)
        );
      }
      const logicalExpr = args[0].accept(this);
      if (logicalExpr.kind === ERROR) {
        return formulaError(`Error evaluating the first argument`);
      }
      // Typecast logical expression value to boolean
      let logicalExprEvalVal = false;
      if (logicalExpr.kind === STRING) {
        logicalExprEvalVal = Boolean(JSON.parse(logicalExpr.value.valueOf().toLowerCase())).valueOf();
      } else {
        logicalExprEvalVal = Boolean(JSON.parse(logicalExpr.value.valueOf())).valueOf();
      }
      if (logicalExprEvalVal) {
        // Return then value
        const thenValue = args[1].accept(this);
        if (thenValue.kind === ERROR) {
          return formulaError(`Error evaluating the second argument`);
        }
        return formulaNumber(thenValue.value);
      } else {
        // Return else value
        if (args.length === 2) {
          return formulaString(FALSE);
        } else {
          const elseValue = args[2].accept(this);
          if (elseValue.kind === ERROR) {
            return formulaError(`Error evaluating the third argument`);
          }
          return formulaNumber(elseValue.value);
        }
      }
    }

    for (let arg of args!) {
      let argValue = arg.accept(this);

      if (argValue.kind === ERROR) {
        return formulaError(argValue.value);
      }
      else if(argValue.kind === QUERY && argValue.referenced_column=='') {
        return formulaError("Invalid Query Form");
      }else {
        argList.push(argValue);
      }
    }


    if (functionName === ABS) {
      if (argList.length !== 1)
        return formulaError("ABS function takes exactly one argument");
      else if (argList[0].kind === ROW_REFERENCE || argList[0].kind === REFERENCE || argList[0].kind === QUERY) {
        return formulaError("ABS function takes exactly one integer argument");
      }
      else {
        return formulaNumber(Math.abs(argList[0].value));
      }
    }

    if (functionName === MAX) {
      let maxValue = new Number(-Infinity);

      var maxValueFunc = (
        a: number | Number,
        b: number | Number
      ): Number => {
        return Math.max(a.valueOf(), b.valueOf());
      };

      for (let arg of argList) {
        if (arg.kind === ERROR) {
          return formulaError(arg.value);
        }
        let value;
        if (arg.kind === REFERENCE) {

          value = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            maxValue,
            maxValueFunc
          );
        }
        else if (arg.kind === ROW_REFERENCE) {
          value = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            maxValue,
            maxValueFunc
          );
        }
        else if (arg.kind === NUMBER) {
          value = arg.value;
        } else if (arg.kind === QUERY) {
          for (const num of arg.vector) {
            maxValue = maxValueFunc(maxValue, num);
          }
        }



        if (value && maxValue <= value) {
          maxValue = value;
        }
        if (value && value.kind && value.kind === ERROR) {
          return value;
        }
      }

      return formulaNumber(maxValue);
    }

    if (functionName === MIN) {
      let minValue = new Number(Infinity);

      var minValueFunc = (
        a: number | Number,
        b: number | Number
      ): Number => {
        return Math.min(a.valueOf(), b.valueOf());
      };
      let value;
      for (let arg of argList) {
        if (arg.kind === ERROR) {
          return formulaError(arg.value);
        }

        if (arg.kind === REFERENCE) {
          // If the reference is to a column, we need to find the minimum value in the column
          value = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            minValue,
            minValueFunc
          );
        }
        else if (arg.kind === ROW_REFERENCE) {
          value = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            minValue,
            minValueFunc
          );
        }
        else if (arg.kind === NUMBER) {
          value = arg.value;
        } else if (arg.kind === QUERY) {
          for (const num of arg.vector) {
            minValue = minValueFunc(minValue, num);
          }
        }
        if (value && minValue >= value) {
          minValue = value;
        }
        if (value && value.kind && value.kind === ERROR) {
          return value;
        }
      }

      return formulaNumber(minValue);
    }

    if (functionName === SUM) {
      let sumValue = new Number(0);

      var sumValueFunc = (
        a: number | Number,
        b: number | Number
      ): Number => {
        return a.valueOf() + b.valueOf();
      };

      for (let arg of argList) {
        if (arg.kind === ERROR) {
          return formulaError(arg.value);
        }
        let value;
        if (arg.kind === QUERY) { 
          value = arg.vector.reduce((acc, cur) => sumValueFunc(acc, cur), 0);
        }
        if (arg.kind === REFERENCE) {
          // If the reference is to a column, we need to find the sum value in the column
          value = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            0,
            sumValueFunc
          );
        }
        else if (arg.kind === ROW_REFERENCE) {
          value = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            0,
            sumValueFunc
          );
        }
        else if (arg.kind === NUMBER) {
          value = arg.value;
        }
        if (value) {
          sumValue += value;
        }
        if (value && value.kind && value.kind === ERROR) {
          return value;
        }
      }

      return formulaNumber(sumValue);
    }

    if (functionName === COUNT) {
      let countValue = new Number(0);

      for (let arg of argList) {
        if (arg.kind === ERROR) {
          return formulaError(arg.value);
        }
        let value;
        if (arg.kind === REFERENCE) {
          // If the reference is to a column, we need to find the count value in the column
          value = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            0,
            incrementFunc
          );
        }
        else if (arg.kind === ROW_REFERENCE) {
          value = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            0,
            incrementFunc
          );
        }
        else if (arg.kind === NUMBER) {
          value = countValue.valueOf() + 1;
        }
        else if (arg.kind === QUERY) {
          // Count the number of elements in the vector
          value = arg.vector.length;
        }
        if (value ) {
          countValue += value;
        }
        if (value && value.kind && value.kind === ERROR) {
          return value;
        }
      }
      this.insideFunction = false;
      return formulaNumber(countValue);
    } 

    if (functionName === MEDIAN) {
        let columnValues: number[] = [];
        let value;
        for (let arg of argList) {
          if (arg.kind === ERROR) {
            return formulaError(arg.value);
          }

          if (arg.kind === REFERENCE) {
            // If the reference is to a column, we need to collect all values in the column
            value = this.evaluationContext.applyFnOnColumnValues(arg.value, columnValues, collectValuesFunc);
          } else if (arg.kind === ROW_REFERENCE) {
            value = this.evaluationContext.applyFnOnRowValues(arg.value, columnValues, collectValuesFunc);
          } else if (arg.kind === NUMBER) {
            columnValues.push(arg.value);
          } else if (arg.kind === QUERY) {
            // Add all values from arg.vector to columnValues
            columnValues.push(...arg.vector);
          }

          if (value && value.kind && value.kind === ERROR) {
            return value;
          }
          }
          
        const n = columnValues.length;
        if (n === 0) {
          return formulaError("No values to calculate median");
        }
        // Now calculate the median from columnValues
        columnValues.sort((a, b) => a - b);

        let medianValue: number;

        if (n % 2 === 1) {
          medianValue = columnValues[Math.floor(n / 2)];
        } else {
          const middle1 = columnValues[Math.floor((n / 2) - 1)];
          const middle2 = columnValues[Math.floor(n / 2)];
          medianValue = (middle1 + middle2) / 2;
        }

        return formulaNumber(medianValue);
    }
    if (functionName === ROUND) {
      if (argList.length !== 2) {
        return formulaError("ROUND function takes exactly two arguments");
      }

      let value = argList[0];
      let decimalPlaces = argList[1];

      if (value.kind === ERROR || decimalPlaces.kind === ERROR) {
        return formulaError("placeholder");
      }

      if (value.kind === NUMBER && decimalPlaces.kind === NUMBER) {
        return formulaNumber(
          Number(value.value.toFixed(decimalPlaces.value.valueOf()))
        );
      } else {
        return formulaError("Invalid arguments for ROUND function");
      }
    }
    if (functionName === AVERAGE) {
      let sumValue = new Number(0);
      let countValue = new Number(0); 
    
      for (let arg of argList) {
        if (arg.kind === "ERROR") {
          return formulaError(arg.value);
        }
        let value: Number | undefined;
        if (arg.kind === "REFERENCE") {
          value = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            0,
            sumFunc
          );
          let columnCount = this.evaluationContext.applyFnOnColumnValues(
            arg.value,
            0,
            incrementFunc
          );
          countValue = new Number(countValue.valueOf() + columnCount.valueOf());
        } else if (arg.kind === "ROW_REFERENCE") {
          value = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            0,
            sumFunc
          );
          let rowCount = this.evaluationContext.applyFnOnRowValues(
            arg.value,
            0,
            incrementFunc
          );
          countValue = new Number(countValue.valueOf() + rowCount.valueOf());
        } else if (arg.kind === "NUMBER") {
          value = new Number(arg.value);
          countValue = new Number(countValue.valueOf() + 1);
        }
        else if (arg.kind === "QUERY") {
          for (const num of arg.vector) {
            sumValue = new Number(sumValue.valueOf() + num);
            countValue = new Number(countValue.valueOf() + 1);
          }
        }
        if (value !== undefined) {
          sumValue = new Number(sumValue.valueOf() + value.valueOf());
        }
      }
    
      if (countValue.valueOf() === 0) {
        return formulaError("No values to calculate average");
      }
    
      return formulaNumber(sumValue.valueOf() / countValue.valueOf());
    }     
    
    if (functionName === LARGE) {
      if (argList.length !== 2) {
        return formulaError("LARGE expects exactly 2 arguments.");
      }

      const rangeArg = argList[0];
      const nArg = argList[1];

      if (rangeArg.kind === ERROR || nArg.kind === ERROR) {
        return formulaError(rangeArg.value || nArg.value);
      }

      let n: number;
          if (nArg.kind === NUMBER) {
        
            n = nArg.value;
            if (!Number.isInteger(n.valueOf())) {
              console.log("the value of n is",n)
              return formulaError("Second argument must be an integer");
          }
      } else {
        return formulaError("Second argument must be a number");
      }

      let rangeValues: number[] = [];

      let value;

      if (rangeArg.kind === REFERENCE) {
        // If the reference is to a column, we need to collect all values in the column
        value = this.evaluationContext.applyFnOnColumnValues(rangeArg.value, rangeValues, collectValuesFunc);
      } else if (rangeArg.kind === QUERY) {
        // Add all values from rangeArg.vector to rangeValues
        rangeValues.push(...rangeArg.vector);
      } else {
        return formulaError("First argument must be a range");
      }

      if (value && value.kind && value.kind === ERROR) {
        return value;

      }

      if (rangeValues.length === 0) {
        return formulaError("Range cannot be empty");
          }
      
      if (n <= 0 || n > rangeValues.length) {
            return formulaError("Invalid n");
          }

      rangeValues.sort((a, b) => b - a); // sort descending

      return formulaNumber(rangeValues[n - 1]);
    }
      
    else {
      return formulaError("Formula not supported");
    }
  }

  visitMultiplicationOrDivision(
    ctx: MultiplicationOrDivisionContext
  ): FormulaValue {
    let left = ctx._left.accept(this);
    //this.visit(ctx._left);
    let right = this.visit(ctx._right);


    if (left.kind != NUMBER) {
      return formulaError("Left argument must be numeric");
    }
    if (right.kind != NUMBER) {
      return formulaError("Right argument must be numeric");
    }

    if (ctx.MUL() != undefined) {
      return formulaNumber(left.value.valueOf() * right.value.valueOf());
    } else {
      return formulaNumber(left.value.valueOf() / right.value.valueOf());
    }
  }

  visitAdditionOrSubtraction(ctx: AdditionOrSubtractionContext): FormulaValue {
    let left = this.visit(ctx._left);
    let right = this.visit(ctx._right);

    if (left.kind != NUMBER) {
      return formulaError("Left argument must be numeric");
    }
    if (right.kind != NUMBER) {
      return formulaError("Right argument must be numeric");
    }

    if (ctx.PLUS() != undefined) {
      return formulaNumber(left.value.valueOf() + right.value.valueOf());
    } else {
      return formulaNumber(left.value.valueOf() - right.value.valueOf());
    }
  }

  visitComparison(ctx: ComparisonContext): any {
    this.insideQuery = true;
    const left = this.visit(ctx._left);
    const right = this.visit(ctx._right); 

    if (isQueryValue(left) || isQueryValue(right)) {
      // let vectorValue: QueryValue | null = asQueryValue(left) ? left : (asQueryValue(right) ? right : null);
      let vectorValue: QueryValue | null = asQueryValue(left) || asQueryValue(right);


      let scalarValue = isQueryValue(left) ? right : left;

      if (vectorValue && vectorValue.vector.some(val => val instanceof Array)) {
          return formulaError("Can't compare two vector values");
      }

      const comparisonResults: boolean[] = [];

      // vectorValue!.vector.forEach(val => {
      (vectorValue as QueryValue).vector.forEach(val => {

      let comparison: boolean = false;
          const scalar = scalarValue.value.valueOf();

          if (ctx.EQ() !== undefined) {
              comparison = val == scalar;
          } else if (ctx.GT() !== undefined) {
              comparison = val > scalar;
          } else if (ctx.GTE() !== undefined) {
              comparison = val >= scalar;
          } else if (ctx.LT() !== undefined) {
              comparison = val < scalar;
          } else if (ctx.LTE() !== undefined) {
              comparison = val <= scalar;
          } else {
              comparison = val != scalar;
          }

          comparisonResults.push(comparison);
      });

      if (vectorValue) {
          vectorValue.vector = comparisonResults;
      }
      return vectorValue;
    } else {
        const leftValue = left.value.valueOf();
        const rightValue = right.value.valueOf();

        let comparisonValue: boolean = false;
        if (ctx.EQ() !== undefined) {
            comparisonValue = leftValue == rightValue;
        } else if (ctx.GT() !== undefined) {
            comparisonValue =  leftValue > rightValue;
        } else if (ctx.GTE() !== undefined) {
            comparisonValue = leftValue >= rightValue;
        } else if (ctx.LT() !== undefined) {
            comparisonValue = leftValue < rightValue;
        } else if (ctx.LTE() !== undefined) {
            comparisonValue = leftValue <= rightValue;
        } else {
            comparisonValue = leftValue != rightValue;
        }

        const comparisonValueStr = BOOLEAN_STRING_MAPPING.get(comparisonValue);
        if (comparisonValueStr) {
            return formulaString(comparisonValueStr);
        }
        return formulaError("Comparison evaluation is not boolean");
    }
  }
  
  visitNumber(ctx: NumberContext): FormulaValue {
    return formulaNumber(new Number(ctx.text));
  }

  visitString(ctx: StringContext): FormulaValue {
    return formulaString(ctx.text);
  }


  visitParentheses(ctx: ParenthesesContext): FormulaValue {
  
    let arbitaryExpression = this.visit(ctx.expr());

    if (arbitaryExpression.kind==NUMBER) {
      return formulaNumber(arbitaryExpression.value.valueOf());
    }
    else  if (arbitaryExpression.kind==STRING) {
      return formulaString(arbitaryExpression.value.valueOf());
    }

    return formulaError("Invalid use of Paranthesis");
  
   }

  visitPositiveExpression(ctx: PositiveExpressionContext): FormulaValue {
    let arbitraryExpression = this.visit(ctx._an);
  
    if (arbitraryExpression.kind == NUMBER) {
      return formulaNumber(arbitraryExpression.value.valueOf());
    }
  
    return formulaError("Invalid use of Positive Expression");
  }
  
  visitNegativeExpression(ctx: NegativeExpressionContext): FormulaValue {
    let arbitaryExpression = this.visit(ctx._an);

    if (arbitaryExpression.kind == NUMBER) {
      return formulaNumber(Math.imul(arbitaryExpression.value.valueOf(), -1));
    }
    return formulaError("Invalid use of Negation");
  }

  visitRelativeRowReference(ctx: RelativeRowReferenceContext): any {

    const indexExpr = ctx.expr();

    let rowOffset;
    if (indexExpr !== undefined && indexExpr !== null) {
        rowOffset = indexExpr.accept(this);
    }
    if (!rowOffset || rowOffset.kind !== "NUMBER") {
      return formulaError("Error in row offset: " + rowOffset);
    }
    rowOffset = rowOffset.value.valueOf();
    
    if (ctx.MINUS() !== undefined) {
        rowOffset = -rowOffset;
    }

    let inRowId = this.evaluationContext.inRowId;
    let inRowNode = this.evaluationContext.gridApi.getRowNode(inRowId);
    let inRowIndex = inRowNode?.rowIndex;
    if (inRowIndex == null || inRowIndex == undefined) {
      assert(false, "bug with inRowIndex");
      return formulaError("bug");
    }

    let rowIndex: Number = Math.trunc(rowOffset + inRowIndex);

    if (this.evaluationContext.trackingDependencies) {
        const columns = this.evaluationContext.gridApi?.getColumnDefs();
        // Add a dependency of the current formula cell to all the cells of row with rowIndex
        for (const idx in columns) {
          const colName = columns[idx]['field'];
          if (colName === AGGREGATE_COL_NAME) {
            continue;
          }
          const nodeKey: string = colName + "+" + rowIndex;
          if (!this.formulaCell.precedents?.has(nodeKey)) {
            this.formulaCell.precedents?.add(nodeKey);
          }
        }
      }
    return this.evaluationContext.getRowReference(
    rowIndex.valueOf())
  }

  visitAbsRowReference(ctx: AbsRowReferenceContext): any {
    let index = ctx.INT().text;
    let id = String(ctx.rowNodeID);
  
    if (index == null || index == undefined) {
      assert(false, "Error with inRowIndex");
      return formulaError("Error with inRowIndex");
    }

    if (id == null) {
      return formulaError(
        "Row " + index + " does not exist."
      );
    }

    let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);

    if (referencedRowNode?.id == undefined) {
      return formulaError(
        "Row " + index + " does not exist."
      );
    }

    if (this.evaluationContext.trackingDependencies) {
      const columns = this.evaluationContext.gridApi?.getColumnDefs();
      // Add a dependency of the current formula cell to all the cells of row with rowIndex
      for (const idx in columns) {
        const colName = columns[idx]['field'];
        if (colName === AGGREGATE_COL_NAME) {
          continue;
        }
        const nodeKey: string = colName + "+" + referencedRowNode.rowIndex;
        if (!this.formulaCell.precedents?.has(nodeKey)) {
          this.formulaCell.precedents?.add(nodeKey);
        }
      }
    }
    return this.evaluationContext.getRowReference(
        referencedRowNode.rowIndex!
    );
  }

  visitAbsoluteReference(ctx: AbsoluteReferenceContext): FormulaValue {    
    let ident = ctx.absRef().IDENT();
    let index = ctx.absRef().INT().text;
    let id = String(ctx.absRef().rowNodeID);
  
    if (index == null || index == undefined) {
      assert(false, "Error with inRowIndex");
      return formulaError("Error with inRowIndex");
    }

    if (id == null) {
      return formulaError(
        "Row " + index + " does not exist."
      );
    }

    let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);

    if (referencedRowNode?.id == undefined) {
      return formulaError(
        "Row " + index + " does not exist."
      );
    }

    if (!(ident.text in referencedRowNode?.data)) {
          return formulaError("Column " + ident.text + " does not exist.");
    }
    
    if (this.evaluationContext.trackingDependencies) {
      const nodeKey: string = ident.text + "+" + index;
      if (!this.formulaCell.precedents?.has(nodeKey)) {
        this.formulaCell.precedents?.add(nodeKey);
      }
    }
 
      return this.evaluationContext.getCellValue(
        ident.text,
        referencedRowNode.id,
      );  
   }

  visitReference(ctx: ReferenceContext): any {
    let ident = ctx.ref().IDENT();
    let indexExpr = ctx.ref().expr();
    if (!indexExpr) {
      // Check if the identifier is a name of named cell
      // Iterate over all the nodes of the table
      let foundNamedCell = false;
      let colName: string | null = null;
      let rowNodeId: string | undefined | null = null;
      let cell = null;
      const allRowNodes = getAllRowNodes(this.evaluationContext.gridApi);
      allRowNodes.forEach(rowNode => {
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
      })
      if (foundNamedCell && colName && rowNodeId) {
        const nameId = NAMED_CELL_PREFIX + ident.text;
        if (!this.formulaCell.precedents?.has(nameId)) {
          this.formulaCell.precedents?.add(nameId);
        }
        return this.evaluationContext.getCellValue(colName, rowNodeId);
      }
    }

    // If the formula reference has no index (referencing whole column) and the reference is inside a function,
    // add a dependency between current formula cell and each row of the referenced column
    if (!indexExpr && this.insideFunction && !this.insideQuery) {
      // Get the cell Column which has the reference.
      let focuscedColumn = this.evaluationContext.gridApi
        ?.getFocusedCell()
        ?.column.getColId();
      if (this.evaluationContext.trackingDependencies) {
        const rowCount = this.evaluationContext.gridApi?.getDisplayedRowCount();
        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
          const nodeKey: string = ident.text + "+" + rowIdx;
          if (!this.formulaCell.precedents?.has(nodeKey)) {
            this.formulaCell.precedents?.add(nodeKey);
          }
        }
      }
      return this.evaluationContext.getColumnValueReference(
        ident.text,
        focuscedColumn
      );
    }

   

    
    let index: any = { kind: "NUMBER", value: new Number(0) };
    if (indexExpr != undefined) {
      index = indexExpr.accept(this);
    }

    if (indexExpr === undefined && this.insideFunction && this.insideQuery) { 
        let vector: any[] = [];
        let temp: any;
        
        this.evaluationContext.gridApi.forEachNode((node) => {
            temp = this.evaluationContext.gridApi.getValue(ident.text, node);
            if (temp != null) {
                vector.push(temp);
            }
        });
        
        // Now you can instantiate your queryValue with the referenced_column set to the column's identifier
        // and the vector set to the array of column values.
         
        return queryValue("", vector);
    }

    switch (index.kind) {
      case ERROR:
        return formulaError("Error in offset: " + index.value);
      
      case QUERY:
        let vector = index.vector
        let identValues: any[] = [];
        // Fetch all the values from the ident column.
        this.evaluationContext.gridApi.forEachNode((node) => {
          const value = this.evaluationContext.gridApi.getValue(ident.text, node);
          identValues.push(value);
        });
        // Filter out values based on the vector's boolean values.
        let result: any[] = [];
        for (let i = 0; i < vector.length; i++) {
          if (vector[i] === true) {
            result.push(identValues[i]);
          }
        }
        this.insideQuery=false
        return queryValue(ident.text, result);
      
      case NUMBER:
        let offset = index.value;
        let inRowId = this.evaluationContext.inRowId;
        let inRowNode = this.evaluationContext.gridApi.getRowNode(inRowId);
        let inRowIndex = inRowNode?.rowIndex;
        if (inRowIndex == null || inRowIndex == undefined) {
          assert(false, "bug with inRowIndex");
          return formulaError("bug");
        }

        let referencedRowIndex: Number = Math.trunc(offset + inRowIndex);
        if  (indexExpr && ctx.ref().PLUS()) { 
          referencedRowIndex = Math.trunc(offset + inRowIndex);
        }
        else if (indexExpr && ctx.ref().MINUS()) {
          referencedRowIndex = Math.trunc(inRowIndex-offset);
        } 
        
        // referencedRowIndex = Math.trunc(offset); 

        let referencedRowNode =
          this.evaluationContext.gridApi.getDisplayedRowAtIndex(
            referencedRowIndex.valueOf()
          );
        if (referencedRowNode?.id == null) {
            return formulaError(
              "Row " + referencedRowIndex + " does not exist."
            );
        }
        // If the column does not exist in the row data, throw an error
        if (!(ident.text in referencedRowNode.data)) {
          return formulaError("Column " + ident.text + " does not exist.");
        }
        if (this.evaluationContext.trackingDependencies) {
          let nodeKey: string = ident.text + "+" + referencedRowIndex;
          if (referencedRowNode.isRowPinned()) {
            nodeKey = ident.text + "+" + referencedRowNode.id; 
          }
          if (!this.formulaCell.precedents?.has(nodeKey)) {
            this.formulaCell.precedents?.add(nodeKey);
          }
        }
        return this.evaluationContext.getCellValue(
          ident.text,
          referencedRowNode.id
        );
      case STRING:

        return formulaError("Offsets must be numbers.");
      case EMPTY:
        return formulaError("Missing offset.");
    }
    // Get the cell Column which has the reference.
    let focuscedColumn = this.evaluationContext.gridApi
      ?.getFocusedCell()
      ?.column.getColId();
    
    return this.evaluationContext.getColumnValueReference(
      ident.text,
      focuscedColumn
    );
  }

  visitEnvironmentalVariable(ctx: EnvironmentalVariableContext): FormulaValue {
    let ident = ctx.envVar().IDENT();
    return formulaNumber(new Number(this.evaluationContext.envVar[0][ident.text])); 
  }
}

export class Formula {
  str: string;
  gridApi: GridApi | null;
  tree: ProgContext | undefined = undefined;


  constructor(str: string, gridApi: GridApi | null) {
   
    this.str = str;
    this.gridApi = gridApi;
    // tree construction
    let inputStream = CharStreams.fromString(this.str);
    let lexer = new FormulaLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new FormulaParser(tokenStream);
    if (this.gridApi != null) {
      parser.gridApi = this.gridApi;
    }
    parser.errorHandler = new BailErrorStrategy();

    try {
      this.tree = parser.prog();
    } catch (e) {
      this.tree = undefined;
    }

  }
 
  createTree() { 
    // tree construction
    let inputStream = CharStreams.fromString(this.str);
    let lexer = new FormulaLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new FormulaParser(tokenStream);
    parser.errorHandler = new BailErrorStrategy();
    if (this.gridApi != null) {
      parser.gridApi = this.gridApi;
    }

    try {
      this.tree = parser.prog();
    } catch (e) {
      this.tree = undefined;
    }


  }
  getFormula(ctx: FormulaStringContext) { 

    if (this.tree != undefined) {
      try {
        let generatedFormulaString = this.tree.accept(new FormulaStringVisitor(ctx));
        this.str = String( generatedFormulaString.value);
        return  generatedFormulaString.value;
      } catch (e) {
        return formulaError("Error in getting Formula: " + e);
      }
    }

  }

  value(ctx: EvaluationContext, formulaCell: FormulaCell): FormulaValue {
  
      if (this.tree != undefined) {
        try {
          return  this.tree.accept(new FormulaEvaluationVisitor(ctx, formulaCell));
        } catch (e) {
          return formulaError("Evaluation error: " + e);
        }
      }
      // Otherwise the compiler objects.
      return formulaError("Unreachable");
  }
}
