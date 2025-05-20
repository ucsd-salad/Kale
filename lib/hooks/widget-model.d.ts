import { DependencyList } from 'react';
import { WidgetModel, WidgetModelState } from "../widget";
export declare const WidgetModelContext: import("react").Context<WidgetModel | undefined>;
interface ModelCallback {
    (model: WidgetModel, event: Backbone.EventHandler): void;
}
/**
 *
 * @param name property name in the Python model object.
 * @returns model state and set state function.
 */
export declare function useModelState<T extends keyof WidgetModelState>(name: T): [WidgetModelState[T], (val: WidgetModelState[T], options?: any) => void];
/**
 * Subscribes a listener to the model event loop.
 * @param event String identifier of the event that will trigger the callback.
 * @param callback Action to perform when event happens.
 * @param deps Dependencies that should be kept up to date within the callback.
 */
export declare function useModelEvent(event: string, callback: ModelCallback, deps?: DependencyList | undefined): void;
/**
 * An escape hatch in case you want full access to the model.
 * @returns Python model
 */
export declare function useModel(): WidgetModel | undefined;
export {};
