/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export class Lock
{
    private promise: Promise<void>;
    private resolve: (() => void) | undefined;

    constructor()
    {
        this.promise = Promise.resolve();
        this.resolve = undefined;
    }

    async acquire(): Promise<void>
    {
        await this.promise;
        this.promise = new Promise<void>(resolve => (this.resolve = resolve));
    }

    release()
    {
        this.resolve?.();
    }

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