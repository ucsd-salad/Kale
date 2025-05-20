"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const formulacell_1 = require("./formulacell");
const grid_1 = require("./grid");
exports.default = (props) => {
    //check for null values
    if (props.data === null) {
        return "";
    }
    if (props.column === undefined || null) {
        return "";
    }
    if (props.column.getColId() === grid_1.ROW_NUMBER_COL_NAME) {
        return props.rowIndex;
    }
    //obtain cell object then check if it's null
    let cell = props.data[props.column.getColId()];
    if (cell === null) {
        return "";
    }
    //get the name and value
    let name = cell.name;
    let value = cell.value;
    //check if name or value are null, then set them to empty strings so it doesn't show up as "null" on the grid
    if (name === null) {
        name = "";
    }
    if (value === null) {
        value = "";
    }
    if (value === false || value === true) {
        value = value.toString().toUpperCase();
    }
    if (cell.formulaCell !== null) {
        if (cell.formulaCell instanceof formulacell_1.FormulaCell) {
            if (cell.formulaCell.value !== null && cell.formulaCell.value.value !== null && cell.formulaCell.value.value != undefined) {
                value = cell.formulaCell.value.value.toString();
            }
            else if (cell.formulaCell.value !== null && cell.formulaCell.value.vector && cell.formulaCell.value.vector instanceof Array) {
                value = "It's a vector. Can't display it";
            }
        }
        // else { 
        //   value="Its a vector. Can't display it"
        // }
    }
    //style the value and name next to each other
    return (react_1.default.createElement("div", { style: {
            display: "flex",
            alignItems: "center",
        } },
        react_1.default.createElement("span", { style: {
                // Add dotted border to the right of the name
                borderRight: "1px dotted",
                paddingRight: "4px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                backgroundColor: "#ECCAFF",
            } }, name),
        react_1.default.createElement("span", { style: { marginLeft: "8px", marginRight: "5px" } }, value)));
};
//# sourceMappingURL=cellRenderer.js.map