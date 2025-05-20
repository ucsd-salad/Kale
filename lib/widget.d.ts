import '../css/widget.css';
declare const defaultModelProperties: {
    value: never[];
    env_variables: never[];
};
export type WidgetModelState = typeof defaultModelProperties;
export declare class WidgetModel {
    private state;
    private eventEmitter;
    get(name: string): any;
    set(name: string, value: any, options?: any): void;
    on(event: string, callback: (event: any) => void): void;
    unbind(event: string, callback: (event: any) => void): void;
    save_changes(): void;
}
export {};
