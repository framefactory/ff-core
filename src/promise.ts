/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
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

/**
 * Returns a promise that resolves after the given number of seconds.
 * @param seconds The number of seconds to wait.
 */
export const delay = async function(seconds: number): Promise<void>
{
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000);
    });
}

/**
 * Filters the given array of PromiseSettledResult objects for those that are fulfilled
 * and returns their values.
 * @param results An array of PromiseSettledResult objects.
 * @returns An array of values of fulfilled promises.
 */
export const filterResolvedPromises = function<T>(results: PromiseSettledResult<T>[]): T[]
{
    return results
        .filter(result => result.status === "fulfilled")
        .map((result: PromiseFulfilledResult<T>) => result.value);
}

/**
 * Filters the given array of PromiseSettledResult objects for those that are rejected
 * and returns their reasons.
 * @param results An array of PromiseSettledResult objects.
 * @returns An array of reasons of rejected promises.
 */
export const filterRejectedPromises = function(results: PromiseSettledResult<any>[]): any[]
{
    return results
        .filter(result => result.status === "rejected")
        .map((result: PromiseRejectedResult) => result.reason);
}

export type SettlementState = "pending" | "resolved" | "rejected";

/**
 * A promise for future value T that can be resolved or rejected from the outside.
 * The promise is created when the Settlement object is created or reset.
 * The promise is resolved or rejected by calling the resolve or reject method.
 * The state of the promise can be queried using the state property.
 */
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

    /** The promise that is resolved or rejected by calling the resolve or reject method. */
    get promise(): Promise<T> {
        return this._promise;
    }

    /** The current state of the promise. */
    get state(): SettlementState {
        return this._state;
    }

    /** Resets the promise to a new pending state. */
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

    /** Resolves the promise with the given value. */
    resolve(arg?: T): this
    {
        if (this._state === "pending") {
            this._resolve(arg);
            this._state = "resolved";
        }

        return this;
    }

    /** Rejects the promise with the given reason. */
    reject(reason?: any): this
    {
        if (this._state === "pending") {
            this._reject(reason);
            this._state = "rejected";
        }

        return this;
    }
}