import { CellRange, GridApi, IRowNode } from "ag-grid-community";

/**
 *  Returns the footer row node of the table if it exists
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode | undefined} Returns the footer row node or undefined if it doesn't exist
 */
export const getFooterNode = (gridApi: GridApi): IRowNode | undefined => {
  const footerNodesCount = gridApi.getPinnedBottomRowCount();
  let footerNode: IRowNode | undefined;
  if (footerNodesCount > 0) {
    footerNode = gridApi.getPinnedBottomRow(0);
    return footerNode;
  }
  return footerNode;
};

/**
 *  Returns all the row nodes including footer row node of the grid
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode[]} Returns the list of all the row nodes of the table including footer row node
 */
export const getAllRowNodes = (gridApi: GridApi): IRowNode[] => {
    let allRowNodes: IRowNode[] = [];
    gridApi.forEachNode(rowNode => allRowNodes.push(rowNode));
    const footerNode = getFooterNode(gridApi);
    if (footerNode) {
        allRowNodes.push(footerNode);
    } 
    return allRowNodes;
}

/**
 *  Determines whether all the elements in the selected vertical range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {colName} string - Column name of selected range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
export const areAllValuesNumbersWithContDiffInVertRange = (gridApi: GridApi, selectedRange: CellRange[], colName: string): [boolean, (number | null)] => {
  const firstRowIndex = selectedRange[0].startRow?.rowIndex;
  const lastRowIndex = selectedRange[0].endRow?.rowIndex;
  if (firstRowIndex === null || firstRowIndex === undefined || lastRowIndex === null || lastRowIndex === undefined) {
    return [false, -1];
  }
  const startRowIndex = Math.min(firstRowIndex, lastRowIndex);
  const endRowIndex = Math.max(firstRowIndex, lastRowIndex);
  let constDiff: (number | null) = null;
  let prevNum: (number | null) = null;
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
        } else {
          if (cellValue.value - prevNum !== constDiff) {
            return [false, -1];
          }
        }
      }
      prevNum = cellValue.value;
    } else {
      return [false, -1];
    }
  }
  return [true, constDiff];
}

/**
 *  Determines whether all the elements in the selected horizontal range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {rowIdx} number - Row index of selected horizontal range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
export const areAllValuesNumbersWithConstDiffInHorizRange = (gridApi: GridApi, selectedRange: CellRange[], rowIdx: number): [boolean, (number | null)] => {
  const selectedRangeColumns = selectedRange[0].columns; // Get all the columns in the selected range
  if (rowIdx === null || rowIdx === undefined) {
    return [false, -1];
  }
  const rowNode = gridApi.getDisplayedRowAtIndex(rowIdx);
  let constDiff: (number | null) = null;
  let prevNum: (number | null) = null;
  for (let colIdx = 0; colIdx < selectedRangeColumns.length; colIdx++) {
    const curColumn = selectedRangeColumns[colIdx];
    const curColName = curColumn.getColId();
    const cellValue = rowNode?.data[curColName];
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
        } else {
          if (cellValue.value - prevNum !== constDiff) {
            return [false, -1];
          }
        }
      }
      prevNum = cellValue.value;
    } else {
      return [false, -1];
    }
  }
  return [true, constDiff];
}