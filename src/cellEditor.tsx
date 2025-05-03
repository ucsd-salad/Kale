import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { ColDef, GridApi,ColumnApi,Column,RowNode } from "ag-grid-community";

import { FormulaCell } from "./formulacell";
import { Cell } from "./Cell";
import { FormulaStringContext } from "./formulaStringVisitor";

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

interface IforwardRefProps {
  api: GridApi;
  colApi: ColumnApi;
  keyPress?: number;
  charPress?: string;
  value?: string | number | boolean | FormulaCell;
  context: {[key: string]: (event) => void};
  colDef: ColDef;
  data: object;
  column: Column;
  node: RowNode;
}

interface IforwardRefForwardedRef {}

export default forwardRef<IforwardRefForwardedRef, IforwardRefProps>(
  (props, forwardedRef) => {
    const createInitialState = () => {
      let startValue: string;
      let highlightAllOnFocus = true;
      let name: string | null = null;

      if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE || props.value === null) {
        // if backspace or delete pressed, we clear the cell
        startValue = "";
      } else if (props.charPress) {
        // if a letter was pressed, we start with the letter
        startValue = props.charPress;
        highlightAllOnFocus = false;
      } else {
        const colName = props.colDef.field;
        let cellValue: any = "";
        if (colName) {
          cellValue = props.data[colName];
          name = cellValue.name;
        }
        
        if (cellValue.formulaCell) {        
          let ctx = new FormulaStringContext(
            props.api,
          );
          startValue = "=" + cellValue.formulaCell.formula.getFormula(ctx);
        } else if (typeof cellValue.getValue() === "number") {
          startValue = cellValue.getValue().toString();
        } else if (typeof cellValue.getValue()  === "boolean") {
          startValue = cellValue.getValue().toString().toUpperCase();
        } else if (typeof cellValue.getValue()  === "undefined") {
          startValue = "";
        } else startValue = cellValue.getValue();
        if (props.keyPress === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }

      return {
        name: name,
        value: startValue,
        highlightAllOnFocus,
      };
    };

    const initialState = createInitialState();
    const [value, setValue] = useState(initialState.value);
    const initialName = initialState.name;
    const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
      initialState.highlightAllOnFocus
    );
    const refInput = useRef<HTMLInputElement>(null);

    // focus on the input
    useEffect(() => {
      // get ref from React component
      const eInput = refInput.current;
      if (refInput && eInput) {
        eInput.focus();

        if (highlightAllOnFocus) {
          eInput.select();

          setHighlightAllOnFocus(false);
        } else {
          // when we started editing, we want the carot at the end, not the start.
          // comes into play in two scenarios: a) when user hits F2 and b)
          // when user hits a printable character, then on IE (and only IE) the carot
          // was placed after the first character, thus 'apply' would end up as 'pplea'
          const length = eInput.value ? eInput.value.length : 0;
          if (length > 0) {
            eInput.setSelectionRange(length, length);
          }
        }
      }
    }, []);

    /* Utility Methods */
    const cancelBeforeStart =
      props.charPress && "1234567890".indexOf(props.charPress) < 0;

    const isLeftOrRight = (event: { keyCode: number }) => {
      return [KEY_LEFT, KEY_RIGHT].indexOf(event.keyCode) > -1;
    };

    const getCharCodeFromEvent = (event) => {
      event = event || window.event;
      return typeof event.which === "undefined" ? event.keyCode : event.which;
    };

    const deleteOrBackspace = (event) => {
      return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.keyCode) > -1;
    };

    // This should be changed in the future to characters we want to support
    const isCharValid = (charStr) => {
      return !!/./.test(charStr);
    };

    const isKeyPressedValid = (event) => {
      const charCode = getCharCodeFromEvent(event);
      const charStr = event.key ? event.key : String.fromCharCode(charCode);
      return isCharValid(charStr);
    };

    const finishedEditingPressed = (event) => {
      const charCode = getCharCodeFromEvent(event);
      return charCode === KEY_ENTER || charCode === KEY_TAB;
    };

    const onKeyDown = (event) => {
      if (isLeftOrRight(event) || deleteOrBackspace(event)) {
        event.stopPropagation();
        return;
      }

      if (!finishedEditingPressed(event) && !isKeyPressedValid(event)) {
        if (event.preventDefault) event.preventDefault();
      }
    };

    /* Component Editor Lifecycle methods */
    useImperativeHandle(forwardedRef, () => {
      return {
        // the final value to send to the grid, on completion of editing
        // This can be used by us to make the recalculation of the value
        getValue() {
          const colName = props.column.getColId();
          const rowData = props.data;
          const rowNodeId = props.node.id;
          let cellValue = rowData[colName];
          // If cell has already been initialized, use it 
          // Else create a new Cell instance
          if (!cellValue) {
            cellValue = new Cell({column: colName, rowNodeId: rowNodeId});
          }
          if (initialName) {
            cellValue.setName(initialName);
          }
          if (value.toUpperCase() === "TRUE") {
            cellValue.setValue(Boolean(1));
            return cellValue;
          }

          if (value.toUpperCase() === "FALSE") {
            cellValue.setValue(Boolean(0));
            return cellValue;
          }

          if (value[0] === "=") {
            let formulaCell = new FormulaCell(value.substring(1), props.api);
            cellValue.setFormulaCell(formulaCell);
            return cellValue;
          }
          // Reset formula cell to null
          cellValue.setFormulaCell(null);
          const numParseValue = Number(value);

          if (!isNaN(numParseValue)) {
            cellValue.setValue(numParseValue);
            return cellValue;
          }
          
          cellValue.setValue(value);
          return cellValue;
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return cancelBeforeStart;
        },
        setValue(value) {
          setValue(value);
        },
      };
    });

    return (
      <input
        ref={refInput}
        value={value}
        onChange={(event) => {
          props.context.onCellValueEdited(event);
          setValue(event.target.value);
        }}
        onKeyDown={(event) => onKeyDown(event)}
      />
    );
  }
);
