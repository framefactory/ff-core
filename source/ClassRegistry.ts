/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Class } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";

////////////////////////////////////////////////////////////////////////////////


export interface IClassEvent extends ITypedEvent<"class">
{
    add: boolean;
    remove: boolean;
    clazz: Class;
}

export default class ClassRegistry extends Publisher
{
    protected _dict: Dictionary<Class> = {};

    constructor()
    {
        super();
        this.addEvent("class");
    }

    add(clazz: Class | Class[])
    {
        if (Array.isArray(clazz)) {
            clazz.forEach(type => this.add(type));
            return;
        }

        const name = clazz.name;
        if (!name) {
            throw new Error("missing class name");
        }

        if (this._dict[name]) {
            throw new Error(`class '${name}' already registered`);
        }

        this._dict[name] = clazz;
        this.emit<IClassEvent>({ type: "class", add: true, remove: false, clazz });
    }

    remove(clazz: Class | Class[])
    {
        if (Array.isArray(clazz)) {
            clazz.forEach(type => this.remove(type));
            return;
        }

        const name = clazz.name;
        if (!name) {
            throw new Error("missing class name");
        }

        if (!this._dict[name]) {
            throw new Error(`class '${name}' not registered`);
        }

        delete this._dict[name];
        this.emit<IClassEvent>({ type: "class", add: false, remove: true, clazz });
    }

    getClass(className: string): Class | undefined
    {
        return this._dict[className];
    }

    createInstance(className: string, ...args)
    {
        const clazz = this._dict[className];
        if (!clazz) {
            throw new Error(`class '${className}' not registered`);
        }

        return new clazz(...args);
    }
}