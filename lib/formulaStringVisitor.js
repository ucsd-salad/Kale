"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaStringVisitor = exports.FormulaStringContext = void 0;
const formula_1 = require("./formula");
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
const gridUtils_1 = require("./gridUtils");
class FormulaStringContext {
    constructor(gridApi) {
        this.gridApi = gridApi;
    }
}
exports.FormulaStringContext = FormulaStringContext;
class FormulaStringVisitor extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    constructor(ctx) {
        super();
        this.evaluationContext = ctx;
    }
    defaultResult() {
        return (0, formula_1.formulaError)("Default formulaStringVisitor result should not be used.");
    }
    visitTrue(ctx) {
        return (0, formula_1.formulaString)(ctx.text.toString());
    }
    visitFalse(ctx) {
        return (0, formula_1.formulaString)(ctx.text.toString());
    }
    visitFunction(ctx) {
        var _a, _b, _c;
        let args = null;
        args = (_a = ctx.arguments()) === null || _a === void 0 ? void 0 : _a.absRowReference();
        if (!args || args.length === 0) {
            args = (_b = ctx.arguments()) === null || _b === void 0 ? void 0 : _b.relativeRowReference();
        }
        if (!args || args.length === 0) {
            args = (_c = ctx.arguments()) === null || _c === void 0 ? void 0 : _c.expr();
        }
        let functionName = ctx.IDENT().text;
        let argList = [];
        for (let arg of args) {
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
        return (0, formula_1.formulaString)(formulaStr);
    }
    visitMultiplicationOrDivision(ctx) {
        const left = this.visit(ctx._left).value;
        const right = this.visit(ctx._right).value;
        if (ctx.MUL() != undefined) {
            return (0, formula_1.formulaString)(left + "*" + right);
        }
        else {
            return (0, formula_1.formulaString)(left + "/" + right);
        }
    }
    visitAdditionOrSubtraction(ctx) {
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        if (ctx.PLUS() != undefined) {
            return (0, formula_1.formulaString)(left.value + "+" + right.value);
        }
        else {
            return (0, formula_1.formulaString)(left.value + "-" + right.value);
        }
    }
    visitComparison(ctx) {
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        if (ctx.EQ() !== undefined) {
            return (0, formula_1.formulaString)(left.value + "==" + right.value);
        }
        else if (ctx.GT() !== undefined) {
            return (0, formula_1.formulaString)(left.value + ">" + right.value);
        }
        else if (ctx.GTE() !== undefined) {
            return (0, formula_1.formulaString)(left.value + ">=" + right.value);
        }
        else if (ctx.LT() !== undefined) {
            return (0, formula_1.formulaString)(left.value + "<" + right.value);
        }
        else if (ctx.LTE() !== undefined) {
            return (0, formula_1.formulaString)(left.value + "<=" + right.value);
        }
        else {
            return (0, formula_1.formulaString)(left.value + "!=" + right.value);
        }
    }
    visitNumber(ctx) {
        return (0, formula_1.formulaString)(ctx.text);
    }
    visitString(ctx) {
        return (0, formula_1.formulaString)(ctx.text);
    }
    visitParentheses(ctx) {
        let innerExpr = this.visit(ctx.expr());
        const formulaText = "(" + innerExpr.value + ")";
        return (0, formula_1.formulaString)(formulaText);
    }
    visitPositiveExpression(ctx) {
        let arbitraryExpression = this.visit(ctx._an);
        return (0, formula_1.formulaString)("+" + arbitraryExpression.value);
    }
    visitNegativeExpression(ctx) {
        let arbitraryExpression = this.visit(ctx._an);
        return (0, formula_1.formulaString)("-" + arbitraryExpression.value);
    }
    visitAbsRowReference(ctx) {
        const formulaText = "[" + ctx.INT().text + "]";
        return (0, formula_1.formulaString)(formulaText);
    }
    visitRelativeRowReference(ctx) {
        let plusMinus = "";
        if (ctx.PLUS()) {
            plusMinus = "+";
        }
        else if (ctx.MINUS()) {
            plusMinus = "-";
        }
        const rowIndexExpr = this.visit(ctx.expr());
        const formulaText = "[" + plusMinus + rowIndexExpr.value + "]";
        return (0, formula_1.formulaString)(formulaText);
    }
    visitAbsoluteReference(ctx) {
        let ident = ctx.absRef().IDENT();
        let index = ctx.absRef().INT().text;
        let id = String(ctx.absRef().rowNodeID);
        if (index === null || index === undefined) {
            return (0, formula_1.formulaError)("bug");
        }
        if (id == null) {
            return (0, formula_1.formulaError)("Row " + index + " does not exist.");
        }
        let referencedRowNode = this.evaluationContext.gridApi.getRowNode(id);
        if ((referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.id) === undefined) {
            return (0, formula_1.formulaError)("Row " + index + " does not exist.");
        }
        let formulaText = ident.text + "[" + referencedRowNode.rowIndex + "]";
        return (0, formula_1.formulaString)(formulaText);
    }
    visitReference(ctx) {
        var _a, _b;
        let ident = ctx.ref().IDENT();
        let indexExpr = ctx.ref().expr();
        if (indexExpr === undefined || indexExpr === null) {
            return (0, formula_1.formulaString)(ident.text);
        }
        // If the formula reference has no index (referencing whole column) and the reference is inside a function,
        // add a dependency between current formuala cell and each row of the referenced column
        if (!indexExpr) {
            // Check if the identifier is a name of named cell
            // Iterate over all the nodes of the table
            let foundNamedCell = false;
            let colName = null;
            let rowNodeId = null;
            let cell = null;
            const allRowNodes = (0, gridUtils_1.getAllRowNodes)(this.evaluationContext.gridApi);
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
                return (0, formula_1.formulaString)(ident.text);
            }
        }
        let index = { kind: "NUMBER", value: new Number(0) };
        if (indexExpr != undefined) {
            index = indexExpr.accept(this);
        }
        switch (index.kind) {
            case formula_1.ERROR:
                return (0, formula_1.formulaError)("Error in offset: " + index.value);
            case formula_1.NUMBER:
                let offset = index.value;
                let referencedRowIndex = Math.trunc(offset);
                if (indexExpr && ctx.ref().PLUS()) {
                    return (0, formula_1.formulaString)(ident.text + "[+" + (indexExpr === null || indexExpr === void 0 ? void 0 : indexExpr.text) + "]");
                }
                else if (indexExpr && ctx.ref().MINUS()) {
                    return (0, formula_1.formulaString)(ident.text + "[-" + (indexExpr === null || indexExpr === void 0 ? void 0 : indexExpr.text) + "]");
                }
                // referencedRowIndex = Math.trunc(offset);
                let referencedRowNode = this.evaluationContext.gridApi.getDisplayedRowAtIndex(referencedRowIndex.valueOf());
                if ((referencedRowNode === null || referencedRowNode === void 0 ? void 0 : referencedRowNode.id) == null) {
                    return (0, formula_1.formulaError)("Row " + referencedRowIndex + " does not exist.");
                }
                // If the column does not exist in the row data, throw an error
                if (!(ident.text in referencedRowNode.data)) {
                    return (0, formula_1.formulaError)("Column " + ident.text + " does not exist.");
                }
            case formula_1.STRING:
                if (indexExpr && ctx.ref().PLUS()) {
                    return (0, formula_1.formulaString)(ident.text + "[+" + (index === null || index === void 0 ? void 0 : index.value) + "]");
                }
                else if (indexExpr && ctx.ref().MINUS()) {
                    return (0, formula_1.formulaString)(ident.text + "[-" + (index === null || index === void 0 ? void 0 : index.value) + "]");
                }
                const value = index.value;
                if (value.includes('>') || value.includes('<') || value.includes('>=') || value.includes('<=')) {
                    return (0, formula_1.formulaString)(ident.text + "[" + value + "]");
                }
                return (0, formula_1.formulaString)(ident.text + "[" + index.value + "]");
            case formula_1.EMPTY:
                return (0, formula_1.formulaError)("Missing offset.");
        }
        // Get the cell Column which has the reference.
        let focuscedColumn = (_b = (_a = this.evaluationContext.gridApi) === null || _a === void 0 ? void 0 : _a.getFocusedCell()) === null || _b === void 0 ? void 0 : _b.column.getColId();
        return (0, formula_1.formulaString)(ident.text);
    }
    visitEnvironmentalVariable(ctx) {
        let ident = ctx.envVar().IDENT();
        return (0, formula_1.formulaString)(ident.text);
    }
}
exports.FormulaStringVisitor = FormulaStringVisitor;
//# sourceMappingURL=formulaStringVisitor.js.map