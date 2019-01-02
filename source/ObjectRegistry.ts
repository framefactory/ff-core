/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, TypeOf } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";

////////////////////////////////////////////////////////////////////////////////

const _EMPTY_ARRAY = [];

type ClassOrName<T extends object = object> = TypeOf<T> | string;
type ObjectOrClassOrName<T extends object = object> = TypeOf<T> | T | string;

export interface IRegistryChangeEvent<T extends object = object> extends ITypedEvent<string>
{
    add: boolean;
    remove: boolean;
    object: T;
}

export default class ObjectRegistry<T extends object = object> extends Publisher
{
    protected _baseTypeName: string;
    protected _dict: Dictionary<T> = {};
    protected _list: T[];
    protected _typeDict = new Map<TypeOf<T>, T[]>();

    constructor(baseType?: TypeOf<T>)
    {
        super({ knownEvents: false });

        if (baseType && !baseType.name) {
            throw new Error("invalid base type");
        }

        this._baseTypeName = baseType ? baseType.name : Object.name;
        this._list = this._typeDict[this._baseTypeName] = [];
    }

    /**
     * Adds an object to the registry. The object is registered under its actual type
     * and all base types in its prototype chain. An [[IRegistryChangeEvent]] is emitted
     * for each type the
     * @param object
     */
    add(object: T)
    {
        const id = (object as any).id;
        if (typeof id === "string") {
            if (this._dict[id] === object) {
                throw new Error("object already registered");
            }
            this._dict[id] = object;
        }

        const event = { type: null, add: true, remove: false, object };

        // file under all types in prototype chain
        let prototype = object;
        const baseTypeName = this._baseTypeName;

        do {
            prototype = Object.getPrototypeOf(prototype);
            const name = prototype.constructor.name;
            (this._typeDict[name] || (this._typeDict[name] = [])).push(object);

            event.type = name;
            this.emit<IRegistryChangeEvent>(event);

        } while (name !== baseTypeName);
    }

    /**
     * Removes an object from the registry.
     * @param object
     */
    remove(object: T)
    {
        const id = (object as any).id;
        if (typeof id === "string") {
            if (this._dict[id] !== object) {
                throw new Error("object not registered");
            }
            delete this._dict[id];
        }

        const event = { type: null, add: false, remove: true, object };

        // remove from types in prototype chain
        let prototype = object;
        const baseTypeName = this._baseTypeName;

        do {
            prototype = Object.getPrototypeOf(prototype);
            const name = prototype.constructor.name;
            const objects = this._typeDict[name];
            const index = objects.indexOf(object);
            objects.splice(index, 1);

            event.type = name;
            this.emit<IRegistryChangeEvent>(event);

        } while(name !== baseTypeName);
    }

    clear()
    {
        const objects = this._list.slice();
        objects.forEach(object => this.remove(object));
    }

    get length() {
        return this._list.length;
    }

    has<U extends T>(item: ObjectOrClassOrName<U>): boolean
    {
        if (typeof item === "function") {
            const objects = this._typeDict[item.name];
            return objects && objects.length > 0;
        }
        if (typeof item === "string") {
            const objects = this._typeDict[item];
            return objects && objects.length > 0;
        }

        const id = (item as any).id;
        if (typeof id === "string") {
            return !!this._typeDict[id];
        }

        const objects = this._typeDict[item.constructor.name];
        return objects && objects.indexOf(item) >= 0;
    }

    count(classOrName?: ClassOrName): number
    {
        const objects = this._typeDict[this.getClassName(classOrName)];
        return objects ? objects.length : 0;
    }

    get<U extends T = T>(classOrName?: ClassOrName<U>): U | undefined
    {
        const objects = this._typeDict[this.getClassName(classOrName)];
        return objects ? objects[0] : undefined;
    }

    getArray<U extends T = T>(classOrName?: ClassOrName<U>): U[]
    {
        const objects = this._typeDict[this.getClassName(classOrName)];
        return objects || _EMPTY_ARRAY;
    }

    cloneArray<U extends T = T>(classOrName: ClassOrName<U>): U[]
    {
        return this.getArray(classOrName).slice();
    }

    getById(id: string): T | undefined
    {
        return this._typeDict[id];
    }

    protected getClassName(classOrName?: ClassOrName)
    {
        return typeof classOrName === "function" ? classOrName.name : (classOrName || this._baseTypeName);
    }
}