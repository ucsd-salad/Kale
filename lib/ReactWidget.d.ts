import React from "react";
import { WidgetModel } from "./widget";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../css/react-widget.css';
export interface WidgetProps {
    model: WidgetModel;
    gridOptions: any;
    initialData: any[];
}
export default function ReactWidget(props: WidgetProps): React.JSX.Element;
