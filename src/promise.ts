/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

// export const timed = function<T>(promise: Promise<T>, timeout: number, timeoutMessage?: string) {
//     return Promise.race<Promise<T>>([
//         promise,
//         new Promise((_resolve, reject) => setTimeout(
//             () => reject(new Error(timeoutMessage || "timeout")),
//             timeout,
//         )),
//     ]);
// }

export type SettlementState = "pending" | "resolved" | "rejected";

export class Settlement<T>
{
    private _promise: Promise<T>;
    private _resolve: (value: T | PromiseLike<T>) => void;
    private _reject: (reason?: any) => void;
    private _state: SettlementState = "resolved";

    constructor()
    {
        this.reset();
    }

    get promise(): Promise<T> {
        return this._promise;
    }

    get state(): SettlementState {
        return this._state;
    }

    reset(): this
    {
        if (this._state !== "pending") {
            this._promise = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
            this._state = "pending";
        }
    
        return this;
    }

    resolve(arg?: T): this
    {
        if (this._state === "pending") {
            this._resolve(arg);
            this._state = "resolved";
        }

        return this;
    }

    reject(reason?: any): this
    {
        if (this._state === "pending") {
            this._reject(reason);
            this._state = "rejected";
        }

        return this;
    }
}