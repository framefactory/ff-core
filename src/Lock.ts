/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

/**
 * Implements a simple lock that can be acquired and released.
 * The `guard` method can be used to execute a function within the lock.
 * The lock is released when the function returns.
 */
export class Lock
{
    private promise: Promise<void>;
    private resolve: (() => void) | undefined;

    /**
     * Creates a new Lock instance.
     */
    constructor()
    {
        this.promise = Promise.resolve();
        this.resolve = undefined;
    }

    /**
     * Acquires the lock. Returns a promise that resolves when the lock is acquired.
     */
    async acquire(): Promise<void>
    {
        await this.promise;
        this.promise = new Promise<void>(resolve => (this.resolve = resolve));
    }

    /**
     * Releases the lock.
     */
    release()
    {
        this.resolve?.();
    }

    /**
     * Executes the given function within the lock. The lock is released when the function returns.
     * Example:
     * ```
     * const lock = new Lock();
     * 
     * async function myFunction(): Promise<void>
     * {
     *    await lock.guard(async () => {
     *       // do something
     *   });
     * }
     * ```
     * @param fn The function to execute within the lock.
     * @returns A promise with the result of the function.
     */
    async guard<T>(fn: () => Promise<T>): Promise<T>
    {
        await this.acquire();
        
        try {
            return await fn();
        }
        finally {
            this.release();
        }
    }
}