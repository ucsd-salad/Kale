"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementFunc = exports.sumFunc = exports.collectValuesFunc = exports.areArgsValid = exports.invalidArgsMessage = void 0;
const invalidArgsMessage = (argsLength) => {
    return `Wrong number of arguments to IF. 
    Expected between 2 and 4 arguments, but got ${argsLength} arguments.`;
};
exports.invalidArgsMessage = invalidArgsMessage;
const areArgsValid = (args) => {
    return args && (args.length === 2 || args.length === 3);
};
exports.areArgsValid = areArgsValid;
var collectValuesFunc = (result, value) => {
    if (result === null) {
        result = [];
    }
    result.push(value.valueOf());
    return result;
};
exports.collectValuesFunc = collectValuesFunc;
var sumFunc = (a, b) => {
    return new Number(a.valueOf() + b.valueOf());
};
exports.sumFunc = sumFunc;
var incrementFunc = (a) => {
    return new Number(a.valueOf() + 1);
};
exports.incrementFunc = incrementFunc;
//# sourceMappingURL=ifFunction.js.map