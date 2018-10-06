/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export default class Registry
{
    constructor()
    {
        this.registry = {};
    }

    getClass(id: string): object
    {
        return this.registry[id] || null;
    }

    createInstance(id: string, ...args: any[]): object
    {
        let constructor = this.registry[id];
        return constructor ? new constructor(...args) : null;
    }

    registerClass(id: string, constructor: object)
    {
        if (!constructor) {
            throw new Error("Missing class constructor");
        }

        if (this.getClass(id)) {
            throw new Error(`Class with id '${id}' already registered`);
        }

        this.registry[id] = constructor;
    }

    private registry;
}