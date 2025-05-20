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
const task3_json_1 = __importDefault(require("./data/task3.json"));
// Create an instance of WidgetModel
const widgetModel = new widget_1.WidgetModel( /* pass any required arguments here */);
// Define GridOptions
let gridOptions = {};
// Render the ReactWidget component into the #app div
const appDiv = document.querySelector('#app');
if (appDiv) {
    let root = client_1.default.createRoot(appDiv);
    let component = react_1.default.createElement(ReactWidget_1.default, {
        model: widgetModel,
        gridOptions: gridOptions,
        initialData: task3_json_1.default,
    });
    root.render(component);
}
//# sourceMappingURL=task3.js.map