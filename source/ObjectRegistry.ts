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

export const getClassName = function(scope: ObjectOrClassOrName): string
{
    return typeof scope === "function" ? scope.name : (typeof scope === "object"
        ? scope.constructor.name : scope);
}

export type ClassOrName<T extends object = object> = TypeOf<T> | string;
export type ObjectOrClassOrName<T extends object = object> = TypeOf<T> | T | string;

export interface IObjectEvent<T extends object = object> extends ITypedEvent<string>
{
    add: boolean;
    remove: boolean;
    object: T;
}

/**
 * Registry of object instances, grouped by their classes and base classes.
 */
export default class ObjectRegistry<T extends object = object> extends Publisher
{
    protected _rootClassName: string;

    protected _objLists: Dictionary<T[]>;
    protected _objDict: Dictionary<T>;

    constructor(rootClass?: TypeOf<T>)
    {
        super({ knownEvents: false });

        if (rootClass && !rootClass.name) {
            throw new Error("root class must be a named constructor function");
        }

        this._rootClassName = rootClass ? rootClass.name : Object.name;

        this._objLists = { [this._rootClassName]: [] };
        this._objDict = {};
    }

    /**
     * Adds an object to the registry. The object is registered under its actual class
     * and all base classes in its prototype chain. An [[IObjectEvent]] is emitted
     * for each class in the object's prototype chain.
     * @param object
     */
    add(object: T)
    {
        const id = (object as any).id;
        if (typeof id === "string") {

            if (this._objDict[id] !== undefined) {
                throw new Error("object already registered");
            }

            // add component to id dictionary
            this._objDict[id] = object;
        }

        let prototype: any = object;
        let className;
        const rootClassName = this._rootClassName;

        const event = { type: "", add: true, remove: false, object };

        // add all types in prototype chain
        do {
            prototype = Object.getPrototypeOf(prototype);
            className = prototype.constructor.name;

            if (className) {
                (this._objLists[className] || (this._objLists[className] = [])).push(object);

                event.type = className;
                this.emit<IObjectEvent>(event);
            }

        } while (className !== rootClassName);
    }

    /**
     * Removes an object from the registry.
     * @param object
     */
    remove(object: T)
    {
        const id = (object as any).id;
        if (typeof id === "string") {

            if (this._objDict[id] !== object) {
                throw new Error("object not registered");
            }

            // remove component
            delete this._objDict[id];
        }

        let prototype: any = object;
        let className;
        const rootClassName = this._rootClassName;
        const event = { type: "", add: false, remove: true, object };

        // remove all types in prototype chain
        do {
            prototype = Object.getPrototypeOf(prototype);
            className = prototype.constructor.name;

            if (className) {
                const objects = this._objLists[className];
                objects.splice(objects.indexOf(object), 1);

                event.type = className;
                this.emit<IObjectEvent>(event);
            }

        } while (className !== rootClassName);
    }

    /**
     * Removes all objects from the registry.
     */
    clear()
    {
        const objects = this.cloneArray();
        objects.forEach(object => this.remove(object));
    }

    /**
     * Returns the total number of objects in the registry.
     */
    get length() {
        return this._objLists[this._rootClassName].length;
    }

    /**
     * Returns the number of objects (of a certain class or class name if given) in the registry.
     * @param scope Optional class or class name whose instances should be counted.
     */
    count(scope?: ObjectOrClassOrName): number
    {
        const objects = this._objLists[this.getClassName(scope)];
        return objects ? objects.length : 0;
    }

    /**
     * Returns true if the registry contains objects (of a given class or class name) or the given instance.
     * @param scope A class, class name, or an instance of a class.
     */
    has<U extends T>(scope: ObjectOrClassOrName<U>): boolean
    {
        if (typeof scope === "function") {
            const objects = this._objLists[scope.name];
            return !!objects && objects.length > 0;
        }
        if (typeof scope === "string") {
            const objects = this._objLists[scope];
            return !!objects && objects.length > 0;
        }

        const id = (scope as any).id;
        if (typeof id === "string") {
            return !!this._objDict[id];
        }

        const objects = this._objLists[scope.constructor.name];
        return objects && objects.indexOf(scope) >= 0;
    }

    /**
     * Returns true if the registry contains the given object.
     * @param object
     */
    contains<U extends T>(object: U): boolean
    {
        const id = (object as any).id;
        if (typeof id === "string") {
            return !!this._objDict[id];
        }

        const objects = this._objLists[object.constructor.name];
        return objects && objects.indexOf(object) >= 0;
    }

    /**
     * Returns the first found instance of the given class or class name.
     * @param scope Class or class name of the instance to return.
     * @param throws If true, the method throws an error if no instance was found.
     */
    get<U extends T = T>(scope?: ObjectOrClassOrName<U>, throws: boolean = false): U | undefined
    {
        const className = this.getClassName(scope);
        const objects = this._objLists[className];
        const object = objects ? objects[0] as U : undefined;

        if (throws && !object) {
            throw new Error(`no instances of class '${className}' in registry`);
        }

        return object;
    }

    /**
     * Returns an array with all instances of the given class or class name.
     * This is a live array, it should not be kept or modified. If you need
     * a storable/editable array, use [[ObjectRegistry.cloneArray]] instead.
     * @param scope Class or class name of the instances to return.
     */
    getArray<U extends T = T>(scope?: ObjectOrClassOrName<U>): Readonly<U[]>
    {
        return this._objLists[this.getClassName(scope)] || _EMPTY_ARRAY;
    }

    /**
     * Returns a cloned array with all instances of the given class or class name.
     * @param scope Class or class name of the instances to return.
     */
    cloneArray<U extends T = T>(scope?: ObjectOrClassOrName<U>): U[]
    {
        return this.getArray(scope).slice();
    }

    /**
     * Returns an object by its id.
     * @param id An object's id.
     */
    getById(id: string): T | undefined
    {
        return this._objDict[id];
    }

    /**
     * Returns a dictionary with all objects in the registry accessible by their ids.
     * The dictionary only contains objects with an 'id' property.
     */
    getDictionary(): Readonly<Dictionary<T>>
    {
        return this._objDict;
    }

    /**
     * Adds a listener for an object add/remove event.
     * @param scope Class, class instance, or class name to subscribe to.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    on<U extends T>(scope: ObjectOrClassOrName<U>, callback: (event: IObjectEvent<U>) => void, context?: object)
    {
        super.on(this.getClassName(scope), callback, context);
    }

    /**
     * Adds a one-time listener for an object add/remove event.
     * @param scope Class, class instance, or class name to subscribe to.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    once<U extends T>(scope: ObjectOrClassOrName<U>, callback: (event: IObjectEvent<U>) => void, context?: object)
    {
        super.once(this.getClassName(scope), callback, context);
    }

    /**
     * Removes a listener for an object add/remove event.
     * @param scope Class, class instance, or class name to subscribe to.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    off<U extends T>(scope: ObjectOrClassOrName<U>, callback: (event: IObjectEvent<U>) => void, context?: object)
    {
        super.off(this.getClassName(scope), callback, context);
    }

    /**
     * Returns the class name for the given instance, class or class name.
     * @param scope
     */
    getClassName(scope?: ObjectOrClassOrName): string
    {
        return typeof scope === "function" ? scope.name : (typeof scope === "object"
            ? scope.constructor.name : (scope || this._rootClassName));
    }
}