/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Type } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";

////////////////////////////////////////////////////////////////////////////////


export interface IRegistryChangeEvent extends ITypedEvent<"change">
{
    add: boolean;
    remove: boolean;
    typeObject: Type;
}

export default class TypeRegistry extends Publisher
{
    protected _dict: Dictionary<Type> = {};

    constructor()
    {
        super();
    }

    add(type: Type | Type[])
    {
        if (Array.isArray(type)) {
            type.forEach(type => this.add(type));
            return;
        }

        const name = type.name;
        if (!name) {
            throw new Error("missing type name");
        }

        if (this._dict[name]) {
            throw new Error(`type '${name}' already registered`);
        }

        this._dict[name] = type;
        this.emit<IRegistryChangeEvent>({ type: "change", add: true, remove: false, typeObject: type });
    }

    remove(type: Type | Type[])
    {
        if (Array.isArray(type)) {
            type.forEach(type => this.add(type));
            return;
        }

        const name = type.name;
        if (!name) {
            throw new Error("missing type name");
        }

        if (!this._dict[name]) {
            throw new Error(`type '${name}' not registered`);
        }

        delete this._dict[name];
        this.emit<IRegistryChangeEvent>({ type: "change", add: false, remove: true, typeObject: type });
    }

    getType(name: string)
    {
        return this._dict[name];
    }

    createInstance(name: string)
    {
        const type = this._dict[name];
        if (!type) {
            throw new Error(`type '${name}' not registered`);
        }

        return new type();
    }
}