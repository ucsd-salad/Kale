// Copyright (c) University of Maryland
// Distributed under the terms of the Modified BSD License.

import ReactWidget from "./ReactWidget"
import React from 'react';
import ReactDOM from 'react-dom';
import { EventEmitter } from 'events';

import { MODULE_NAME, MODULE_VERSION } from './version';

/* Used for CSS Element queries */
import ElementQueries from 'css-element-queries/src/ElementQueries';
ElementQueries.listen();
ElementQueries.init();

import '../css/widget.css';

const defaultModelProperties = {
  value: [],
  env_variables: [],
}

export type WidgetModelState = typeof defaultModelProperties

export class WidgetModel {
  private state: Record<string, any> = {};
  private eventEmitter = new EventEmitter();

  // Get a property value
  get(name: string) {
    return this.state[name];
  }

  // Set a property value and emit a change event
  set(name: string, value: any, options?: any) {
    this.state[name] = value;
    this.eventEmitter.emit(`change:${name}`, { name, value, options });
  }

  // Subscribe to an event
  on(event: string, callback: (event: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  // Unsubscribe from an event
  unbind(event: string, callback: (event: any) => void) {
    this.eventEmitter.off(event, callback);
  }

  // Save changes (no-op for standalone usage)
  save_changes() {
    console.log('Changes saved:', this.state);
  }
}

// export class KaleModel extends DOMWidgetModel {
//   defaults() {
//     return {
//       ...super.defaults(),
//       _model_name: KaleModel.model_name,
//       _model_module: KaleModel.model_module,
//       _model_module_version: KaleModel.model_module_version,
//       _view_name: KaleModel.view_name,
//       _view_module: KaleModel.view_module,
//       _view_module_version: KaleModel.view_module_version,
//       ...defaultModelProperties
//     };
//   }

//   static serializers: ISerializers = {
//     ...DOMWidgetModel.serializers,
//   };

//   static model_name = 'KaleModel';
//   static model_module = MODULE_NAME;
//   static model_module_version = MODULE_VERSION;
//   static view_name = 'KaleView';
//   static view_module = MODULE_NAME;
//   static view_module_version = MODULE_VERSION;
// }

// export class KaleView extends DOMWidgetView {
//   private gridOptions: any;
//   render() {
//     this.el.classList.add('custom-widget');

//     const component = React.createElement(ReactWidget, {
//       model: this.model,
//       gridOptions: this.gridOptions,
//     });
    
//     ReactDOM.render(component, this.el);
//   }
// }
