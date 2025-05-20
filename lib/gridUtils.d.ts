import { CellRange, GridApi, IRowNode } from "ag-grid-community";
/**
 *  Returns the footer row node of the table if it exists
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode | undefined} Returns the footer row node or undefined if it doesn't exist
 */
export declare const getFooterNode: (gridApi: GridApi) => IRowNode | undefined;
/**
 *  Returns all the row nodes including footer row node of the grid
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {IRowNode[]} Returns the list of all the row nodes of the table including footer row node
 */
export declare const getAllRowNodes: (gridApi: GridApi) => IRowNode[];
/**
 *  Determines whether all the elements in the selected vertical range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {colName} string - Column name of selected range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
export declare const areAllValuesNumbersWithContDiffInVertRange: (gridApi: GridApi, selectedRange: CellRange[], colName: string) => [boolean, (number | null)];
/**
 *  Determines whether all the elements in the selected horizontal range are numbers and if they have constant consecutive difference
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {selectedRange} CellRange[] - Selected cell range object
 *  @param {rowIdx} number - Row index of selected horizontal range
 *  @returns {[boolean, (number | null)]} Returns an array where first element indicates whether the elements in the selected range are numbers and have
 *  constant consecutive difference between them and second element indicates the constant consecutive difference
 */
export declare const areAllValuesNumbersWithConstDiffInHorizRange: (gridApi: GridApi, selectedRange: CellRange[], rowIdx: number) => [boolean, (number | null)];
