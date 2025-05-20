"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areAllValuesNumbersWithConstDiffInHorizRange = exports.areAllValuesNumbersWithContDiffInVertRange = exports.getAllRowNodes = exports.getFooterNode = void 0;
/**
 *  Returns the footer row node of the table if it exists
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode | undefined} Returns the footer row node or undefined if it doesn't exist
 */
const getFooterNode = (gridApi) => {
    const footerNodesCount = gridApi.getPinnedBottomRowCount();
    let footerNode;
    if (footerNodesCount > 0) {
        footerNode = gridApi.getPinnedBottomRow(0);
        return footerNode;
    }
    return footerNode;
};
exports.getFooterNode = getFooterNode;
/**
 *  Returns all the row nodes including footer row node of the grid
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode[]} Returns the list of all the row nodes of the table including footer row node
 */
const getAllRowNodes = (gridApi) => {
    let allRowNodes = [];
    gridApi.forEachNode(rowNode => allRowNodes.push(rowNode));
    const footerNode = (0, exports.getFooterNode)(gridApi);
    if (footerNode) {
        allRowNodes.push(footerNode);
    }
    return allRowNodes;
};
exports.getAllRowNodes = getAllRowNodes;
/**
 *  Determines whether all the elements in the selected vertical range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {colName} string - Column name of selected range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
const areAllValuesNumbersWithContDiffInVertRange = (gridApi, selectedRange, colName) => {
    var _a, _b;
    const firstRowIndex = (_a = selectedRange[0].startRow) === null || _a === void 0 ? void 0 : _a.rowIndex;
    const lastRowIndex = (_b = selectedRange[0].endRow) === null || _b === void 0 ? void 0 : _b.rowIndex;
    if (firstRowIndex === null || firstRowIndex === undefined || lastRowIndex === null || lastRowIndex === undefined) {
        return [false, -1];
    }
    const startRowIndex = Math.min(firstRowIndex, lastRowIndex);
    const endRowIndex = Math.max(firstRowIndex, lastRowIndex);
    let constDiff = null;
    let prevNum = null;
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        // Get row node at rowIndex
        const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
        if (rowNode === null || rowNode === undefined) {
            return [false, -1];
        }
        const cellValue = rowNode.data[colName];
        if (cellValue.formulaCell) {
            return [false, -1];
        }
        // If the range contains only one number
        if (startRowIndex === endRowIndex) {
            return [true, 1];
        }
        if (typeof cellValue.value === "number") {
            if (prevNum !== null) {
                if (constDiff === null) {
                    constDiff = cellValue.value - prevNum;
                }
                else {
                    if (cellValue.value - prevNum !== constDiff) {
                        return [false, -1];
                    }
                }
            }
            prevNum = cellValue.value;
        }
        else {
            return [false, -1];
        }
    }
    return [true, constDiff];
};
exports.areAllValuesNumbersWithContDiffInVertRange = areAllValuesNumbersWithContDiffInVertRange;
/**
 *  Determines whether all the elements in the selected horizontal range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {rowIdx} number - Row index of selected horizontal range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
const areAllValuesNumbersWithConstDiffInHorizRange = (gridApi, selectedRange, rowIdx) => {
    const selectedRangeColumns = selectedRange[0].columns; // Get all the columns in the selected range
    if (rowIdx === null || rowIdx === undefined) {
        return [false, -1];
    }
    const rowNode = gridApi.getDisplayedRowAtIndex(rowIdx);
    let constDiff = null;
    let prevNum = null;
    for (let colIdx = 0; colIdx < selectedRangeColumns.length; colIdx++) {
        const curColumn = selectedRangeColumns[colIdx];
        const curColName = curColumn.getColId();
        const cellValue = rowNode === null || rowNode === void 0 ? void 0 : rowNode.data[curColName];
        if (cellValue.formulaCell) {
            return [false, -1];
        }
        // If the range contains only one element
        if (selectedRangeColumns.length === 1) {
            return [true, 1];
        }
        if (typeof cellValue.value === "number") {
            if (prevNum !== null) {
                if (constDiff === null) {
                    constDiff = cellValue.value - prevNum;
                }
                else {
                    if (cellValue.value - prevNum !== constDiff) {
                        return [false, -1];
                    }
                }
            }
            prevNum = cellValue.value;
        }
        else {
            return [false, -1];
        }
    }
    return [true, constDiff];
};
exports.areAllValuesNumbersWithConstDiffInHorizRange = areAllValuesNumbersWithConstDiffInHorizRange;
//# sourceMappingURL=gridUtils.js.map