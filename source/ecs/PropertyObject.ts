/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export default class PropertyObject<T>
{
    static readonly type: string = "Object";

    object: T;

    constructor(payload?: T)
    {
        this.object = payload || null;
    }

    get type(): string
    {
        return (this.constructor as typeof PropertyObject).type;
    }

    toString(): string
    {
        return this.type;
    }
}