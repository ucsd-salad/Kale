"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = exports.EvaluationContext = exports.queryValue = exports.rowReferenceValue = exports.referenceValue = exports.emptyCell = exports.formulaString = exports.formulaBoolean = exports.formulaNumber = exports.formulaError = exports.BOOLEAN_STRING_MAPPING = exports.FALSE = exports.TRUE = exports.QUERY = exports.ROW_REFERENCE = exports.REFERENCE = exports.EMPTY = exports.ERROR = exports.STRING = exports.BOOLEAN = exports.NUMBER = void 0;
const antlr4ts_1 = require("antlr4ts");
const FormulaLexer_1 = require("./FormulaLexer");
const FormulaParser_1 = require("./FormulaParser");
const antlr4ts_2 = require("antlr4ts");
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
const assert_1 = require("assert");
const grid_1 = require("./grid");
const gridUtils_1 = require("./gridUtils");
const formulaStringVisitor_1 = require("./formulaStringVisitor");
const ifFunction_1 = require("./functionsImpl/ifFunction");
const functionNames_1 = require("./functionNames");
exports.NUMBER = "NUMBER";
exports.BOOLEAN = "BOOLEAN";
exports.STRING = "STRING";
exports.ERROR = "ERROR";
exports.EMPTY = "EMPTY";
exports.REFERENCE = "REFERENCE";
exports.ROW_REFERENCE = "ROW_REFERENCE";
exports.QUERY = "QUERY";
exports.TRUE = "TRUE";
exports.FALSE = "FALSE";
exports.BOOLEAN_STRING_MAPPING = new Map([
    [true, exports.TRUE],
    [false, exports.FALSE]
]);
let formulaError = (msg) => {
    return {
        kind: exports.ERROR,
        value: msg,
    };
};
exports.formulaError = formulaError;
let formulaNumber = (x) => {
    return {
        kind: exports.NUMBER,
        value: x,
    };
};
exports.formulaNumber = formulaNumber;
let formulaBoolean = (b) => {
    return {
        kind: exports.BOOLEAN,
        value: b,
    };
};
exports.formulaBoolean = formulaBoolean;
let formulaString = (s) => {
    return {
        kind: exports.STRING,
        value: s,
    };
};
exports.formulaString = formulaString;
exports.emptyCell = {
    kind: exports.EMPTY,
    value: ''
};
let referenceValue = (r) => {
    return {
        kind: exports.REFERENCE,
        value: r,
    };
};
exports.referenceValue = referenceValue;
let rowReferenceValue = (r) => {
    return {
        kind: exports.ROW_REFERENCE,
        value: r,
    };
};
exports.rowReferenceValue = rowReferenceValue;
// export let queryValue = (r: , value_left: any = null): QueryValue => {
//   return {
//     kind: QUERY,
//     value: r,
//     value_left: value_left,
//   };
// };
let queryValue = (referenced_column, vector) => {
    return {
        kind: "QUERY",
        referenced_column: referenced_column,
        vector: vector
    };
};
exports.queryValue = queryValue;
function isQueryValue(obj) {
    return obj && obj.kind === "QUERY" && "vector" in obj;
}
function asQueryValue(value) {
    if (value && value.kind === "QUERY") {
        return value;
    }
    return null;
}
// | QueryValue;
class EvaluationContext {
    constructor(gridApi, columnApi, inRowId, envVar, trackingDependencies) {
        this.gridApi = gridApi;
        this.columnApi = columnApi;
        this.inRowId = inRowId;
        this.envVar = envVar;
        this.trackingDependencies = trackingDependencies;
    }
    getCellValue(colName, rowId) {
        let rowData = this.gridApi.getRowNode(rowId);
        if (rowData == null) {
            return exports.emptyCell;
        }
        let cellValue = rowData.data[colName];
        if (cellValue && cellValue.formulaCell) {
            return cellValue.formulaCell.value;
        }
        else if (cellValue && typeof cellValue.value === "string") {
            return (0, exports.formulaString)(cellValue.value);
        }
        else if (cellValue && typeof cellValue.value === "number") {
            return (0, exports.formulaNumber)(new Number(cellValue.value));
        }
        else if (cellValue && typeof cellValue.value === "boolean") {
            return (0, exports.formulaBoolean)(new Boolean(cellValue.value));
        }
        else {
            return exports.emptyCell;
        }
    }
    getColumnValueReference(colName, focuscedColumn) {
        // if (focuscedColumn === colName) {
        //   return formulaError("Cannot reference itself");
        // }
        if (this.columnApi.getColumn(colName)) {
            return (0, exports.referenceValue)(colName);
        }
        else {
            return (0, exports.formulaError)("Column " + colName + " not found");
        }
    }
    getRowReference(rowIndex) {
        // Check the row index bounds
        const totalRows = this.gridApi.getDisplayedRowCount();
        if (rowIndex >= 0 && rowIndex < totalRows) {
            return (0, exports.rowReferenceValue)(rowIndex);
        }
        else {
            return (0, exports.formulaError)("Row " + rowIndex + "does not exist");
        }
    }
    // get value of cell with a numerical value
    getValueOfColumnCell(nodeData) {
        if (!nodeData) {
            return 0;
        }
        if (nodeData.formulaCell && nodeData.formulaCell.value.kind === exports.NUMBER) {
            const formulaCalculatedValue = nodeData.formulaCell.value.value;
            return formulaCalculatedValue;
        }
        if (typeof nodeData.value === "number") {
            return nodeData.value;
        }
    }
    applyFnOnColumnValues(colName, result, callableFunc) {
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
    applyFnOnRowValues(rowIndex, result, callableFunc) {
        // Get row node using the row index
        const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
        const rowData = rowNode === null || rowNode === void 0 ? void 0 : rowNode.data;
        // Iterate through all the cells of the row and apply the callableFunc
        for (const col in rowData) {
            if (col === grid_1.AGGREGATE_COL_NAME) {
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
exports.EvaluationContext = EvaluationContext;
class FormulaEvaluationVisitor extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    defaultResult() {
        return (0, exports.formulaError)("Default result should not be used.");
    }
    constructor(ctx, formulaCell) {
        super();
        this.evaluationContext = ctx;
        this.formulaCell = formulaCell;
        this.insideFunction = false;
        this.insideQuery = false;
    }
    visitTrue(ctx) {
        return (0, exports.formulaString)(exports.TRUE);
    }
    visitFalse(ctx) {
        return (0, exports.formulaString)(exports.FALSE);
    }
    visitFunction(ctx) {
        var _a, _b, _c;
        this.insideFunction = true;
        let args = null;
        args = (_a = ctx.arguments()) === null || _a === void 0 ? void 0 : _a.absRowReference();
        if (!args || args.length === 0) {
            args = (_b = ctx.arguments()) === null || _b === void 0 ? void 0 : _b.relativeRowReference();
        }
        if (!args || args.length === 0) {
            args = (_c = ctx.arguments()) === null || _c === void 0 ? void 0 : _c.expr();
        }
        let functionName = ctx.IDENT().text.toUpperCase();
        let argList = [];
        if (functionName === functionNames_1.IF) {
            if (!args || !(0, ifFunction_1.areArgsValid)(args)) {
                return (0, exports.formulaError)((0, ifFunction_1.invalidArgsMessage)(args === null || args === void 0 ? void 0 : args.length));
            }
            const logicalExpr = args[0].accept(this);
            if (logicalExpr.kind === exports.ERROR) {
                return (0, exports.formulaError)(`Error evaluating the first argument`);
            }
            // Typecast logical expression value to boolean
            let logicalExprEvalVal = false;
            if (logicalExpr.kind === exports.STRING) {
                logicalExprEvalVal = Boolean(JSON.parse(logicalExpr.value.valueOf().toLowerCase())).valueOf();
            }
            else {
                logicalExprEvalVal = Boolean(JSON.parse(logicalExpr.value.valueOf())).valueOf();
            }
            if (logicalExprEvalVal) {
                // Return then value
                const thenValue = args[1].accept(this);
                if (thenValue.kind === exports.ERROR) {
                    return (0, exports.formulaError)(`Error evaluating the second argument`);
                }
                return (0, exports.formulaNumber)(thenValue.value);
            }
            else {
                // Return else value
                if (args.length === 2) {
                    return (0, exports.formulaString)(exports.FALSE);
                }
                else {
                    const elseValue = args[2].accept(this);
                    if (elseValue.kind === exports.ERROR) {
                        return (0, exports.formulaError)(`Error evaluating the third argument`);
                    }
                    return (0, exports.formulaNumber)(elseValue.value);
                }
            }
        }
        for (let arg of args) {
            let argValue = arg.accept(this);
            if (argValue.kind === exports.ERROR) {
                return (0, exports.formulaError)(argValue.value);
            }
            else if (argValue.kind === exports.QUERY && argValue.referenced_column == '') {
                return (0, exports.formulaError)("Invalid Query Form");
            }
            else {
                argList.push(argValue);
            }
        }
        if (functionName === functionNames_1.ABS) {
            if (argList.length !== 1)
                return (0, exports.formulaError)("ABS function takes exactly one argument");
            else if (argList[0].kind === exports.ROW_REFERENCE || argList[0].kind === exports.REFERENCE || argList[0].kind === exports.QUERY) {
                return (0, exports.formulaError)("ABS function takes exactly one integer argument");
            }
            else {
                return (0, exports.formulaNumber)(Math.abs(argList[0].value));
            }
        }
        if (functionName === functionNames_1.MAX) {
            let maxValue = new Number(-Infinity);
            var maxValueFunc = (a, b) => {
                return Math.max(a.valueOf(), b.valueOf());
            };
            for (let arg of argList) {
                if (arg.kind === exports.ERROR) {
                    return (0, exports.formulaError)(arg.value);
                }
                let value;
                if (arg.kind === exports.REFERENCE) {
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, maxValue, maxValueFunc);
                }
                else if (arg.kind === exports.ROW_REFERENCE) {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, maxValue, maxValueFunc);
                }
                else if (arg.kind === exports.NUMBER) {
                    value = arg.value;
                }
                else if (arg.kind === exports.QUERY) {
                    for (const num of arg.vector) {
                        maxValue = maxValueFunc(maxValue, num);
                    }
                }
                if (value && maxValue <= value) {
                    maxValue = value;
                }
                if (value && value.kind && value.kind === exports.ERROR) {
                    return value;
                }
            }
            return (0, exports.formulaNumber)(maxValue);
        }
        if (functionName === functionNames_1.MIN) {
            let minValue = new Number(Infinity);
            var minValueFunc = (a, b) => {
                return Math.min(a.valueOf(), b.valueOf());
            };
            let value;
            for (let arg of argList) {
                if (arg.kind === exports.ERROR) {
                    return (0, exports.formulaError)(arg.value);
                }
                if (arg.kind === exports.REFERENCE) {
                    // If the reference is to a column, we need to find the minimum value in the column
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, minValue, minValueFunc);
                }
                else if (arg.kind === exports.ROW_REFERENCE) {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, minValue, minValueFunc);
                }
                else if (arg.kind === exports.NUMBER) {
                    value = arg.value;
                }
                else if (arg.kind === exports.QUERY) {
                    for (const num of arg.vector) {
                        minValue = minValueFunc(minValue, num);
                    }
                }
                if (value && minValue >= value) {
                    minValue = value;
                }
                if (value && value.kind && value.kind === exports.ERROR) {
                    return value;
                }
            }
            return (0, exports.formulaNumber)(minValue);
        }
        if (functionName === functionNames_1.SUM) {
            let sumValue = new Number(0);
            var sumValueFunc = (a, b) => {
                return a.valueOf() + b.valueOf();
            };
            for (let arg of argList) {
                if (arg.kind === exports.ERROR) {
                    return (0, exports.formulaError)(arg.value);
                }
                let value;
                if (arg.kind === exports.QUERY) {
                    value = arg.vector.reduce((acc, cur) => sumValueFunc(acc, cur), 0);
                }
                if (arg.kind === exports.REFERENCE) {
                    // If the reference is to a column, we need to find the sum value in the column
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, 0, sumValueFunc);
                }
                else if (arg.kind === exports.ROW_REFERENCE) {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, 0, sumValueFunc);
                }
                else if (arg.kind === exports.NUMBER) {
                    value = arg.value;
                }
                if (value) {
                    sumValue += value;
                }
                if (value && value.kind && value.kind === exports.ERROR) {
                    return value;
                }
            }
            return (0, exports.formulaNumber)(sumValue);
        }
        if (functionName === functionNames_1.COUNT) {
            let countValue = new Number(0);
            for (let arg of argList) {
                if (arg.kind === exports.ERROR) {
                    return (0, exports.formulaError)(arg.value);
                }
                let value;
                if (arg.kind === exports.REFERENCE) {
                    // If the reference is to a column, we need to find the count value in the column
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, 0, ifFunction_1.incrementFunc);
                }
                else if (arg.kind === exports.ROW_REFERENCE) {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, 0, ifFunction_1.incrementFunc);
                }
                else if (arg.kind === exports.NUMBER) {
                    value = countValue.valueOf() + 1;
                }
                else if (arg.kind === exports.QUERY) {
                    // Count the number of elements in the vector
                    value = arg.vector.length;
                }
                if (value) {
                    countValue += value;
                }
                if (value && value.kind && value.kind === exports.ERROR) {
                    return value;
                }
            }
            this.insideFunction = false;
            return (0, exports.formulaNumber)(countValue);
        }
        if (functionName === functionNames_1.MEDIAN) {
            let columnValues = [];
            let value;
            for (let arg of argList) {
                if (arg.kind === exports.ERROR) {
                    return (0, exports.formulaError)(arg.value);
                }
                if (arg.kind === exports.REFERENCE) {
                    // If the reference is to a column, we need to collect all values in the column
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, columnValues, ifFunction_1.collectValuesFunc);
                }
                else if (arg.kind === exports.ROW_REFERENCE) {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, columnValues, ifFunction_1.collectValuesFunc);
                }
                else if (arg.kind === exports.NUMBER) {
                    columnValues.push(arg.value);
                }
                else if (arg.kind === exports.QUERY) {
                    // Add all values from arg.vector to columnValues
                    columnValues.push(...arg.vector);
                }
                if (value && value.kind && value.kind === exports.ERROR) {
                    return value;
                }
            }
            const n = columnValues.length;
            if (n === 0) {
                return (0, exports.formulaError)("No values to calculate median");
            }
            // Now calculate the median from columnValues
            columnValues.sort((a, b) => a - b);
            let medianValue;
            if (n % 2 === 1) {
                medianValue = columnValues[Math.floor(n / 2)];
            }
            else {
                const middle1 = columnValues[Math.floor((n / 2) - 1)];
                const middle2 = columnValues[Math.floor(n / 2)];
                medianValue = (middle1 + middle2) / 2;
            }
            return (0, exports.formulaNumber)(medianValue);
        }
        if (functionName === functionNames_1.AVERAGE) {
            let sumValue = new Number(0);
            let countValue = new Number(0);
            for (let arg of argList) {
                if (arg.kind === "ERROR") {
                    return (0, exports.formulaError)(arg.value);
                }
                let value;
                if (arg.kind === "REFERENCE") {
                    value = this.evaluationContext.applyFnOnColumnValues(arg.value, 0, ifFunction_1.sumFunc);
                    let columnCount = this.evaluationContext.applyFnOnColumnValues(arg.value, 0, ifFunction_1.incrementFunc);
                    countValue = new Number(countValue.valueOf() + columnCount.valueOf());
                }
                else if (arg.kind === "ROW_REFERENCE") {
                    value = this.evaluationContext.applyFnOnRowValues(arg.value, 0, ifFunction_1.sumFunc);
                    let rowCount = this.evaluationContext.applyFnOnRowValues(arg.value, 0, ifFunction_1.incrementFunc);
                    countValue = new Number(countValue.valueOf() + rowCount.valueOf());
                }
                else if (arg.kind === "NUMBER") {
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
                return (0, exports.formulaError)("No values to calculate average");
            }
            return (0, exports.formulaNumber)(sumValue.valueOf() / countValue.valueOf());
        }
        if (functionName === functionNames_1.LARGE) {
            if (argList.length !== 2) {
                return (0, exports.formulaError)("LARGE expects exactly 2 arguments.");
            }
            const rangeArg = argList[0];
            const nArg = argList[1];
            if (rangeArg.kind === exports.ERROR || nArg.kind === exports.ERROR) {
                return (0, exports.formulaError)(rangeArg.value || nArg.value);
            }
            let n;
            if (nArg.kind === exports.NUMBER) {
                n = nArg.value;
                if (!Number.isInteger(n.valueOf())) {
                    console.log("the value of n is", n);
                    return (0, exports.formulaError)("Second argument must be an integer");
                }
            }
            else {
                return (0, exports.formulaError)("Second argument must be a number");
            }
            let rangeValues = [];
            let value;
            if (rangeArg.kind === exports.REFERENCE) {
                // If the reference is to a column, we need to collect all values in the column
                value = this.evaluationContext.applyFnOnColumnValues(rangeArg.value, rangeValues, ifFunction_1.collectValuesFunc);
            }
            else if (rangeArg.kind === exports.QUERY) {
                // Add all values from rangeArg.vector to rangeValues
                rangeValues.push(...rangeArg.vector);
            }
            else {
                return (0, exports.formulaError)("First argument must be a range");
            }
            if (value && value.kind && value.kind === exports.ERROR) {
                return value;
            }
            if (rangeValues.length === 0) {
                return (0, exports.formulaError)("Range cannot be empty");
            }
            if (n <= 0 || n > rangeValues.length) {
                return (0, exports.formulaError)("Invalid n");
            }
            rangeValues.sort((a, b) => b - a); // sort descending
            return (0, exports.formulaNumber)(rangeValues[n - 1]);
        }
        if (functionName === functionNames_1.ROUND) {
            if (argList.length !== 2) {
                return (0, exports.formulaError)("ROUND takes exactly two arguments");
            }
            let value = argList[0];
            let decimalPlaces = argList[1];
            if (value.kind === exports.ERROR || decimalPlaces.kind === exports.ERROR) {
                return (0, exports.formulaError)(value.value || decimalPlaces.value);
            }
            if (value.kind === exports.NUMBER && decimalPlaces.kind === exports.NUMBER) {
                return (0, exports.formulaNumber)(Number(value.value.toFixed(decimalPlaces.value)));
            }
            else {
                return (0, exports.formulaError)("Invalid arguments for ROUND function");
            }
        }
        else {
            return (0, exports.formulaError)("Formula not supported");
        }
    }
    visitMultiplicationOrDivision(ctx) {
        let left = ctx._left.accept(this);
        //this.visit(ctx._left);
        let right = this.visit(ctx._right);
        if (left.kind != exports.NUMBER) {
            return (0, exports.formulaError)("Left argument must be numeric");
        }
        if (right.kind != exports.NUMBER) {
            return (0, exports.formulaError)("Right argument must be numeric");
        }
        if (ctx.MUL() != undefined) {
            return (0, exports.formulaNumber)(left.value.valueOf() * right.value.valueOf());
        }
        else {
            return (0, exports.formulaNumber)(left.value.valueOf() / right.value.valueOf());
        }
    }
    visitAdditionOrSubtraction(ctx) {
        let left = this.visit(ctx._left);
        let right = this.visit(ctx._right);
        if (left.kind != exports.NUMBER) {
            return (0, exports.formulaError)("Left argument must be numeric");
        }
        if (right.kind != exports.NUMBER) {
            return (0, exports.formulaError)("Right argument must be numeric");
        }
        if (ctx.PLUS() != undefined) {
            return (0, exports.formulaNumber)(left.value.valueOf() + right.value.valueOf());
        }
        else {
            return (0, exports.formulaNumber)(left.value.valueOf() - right.value.valueOf());
        }
    }
    visitComparison(ctx) {
        this.insideQuery = true;
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        if (isQueryValue(left) || isQueryValue(right)) {
            // let vectorValue: QueryValue | null = asQueryValue(left) ? left : (asQueryValue(right) ? right : null);
            let vectorValue = asQueryValue(left) || asQueryValue(right);
            let scalarValue = isQueryValue(left) ? right : left;
            if (vectorValue && vectorValue.vector.some(val => val instanceof Array)) {
                return (0, exports.formulaError)("Can't compare two vector values");
            }
            const comparisonResults = [];
            // vectorValue!.vector.forEach(val => {
            vectorValue.vector.forEach(val => {
                let comparison = false;
                const scalar = scalarValue.value.valueOf();
                if (ctx.EQ() !== undefined) {
                    comparison = val == scalar;
                }
                else if (ctx.GT() !== undefined) {
                    comparison = val > scalar;
                }
                else if (ctx.GTE() !== undefined) {
                    comparison = val >= scalar;
                }
                else if (ctx.LT() !== undefined) {
                    comparison = val < scalar;
                }
                else if (ctx.LTE() !== undefined) {
                    comparison = val <= scalar;
                }
                else {
                    comparison = val != scalar;
                }
                comparisonResults.push(comparison);
            });
            if (vectorValue) {
                vectorValue.vector = comparisonResults;
            }
            return vectorValue;
        }
        else {
            const leftValue = left.value.valueOf();
            const rightValue = right.value.valueOf();
            let comparisonValue = false;
            if (ctx.EQ() !== undefined) {
                comparisonValue = leftValue == rightValue;
            }
            else if (ctx.GT() !== undefined) {
                comparisonValue = leftValue > rightValue;
            }
            else if (ctx.GTE() !== undefined) {
                comparisonValue = leftValue >= rightValue;
            }
            else if (ctx.LT() !== undefined) {
                comparisonValue = leftValue < rightValue;
            }
            else if (ctx.LTE() !== undefined) {
                comparisonValue = leftValue <= rightValue;
            }
            else {
                comparisonValue = leftValue != rightValue;
            }
            const comparisonValueStr = exports.BOOLEAN_STRING_MAPPING.get(comparisonValue);
            if (comparisonValueStr) {
                return (0, exports.formulaString)(comparisonValueStr);
            }
            return (0, exports.formulaError)("Comparison evaluation is not boolean");
        }
    }
    visitNumber(ctx) {
        return (0, exports.formulaNumber)(new Number(ctx.text));
    }
    visitString(ctx) {
        return (0, exports.formulaString)(ctx.text);
    }
    visitParentheses(ctx) {
        let arbitaryExpression = this.visit(ctx.expr());
        if (arbitaryExpression.kind == exports.NUMBER) {
            return (0, exports.formulaNumber)(arbitaryExpression.value.valueOf());
        }
        else if (arbitaryExpression.kind == exports.STRING) {
            return (0, exports.formulaString)(arbitaryExpression.value.valueOf());
        }
        return (0, exports.formulaError)("Invalid use of Paranthesis");
    }
    visitPositiveExpression(ctx) {
        let arbitraryExpression = this.visit(ctx._an);
        if (arbitraryExpression.kind == exports.NUMBER) {
            return (0, exports.formulaNumber)(arbitraryExpression.value.valueOf());
        }
        return (0, exports.formulaError)("Invalid use of Positive Expression");
    }
    visitNegativeExpression(ctx) {
        let arbitaryExpression = this.visit(ctx._an);
        if (arbitaryExpression.kind == exports.NUMBER) {
            return (0, exports.formulaNumber)(Math.imul(arbitaryExpression.value.valueOf(), -1));
        }
        return (0, exports.formulaError)("Invalid use of Negation");
    }
    visitRelativeRowReference(ctx) {
        var _a, _b, _c;
        const indexExpr = ctx.expr();
        let rowOffset;
        if (indexExpr !== undefined && indexExpr !== null) {
            rowOffset = indexExpr.accept(this);
        }
        if (!rowOffset || rowOffset.kind !== "NUMBER") {
            return (0, exports.formulaError)("Error in row offset: " + rowOffset);
        }
        rowOffset = rowOffset.value.valueOf();
        if (ctx.MINUS() !== undefined) {
            rowOffset = -rowOffset;
        }
        let inRowId = this.evaluationContext.inRowId;
        let inRowNode = this.evaluationContext.gridApi.getRowNode(inRowId);
        let inRowIndex = inRowNode === null || inRowNode === void 0 ? void 0 : inRowNode.rowIndex;
        if (inRowIndex == null || inRowIndex == undefined) {
            (0, assert_1.strict)(false, "bug with inRowIndex");
            return (0, exports.formulaError)("bug");
        }
        let rowIndex = Math.trunc(rowOffset + inRowIndex);
        if (this.evaluationContext.trackingDependencies) {
            const columns = (_a = this.evaluationContext.gridApi) === null || _a === void 0 ? void 0 : _a.getColumnDefs();
            // Add a dependency of the current formula cell to all the cells of row with rowIndex
            for (const idx in columns) {
                const colName = columns[idx]['field'];
                if (colName === grid_1.AGGREGATE_COL_NAME) {
                    continue;
                }
                const nodeKey = colName + "+" + rowIndex;
                if (!((_b = this.formulaCell.precedents) === null || _b === void 0 ? void 0 : _b.has(nodeKey))) {
                    (_c = this.formulaCell.precedents) === null || _c === void 0 ? void 0 : _c.add(nodeKey);
                }
            }
        }
        return this.evaluationContext.getRowReference(rowIndex.valueOf());
    }
    visitAbsRowReference(ctx) {
        var _a, _b, _c;
        let index = ctx.INT().text;
        let id = String(ctx.rowNodeID);
        if (index == null || index == undefined) {
            (0, assert_1.strict)(false, "Error with inRowIndex");
            return (0, exports.formulaError)("Error with inRowIndex");
        }
        if (id == null) {
            return (0, exports.formulaError)("Row " + index + " does not exist.");
        }
        let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);
        if ((referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.id) == undefined) {
            return (0, exports.formulaError)("Row " + index + " does not exist.");
        }
        if (this.evaluationContext.trackingDependencies) {
            const columns = (_a = this.evaluationContext.gridApi) === null || _a === void 0 ? void 0 : _a.getColumnDefs();
            // Add a dependency of the current formula cell to all the cells of row with rowIndex
            for (const idx in columns) {
                const colName = columns[idx]['field'];
                if (colName === grid_1.AGGREGATE_COL_NAME) {
                    continue;
                }
                const nodeKey = colName + "+" + referencedRowNode.rowIndex;
                if (!((_b = this.formulaCell.precedents) === null || _b === void 0 ? void 0 : _b.has(nodeKey))) {
                    (_c = this.formulaCell.precedents) === null || _c === void 0 ? void 0 : _c.add(nodeKey);
                }
            }
        }
        return this.evaluationContext.getRowReference(referencedRowNode.rowIndex);
    }
    visitAbsoluteReference(ctx) {
        var _a, _b;
        let ident = ctx.absRef().IDENT();
        let index = ctx.absRef().INT().text;
        let id = String(ctx.absRef().rowNodeID);
        if (index == null || index == undefined) {
            (0, assert_1.strict)(false, "Error with inRowIndex");
            return (0, exports.formulaError)("Error with inRowIndex");
        }
        if (id == null) {
            return (0, exports.formulaError)("Row " + index + " does not exist.");
        }
        let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);
        if ((referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.id) == undefined) {
            return (0, exports.formulaError)("Row " + index + " does not exist.");
        }
        if (!(ident.text in (referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.data))) {
            return (0, exports.formulaError)("Column " + ident.text + " does not exist.");
        }
        if (this.evaluationContext.trackingDependencies) {
            const nodeKey = ident.text + "+" + index;
            if (!((_a = this.formulaCell.precedents) === null || _a === void 0 ? void 0 : _a.has(nodeKey))) {
                (_b = this.formulaCell.precedents) === null || _b === void 0 ? void 0 : _b.add(nodeKey);
            }
        }
        return this.evaluationContext.getCellValue(ident.text, referencedRowNode.id);
    }
    visitReference(ctx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let ident = ctx.ref().IDENT();
        let indexExpr = ctx.ref().expr();
        if (!indexExpr) {
            // Check if the identifier is a name of named cell
            // Iterate over all the nodes of the table
            let foundNamedCell = false;
            let colName = null;
            let rowNodeId = null;
            let cell = null;
            const allRowNodes = (0, gridUtils_1.getAllRowNodes)(this.evaluationContext.gridApi);
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
            });
            if (foundNamedCell && colName && rowNodeId) {
                const nameId = grid_1.NAMED_CELL_PREFIX + ident.text;
                if (!((_a = this.formulaCell.precedents) === null || _a === void 0 ? void 0 : _a.has(nameId))) {
                    (_b = this.formulaCell.precedents) === null || _b === void 0 ? void 0 : _b.add(nameId);
                }
                return this.evaluationContext.getCellValue(colName, rowNodeId);
            }
        }
        // If the formula reference has no index (referencing whole column) and the reference is inside a function,
        // add a dependency between current formula cell and each row of the referenced column
        if (!indexExpr && this.insideFunction && !this.insideQuery) {
            // Get the cell Column which has the reference.
            let focuscedColumn = (_d = (_c = this.evaluationContext.gridApi) === null || _c === void 0 ? void 0 : _c.getFocusedCell()) === null || _d === void 0 ? void 0 : _d.column.getColId();
            if (this.evaluationContext.trackingDependencies) {
                const rowCount = (_e = this.evaluationContext.gridApi) === null || _e === void 0 ? void 0 : _e.getDisplayedRowCount();
                for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                    const nodeKey = ident.text + "+" + rowIdx;
                    if (!((_f = this.formulaCell.precedents) === null || _f === void 0 ? void 0 : _f.has(nodeKey))) {
                        (_g = this.formulaCell.precedents) === null || _g === void 0 ? void 0 : _g.add(nodeKey);
                    }
                }
            }
            return this.evaluationContext.getColumnValueReference(ident.text, focuscedColumn);
        }
        let index = { kind: "NUMBER", value: new Number(0) };
        if (indexExpr != undefined) {
            index = indexExpr.accept(this);
        }
        if (indexExpr === undefined && this.insideFunction && this.insideQuery) {
            let vector = [];
            let temp;
            this.evaluationContext.gridApi.forEachNode((node) => {
                temp = this.evaluationContext.gridApi.getValue(ident.text, node);
                if (temp != null) {
                    vector.push(temp);
                }
            });
            // Now you can instantiate your queryValue with the referenced_column set to the column's identifier
            // and the vector set to the array of column values.
            return (0, exports.queryValue)("", vector);
        }
        switch (index.kind) {
            case exports.ERROR:
                return (0, exports.formulaError)("Error in offset: " + index.value);
            case exports.QUERY:
                let vector = index.vector;
                let identValues = [];
                // Fetch all the values from the ident column.
                this.evaluationContext.gridApi.forEachNode((node) => {
                    const value = this.evaluationContext.gridApi.getValue(ident.text, node);
                    identValues.push(value);
                });
                // Filter out values based on the vector's boolean values.
                let result = [];
                for (let i = 0; i < vector.length; i++) {
                    if (vector[i] === true) {
                        result.push(identValues[i]);
                    }
                }
                this.insideQuery = false;
                return (0, exports.queryValue)(ident.text, result);
            case exports.NUMBER:
                let offset = index.value;
                let inRowId = this.evaluationContext.inRowId;
                let inRowNode = this.evaluationContext.gridApi.getRowNode(inRowId);
                let inRowIndex = inRowNode === null || inRowNode === void 0 ? void 0 : inRowNode.rowIndex;
                if (inRowIndex == null || inRowIndex == undefined) {
                    (0, assert_1.strict)(false, "bug with inRowIndex");
                    return (0, exports.formulaError)("bug");
                }
                let referencedRowIndex = Math.trunc(offset + inRowIndex);
                if (indexExpr && ctx.ref().PLUS()) {
                    referencedRowIndex = Math.trunc(offset + inRowIndex);
                }
                else if (indexExpr && ctx.ref().MINUS()) {
                    referencedRowIndex = Math.trunc(inRowIndex - offset);
                }
                // referencedRowIndex = Math.trunc(offset); 
                let referencedRowNode = this.evaluationContext.gridApi.getDisplayedRowAtIndex(referencedRowIndex.valueOf());
                if ((referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.id) == null) {
                    return (0, exports.formulaError)("Row " + referencedRowIndex + " does not exist.");
                }
                // If the column does not exist in the row data, throw an error
                if (!(ident.text in referencedRowNode.data)) {
                    return (0, exports.formulaError)("Column " + ident.text + " does not exist.");
                }
                if (this.evaluationContext.trackingDependencies) {
                    let nodeKey = ident.text + "+" + referencedRowIndex;
                    if (referencedRowNode.isRowPinned()) {
                        nodeKey = ident.text + "+" + referencedRowNode.id;
                    }
                    if (!((_h = this.formulaCell.precedents) === null || _h === void 0 ? void 0 : _h.has(nodeKey))) {
                        (_j = this.formulaCell.precedents) === null || _j === void 0 ? void 0 : _j.add(nodeKey);
                    }
                }
                return this.evaluationContext.getCellValue(ident.text, referencedRowNode.id);
            case exports.STRING:
                return (0, exports.formulaError)("Offsets must be numbers.");
            case exports.EMPTY:
                return (0, exports.formulaError)("Missing offset.");
        }
        // Get the cell Column which has the reference.
        let focuscedColumn = (_l = (_k = this.evaluationContext.gridApi) === null || _k === void 0 ? void 0 : _k.getFocusedCell()) === null || _l === void 0 ? void 0 : _l.column.getColId();
        return this.evaluationContext.getColumnValueReference(ident.text, focuscedColumn);
    }
    visitEnvironmentalVariable(ctx) {
        let ident = ctx.envVar().IDENT();
        return (0, exports.formulaNumber)(new Number(this.evaluationContext.envVar[0][ident.text]));
    }
}
class Formula {
    constructor(str, gridApi) {
        this.tree = undefined;
        this.str = str;
        this.gridApi = gridApi;
        // tree construction
        let inputStream = antlr4ts_1.CharStreams.fromString(this.str);
        let lexer = new FormulaLexer_1.FormulaLexer(inputStream);
        let tokenStream = new antlr4ts_2.CommonTokenStream(lexer);
        let parser = new FormulaParser_1.FormulaParser(tokenStream);
        if (this.gridApi != null) {
            parser.gridApi = this.gridApi;
        }
        parser.errorHandler = new antlr4ts_1.BailErrorStrategy();
        try {
            this.tree = parser.prog();
        }
        catch (e) {
            this.tree = undefined;
        }
    }
    createTree() {
        // tree construction
        let inputStream = antlr4ts_1.CharStreams.fromString(this.str);
        let lexer = new FormulaLexer_1.FormulaLexer(inputStream);
        let tokenStream = new antlr4ts_2.CommonTokenStream(lexer);
        let parser = new FormulaParser_1.FormulaParser(tokenStream);
        parser.errorHandler = new antlr4ts_1.BailErrorStrategy();
        if (this.gridApi != null) {
            parser.gridApi = this.gridApi;
        }
        try {
            this.tree = parser.prog();
        }
        catch (e) {
            this.tree = undefined;
        }
    }
    getFormula(ctx) {
        if (this.tree != undefined) {
            try {
                let generatedFormulaString = this.tree.accept(new formulaStringVisitor_1.FormulaStringVisitor(ctx));
                this.str = String(generatedFormulaString.value);
                return generatedFormulaString.value;
            }
            catch (e) {
                return (0, exports.formulaError)("Error in getting Formula: " + e);
            }
        }
    }
    value(ctx, formulaCell) {
        if (this.tree != undefined) {
            try {
                return this.tree.accept(new FormulaEvaluationVisitor(ctx, formulaCell));
            }
            catch (e) {
                return (0, exports.formulaError)("Evaluation error: " + e);
            }
        }
        // Otherwise the compiler objects.
        return (0, exports.formulaError)("Unreachable");
    }
}
exports.Formula = Formula;
//# sourceMappingURL=formula.js.map