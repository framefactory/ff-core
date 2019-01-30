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
    classType: Class;
}

export default class ClassRegistry extends Publisher
{
    protected _dict: Dictionary<Class> = {};

    constructor()
    {
        super();
        this.addEvent("class");
    }

    add(classType: Class | Class[])
    {
        if (Array.isArray(classType)) {
            classType.forEach(type => this.add(type));
            return;
        }

        const name = classType.name;
        if (!name) {
            throw new Error("missing class name");
        }

        if (this._dict[name]) {
            throw new Error(`class '${name}' already registered`);
        }

        this._dict[name] = classType;
        this.emit<IClassEvent>({ type: "class", add: true, remove: false, classType });
    }

    remove(classType: Class | Class[])
    {
        if (Array.isArray(classType)) {
            classType.forEach(type => this.remove(type));
            return;
        }

        const name = classType.name;
        if (!name) {
            throw new Error("missing class name");
        }

        if (!this._dict[name]) {
            throw new Error(`class '${name}' not registered`);
        }

        delete this._dict[name];
        this.emit<IClassEvent>({ type: "class", add: false, remove: true, classType });
    }

    getClass(className: string | object | Class): Class | undefined
    {
        if (typeof className === "function") {
            className = className.name;
        }
        else if (typeof className === "object") {
            className = className.constructor.name;
        }

        return this._dict[className];
    }

    createInstance(className: string | object | Class, ...args)
    {
        const clazz = this.getClass(className);
        if (!clazz) {
            throw new Error(`class '${className}' not registered`);
        }

        return new clazz(...args);
    }
}