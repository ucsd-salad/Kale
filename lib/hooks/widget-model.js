"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetModelContext = void 0;
exports.useModelState = useModelState;
exports.useModelEvent = useModelEvent;
exports.useModel = useModel;
const react_1 = require("react");
exports.WidgetModelContext = (0, react_1.createContext)(undefined);
// HOOKS
//============================================================================================
/**
 *
 * @param name property name in the Python model object.
 * @returns model state and set state function.
 */
function useModelState(name) {
    const model = useModel();
    const [state, setState] = (0, react_1.useState)(model === null || model === void 0 ? void 0 : model.get(name));
    useModelEvent(`change:${name}`, (model) => {
        setState(model.get(name));
    }, [name]);
    function updateModel(val, options) {
        model === null || model === void 0 ? void 0 : model.set(name, val, options);
        model === null || model === void 0 ? void 0 : model.save_changes();
    }
    return [state, updateModel];
}
/**
 * Subscribes a listener to the model event loop.
 * @param event String identifier of the event that will trigger the callback.
 * @param callback Action to perform when event happens.
 * @param deps Dependencies that should be kept up to date within the callback.
 */
function useModelEvent(event, callback, deps) {
    const model = useModel();
    const dependencies = deps === undefined ? [model] : [...deps, model];
    (0, react_1.useEffect)(() => {
        const callbackWrapper = (e) => model && callback(model, e);
        model === null || model === void 0 ? void 0 : model.on(event, callbackWrapper);
        return () => void (model === null || model === void 0 ? void 0 : model.unbind(event, callbackWrapper));
    }, dependencies);
}
/**
 * An escape hatch in case you want full access to the model.
 * @returns Python model
 */
function useModel() {
    return (0, react_1.useContext)(exports.WidgetModelContext);
}
//# sourceMappingURL=widget-model.js.map