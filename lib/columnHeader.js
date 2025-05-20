"use strict";
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
exports.columnHeaderList = void 0;
const react_1 = __importStar(require("react"));
const formula_1 = require("./formula");
const grid_1 = require("./grid");
function validateColumnHeaderName(name, id, columnHeaderList) {
    let result = { hasError: false, message: "" };
    //if name is empty
    if (name.length === 0) {
        result.hasError = true;
        result.message = "ERROR: Cannot Be Empty";
    }
    //if name contains spaces
    if (name.includes(" ")) {
        result.hasError = true;
        result.message = "ERROR: Cannot Contain Spaces";
    }
    for (const [cellId, cellName] of grid_1.nameCellMap) {
        if (cellName === name) {
            result.hasError = true;
            result.message = "ERROR: Name Already Exists For Name Cell";
            return result;
        }
    }
    //if name already exists for a column header
    for (let i = 0; i < columnHeaderList.length; i++) {
        if (columnHeaderList[i].colId === name &&
            columnHeaderList[i].colId !== "" &&
            columnHeaderList[i].instanceId !== id) {
            result.hasError = true;
            result.message = "ERROR: Name Already Exists";
            return result;
        }
    }
    return result;
}
exports.default = (props) => {
    const [editing, setEditing] = (0, react_1.useState)(false); // indicates whether the header is in edit mode or not
    const [headerName, setHeaderName] = (0, react_1.useState)(props.displayName);
    const [isValidHeaderName, setIsValidHeaderName] = (0, react_1.useState)({ hasError: false, message: "" });
    const previousHeaderName = props.displayName;
    const refButton = (0, react_1.useRef)(null);
    const ROW_NUMBER_COL_NAME = "#";
    const ASC = "asc";
    const DESC = "desc";
    const NO_SORT = "";
    // Show the menu items
    const onMenuClicked = () => {
        props.showColumnMenu(refButton.current);
    };
    let menu = null;
    if (props.enableMenu) {
        menu = (react_1.default.createElement("div", { ref: refButton, className: "customHeaderMenuButton", onClick: () => onMenuClicked() },
            react_1.default.createElement("i", { className: `fa ${props.menuIcon}` })));
    }
    const onBlur = () => {
        setEditing(false);
        if (!isValidHeaderName.hasError) {
            props.renameColumn(props, props.column.colId, previousHeaderName, headerName, props.eGridHeader);
        }
        // Else, keep the current column name
        else {
            setHeaderName(previousHeaderName);
        }
    };
    const onEnterKeyPressed = (event) => {
        if (event.key === "Enter") {
            setEditing(false);
            // If the cell name is valid, rename column
            if (!isValidHeaderName.hasError) {
                props.renameColumn(props, props.column.colId, previousHeaderName, headerName, props.eGridHeader);
            }
            // Else, keep the current column name
            else {
                setHeaderName(previousHeaderName);
            }
        }
    };
    // Event listener on change of column header name
    const onHeaderNameChange = (event) => {
        let colName = event.target.value;
        setMessage(colName);
        exports.columnHeaderList = props.columnApi.getColumns();
    };
    // Event listener on click of column header
    const onHeaderColumnClicked = (event) => {
        setMessage(event.target.textContent);
        if (headerName == ROW_NUMBER_COL_NAME) {
            return;
        }
        // Click of column header has two different behaviors:
        // 1. If no cell is being edited, then it allows to rename the column header name
        // 2. Else, if a cell is being edited, then it allows to populate the column name in the cell (Formula mode)
        if (props.api.getEditingCells().length == 0) {
            setEditing(true);
        }
        else {
            props.onHeaderCellClicked(event);
        }
    };
    //sets the column name and message
    const setMessage = (colName) => {
        //obtain the column name
        let colId = props.column.instanceId;
        setIsValidHeaderName({
            hasError: false,
            message: "",
        });
        //check if column name is valid
        let colVal = validateColumnHeaderName(colName, colId, props.columnApi.getColumns());
        setIsValidHeaderName({
            hasError: colVal["hasError"],
            message: colVal["message"],
        });
        //set the column name in the header
        setHeaderName(colName);
        //update the columnHeaderList
        exports.columnHeaderList = props.columnApi.getColumns();
    };
    // Evaluates the cell value (returns the evaluated value if the cell has a formula,
    // else just return the cell value if the cell contains a value of primitive type)
    const evaluateCellValue = (cellValue, gridApi, columnApi, rowId) => {
        if (!cellValue.formulaCell) {
            return cellValue.value;
        }
        let ctx = new formula_1.EvaluationContext(gridApi, columnApi, rowId, props.context.envVar, false);
        cellValue.formulaCell.evaluate(ctx);
        return cellValue.formulaCell.value.value;
    };
    const onSortRequested = (order, event) => {
        if (order == NO_SORT) {
            // Restore original order
            return;
        }
        const colName = props.column.getColId();
        let table = [];
        // Store the table data as a list of row node data
        // Push all the row nodes except the footer node
        props.api.forEachNode((rowNode) => {
            table.push(rowNode);
        });
        // Store table based on current column
        table.sort((rowNode1, rowNode2) => {
            // Read current column value
            const cellValue1 = rowNode1.data[colName];
            const cellValue2 = rowNode2.data[colName];
            const evaluatedCellValue1 = evaluateCellValue(cellValue1, props.api, props.columnApi, rowNode1.id);
            const evaluatedCellValue2 = evaluateCellValue(cellValue2, props.api, props.columnApi, rowNode1.id);
            if (order == ASC) {
                if (evaluatedCellValue1 < evaluatedCellValue2) {
                    return -1;
                }
                if (evaluatedCellValue1 > evaluatedCellValue2) {
                    return 1;
                }
                return 0;
            }
            else if (order == DESC) {
                if (evaluatedCellValue1 > evaluatedCellValue2) {
                    return -1;
                }
                if (evaluatedCellValue1 < evaluatedCellValue2) {
                    return 1;
                }
                return 0;
            }
            return 0;
        });
        let rowData = [];
        table.forEach((rowNode) => {
            rowData.push(rowNode.data);
        });
        //iterate through column and update nameCellMap
        rowData.forEach((node, index) => {
            const colSelected = props.column.getColId();
            const newId = index + "_" + colSelected;
            const cellVal = node[colSelected];
            if (cellVal != null && cellVal.name) {
                for (const [key, value] of grid_1.nameCellMap) {
                    if (grid_1.nameCellMap.get(key) === cellVal.name) {
                        grid_1.nameCellMap.delete(key);
                    }
                }
                grid_1.nameCellMap.set(newId, cellVal.name);
            }
        });
        // Update the row data of the table
        props.api.setRowData(rowData);
    };
    let sortElement = (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { style: { display: "inline-block" }, onClick: (event) => onSortRequested(ASC, event) }, "\u25B2"),
        react_1.default.createElement("div", { style: { display: "inline-block" }, onClick: (event) => onSortRequested(DESC, event) }, "\u25BC")));
    const invalidHeaderStyle = {
        border: isValidHeaderName.hasError ? "2px solid red" : "none",
    };
    return (react_1.default.createElement("div", null, editing ? (react_1.default.createElement("div", null,
        react_1.default.createElement("input", { type: "text", value: headerName, onChange: onHeaderNameChange, autoFocus: true, onBlur: onBlur, onKeyDown: (e) => onEnterKeyPressed(e), style: invalidHeaderStyle }),
        isValidHeaderName["hasError"] && (react_1.default.createElement("div", { style: {
                color: "red",
                whiteSpace: "normal",
                resize: "both",
                fontSize: "10px",
            } }, isValidHeaderName["message"])))) : (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "columnHeader", onClick: onHeaderColumnClicked }, headerName === ROW_NUMBER_COL_NAME ? "" : headerName),
        react_1.default.createElement("span", { style: { marginLeft: "0.15rem", display: "inline-block" } }, menu),
        react_1.default.createElement("span", { style: { marginLeft: "1rem", display: "inline-block" } }, headerName !== ROW_NUMBER_COL_NAME && sortElement)))));
};
//# sourceMappingURL=columnHeader.js.map