/// <reference path="../../../adonis-typings/index.d.ts" />
/**
 * A proxy trap to add support for custom getters and setters
 */
export declare const proxyHandler: {
    get(target: any, key: any, receiver: any): any;
    set(target: any, key: any, value: any, receiver: any): boolean;
};
