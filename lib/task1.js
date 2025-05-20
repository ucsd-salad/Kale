"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const ReactWidget_1 = __importDefault(require("./ReactWidget"));
const widget_1 = require("./widget");
require("./style.css");
const task1_1_json_1 = __importDefault(require("./data/task1_1.json"));
const task1_2_json_1 = __importDefault(require("./data/task1_2.json"));
// Create instances of WidgetModel for each widget
const widgetModel1 = new widget_1.WidgetModel( /* pass any required arguments here */);
const widgetModel2 = new widget_1.WidgetModel( /* pass any required arguments here */);
// Define GridOptions for each widget
let gridOptions1 = {};
let gridOptions2 = {};
// Render the App component into the #app div
const appDiv = document.querySelector("#app");
if (appDiv) {
    let root = client_1.default.createRoot(appDiv);
    root.render(react_1.default.createElement("div", null,
        react_1.default.createElement(ReactWidget_1.default, { model: widgetModel1, gridOptions: gridOptions1, initialData: task1_1_json_1.default }),
        react_1.default.createElement(ReactWidget_1.default, { model: widgetModel2, gridOptions: gridOptions2, initialData: task1_2_json_1.default })));
}
//# sourceMappingURL=task1.js.map