import React from "react";
import ReactDOM from "react-dom/client";
import ReactWidget from "./ReactWidget";
import { WidgetModel } from "./widget";
import { GridOptions } from "ag-grid-community";
import './style.css'
import data from './json/task1_1.json';

// Create an instance of WidgetModel
const widgetModel = new WidgetModel(/* pass any required arguments here */);

// Define GridOptions
let gridOptions = {};

// Render the ReactWidget component into the #app div
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) {
  let root = ReactDOM.createRoot(appDiv);
  let component = React.createElement(ReactWidget, {
    model: widgetModel,
    gridOptions: gridOptions,
    initialData: data,
  });
  root.render(component);
  }