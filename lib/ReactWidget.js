"use strict";
// Use this file for grid border functions, buttons, adding cols, saving, etc. (this file file sort of combines everything together)
// Create a new file called grid, that is primarily for grid functions and re-rendering the grid.
// Add buttons in here, create separate file for each button, add functionality to button files.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReactWidget;
const react_1 = __importDefault(require("react"));
const grid_1 = require("./grid");
require("ag-grid-community/styles/ag-grid.css");
require("ag-grid-community/styles/ag-theme-alpine.css");
require("../css/react-widget.css");
function ReactWidget(props) {
    let grid = (0, grid_1.createGrid)(props);
    let colButton = (0, grid_1.createAddColButton)(props);
    // let rowButton = createAddRowButton(props);
    let rowAfterButton = (0, grid_1.createAddRowAfterButton)(props);
    let rowBeforeButton = (0, grid_1.createAddRowBeforeButton)(props);
    let deleteRowButton = (0, grid_1.createDeleteRowButton)(props);
    let copyRowsButton = (0, grid_1.createCopyRowsButton)(props);
    return (react_1.default.createElement("div", { style: { height: 1080, width: "100%" } },
        react_1.default.createElement("div", { className: "action-buttons" },
            colButton,
            rowBeforeButton,
            rowAfterButton,
            deleteRowButton,
            copyRowsButton),
        grid));
}
//# sourceMappingURL=ReactWidget.js.map