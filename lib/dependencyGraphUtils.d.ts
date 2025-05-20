import { DepGraph } from "dependency-graph";
import { GridApi, ColumnApi } from "ag-grid-community";
import { Cell } from "./Cell";
export type DepGraphOrderingValue = {
    ordering: Set<DepNodeType>;
    cycles: string[][];
};
export type DepNodeType = String | Cell;
export declare let depGraphOrderingValue: (ordering: Set<DepNodeType>, cycles: string[][]) => DepGraphOrderingValue;
/**
 *  Constructs and returns dependency graph by creating a node for each formula cell
 *  and establishes dependencies between them depending on the precedents of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @returns {DepGraph} Returns the dependency graph
 */
export declare function constructDependencyGraph(gridApi: GridApi): DepGraph<DepNodeType>;
/**
 *  Checks whether a cycle exists in the dependency graph; if it exists
 *  then it populates the error in each cell involved in the cycle
 *  In case of multiple cycles, only one cycle is detected
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {depGraph} DepGraph<DepNodeType> - Dependency graph
 *  @returns {DepGraph} Returns the topological ordering and cycle if exists in the dependency graph
 */
export declare function checkCycleInDepGraph(gridApi: GridApi, depGraph: DepGraph<DepNodeType>): DepGraphOrderingValue;
/**
 *  Populates the precedents of all formula cells by visiting each formula cell
 *  and parsing the formula of the cell
 *  @param {gridApi} GridApi - Grid API instance associated with the grid
 *  @param {columnApi} ColumnApi - Column API instance associated with the grid
 *  @param {envVar} - Environment variables of the jupyter notebook
 */
export declare function populatePrecedentsOfAllCells(gridApi: GridApi, columnApi: ColumnApi, envVar: any): void;
