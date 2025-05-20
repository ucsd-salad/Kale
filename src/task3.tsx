import React from "react";
import ReactDOM from "react-dom/client";
import ReactWidget from "./ReactWidget";
import { WidgetModel } from "./widget";
import './style.css'
import data from './data/task3.json';

// Create an instance of WidgetModel
const widgetModel = new WidgetModel(/* pass any required arguments here */);

// Define GridOptions
let gridOptions = {};

const App = () => {
  return (
    <div style={{ margin: 0, padding: 0, position: "absolute", top: 10, width: "97%"}}>
      {/* Buttons to select the widget */}
      <div style={{ marginBottom: "1rem", textAlign: "left", padding: "0.5rem" }}>
        <span style={{ marginRight: "1rem", fontWeight: "bold" }}>Sheets:</span>
        <button>Task_3</button>
      </div>

      {/* Keep both widgets mounted but toggle visibility */}
      <div>
        <div
          style={{
            position: "absolute",
            width: "95%",
          }}
        >
          <ReactWidget
            model={widgetModel}
            gridOptions={gridOptions}
            initialData={data}
          />
        </div>
      </div>
    </div>
  );
};

// Render the App component into the #app div
const appDiv = document.querySelector<HTMLDivElement>("#app");
if (appDiv) {
  let root = ReactDOM.createRoot(appDiv);
  root.render(<App />);
}