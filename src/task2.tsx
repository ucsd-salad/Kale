import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import ReactWidget from "./ReactWidget";
import { WidgetModel } from "./widget";
import './style.css'
import data1 from './data/task2_1.json';
import data2 from './data/task2_2.json';
import data3 from './data/task2_3.json';

// Create instances of WidgetModel for each widget
const widgetModel1 = new WidgetModel(/* pass any required arguments here */);
const widgetModel2 = new WidgetModel(/* pass any required arguments here */);
const widgetModel3 = new WidgetModel(/* pass any required arguments here */);

// Define GridOptions for each widget
let gridOptions1 = {};
let gridOptions2 = {};
let gridOptions3 = {};

const App = () => {
  // State to track the selected widget
  const [selectedWidget, setSelectedWidget] = useState(1);

  return (
    <div style={{ margin: 0, padding: 0, position: "absolute", top: 10, width: "97%"}}>
      {/* Buttons to select the widget */}
      <div style={{ marginBottom: "1rem", textAlign: "left", padding: "0.5rem" }}>
        <span style={{ marginRight: "1rem", fontWeight: "bold" }}>Sheets:</span>
        <button onClick={() => setSelectedWidget(1)}>Task_2</button>
        <button onClick={() => setSelectedWidget(2)}>intro_project</button>
        <button onClick={() => setSelectedWidget(3)}>class_e</button>
      </div>

      {/* Keep both widgets mounted but toggle visibility */}
      <div>
        <div
          style={{
            display: selectedWidget === 1 ? "block" : "none",
            position: "absolute",
            width: "95%",
          }}
        >
          <ReactWidget
            model={widgetModel1}
            gridOptions={gridOptions1}
            initialData={data1}
          />
        </div>
        <div
          style={{
            display: selectedWidget === 2 ? "block" : "none",
            position: "absolute",
            width: "95%",
          }}
        >
          <ReactWidget
            model={widgetModel2}
            gridOptions={gridOptions2}
            initialData={data2}
          />
        </div>
        <div
          style={{
            display: selectedWidget === 3 ? "block" : "none",
            position: "absolute",
            width: "95%",
          }}
        >
          <ReactWidget
            model={widgetModel3}
            gridOptions={gridOptions3}
            initialData={data3}
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