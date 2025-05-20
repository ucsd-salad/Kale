"use strict";
// Copyright (c) University of Maryland
// Distributed under the terms of the Modified BSD License.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetModel = void 0;
const events_1 = require("events");
/* Used for CSS Element queries */
const ElementQueries_1 = __importDefault(require("css-element-queries/src/ElementQueries"));
ElementQueries_1.default.listen();
ElementQueries_1.default.init();
require("../css/widget.css");
const defaultModelProperties = {
    value: [],
    env_variables: [],
};
class WidgetModel {
    constructor() {
        this.state = {};
        this.eventEmitter = new events_1.EventEmitter();
    }
    // Get a property value
    get(name) {
        return this.state[name];
    }
    // Set a property value and emit a change event
    set(name, value, options) {
        this.state[name] = value;
        this.eventEmitter.emit(`change:${name}`, { name, value, options });
    }
    // Subscribe to an event
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    // Unsubscribe from an event
    unbind(event, callback) {
        this.eventEmitter.off(event, callback);
    }
    // Save changes (no-op for standalone usage)
    save_changes() {
        console.log('Changes saved:', this.state);
    }
}
exports.WidgetModel = WidgetModel;
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
//# sourceMappingURL=widget.js.map