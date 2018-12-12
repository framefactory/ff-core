/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Readonly } from "../types";
import Publisher, { IPublisherEvent } from "../Publisher";

import { ILinkable } from "./PropertySet";
import Component, { ComponentOrType, getType } from "./Component";

////////////////////////////////////////////////////////////////////////////////

const _EMPTY_ARRAY = [];

export interface ILinkableSorter
{
    sort(linkables: ILinkable[]): ILinkable[];
}

export interface IComponentTypeEvent<T extends Component = Component>
    extends IPublisherEvent<ComponentSet>
{
    add: boolean;
    remove: boolean;
    component: T;
}

export default class ComponentSet extends Publisher<ComponentSet>
{
    protected _typeDict: Dictionary<Component[]> = {};
    protected _dict: Dictionary<Component> = {};
    protected _list: Component[] = [];

    constructor()
    {
        super({ knownEvents: false });
    }

    /**
     * Adds a new component to the set.
     * @param {Component} component
     */
    _add(component: Component)
    {
        if (this._dict[component.id]) {
            throw new Error("component already registered");
        }

        // add component
        this._list.push(component);
        this._dict[component.id] = component;

        const event: IComponentTypeEvent = { add: true, remove: false, component, sender: this };

        // add to actual type
        let type = component.type;
        (this._typeDict[type] || (this._typeDict[type] = [])).push(component);
        this.emit(type, event);

        // add to base types
        let baseType = Object.getPrototypeOf(component);
        while((baseType = Object.getPrototypeOf(baseType)).type !== Component.type) {
            type = baseType.type;
            (this._typeDict[type] || (this._typeDict[type] = [])).push(component);
            this.emit(type, event);
        }
    }

    /**
     * Removes a component from the set.
     * @param component
     */
    _remove(component: Component)
    {
        let index = this._list.indexOf(component);
        if (index < 0) {
            throw new Error("component not found");
        }

        // remove component
        delete this._dict[component.id];
        this._list.splice(index, 1);

        const event: IComponentTypeEvent = { add: false, remove: true, component, sender: this };

        // remove from actual type
        let type = component.type;
        const components = this._typeDict[type];
        index = components.indexOf(component);
        components.splice(index, 1);
        this.emit(type, event);

        // remove from base types
        let baseType = Object.getPrototypeOf(component);
        while((baseType = Object.getPrototypeOf(baseType)).type !== Component.type) {
            type = baseType.type;
            const components = this._typeDict[type];
            const index = components.indexOf(component);
            components.splice(index, 1);
            this.emit(type, event);
        }
    }

    get length() {
        return this._list.length;
    }

    sort(sorter: ILinkableSorter)
    {
        console.log("ComponentSet.sort");
        this._list = sorter.sort(this._list) as Component[];
    }

    /**
     * Returns true if there are components (of a certain type if given) in this set.
     * @param componentOrType
     */
    has(componentOrType: ComponentOrType): boolean
    {
        const components = this._typeDict[getType(componentOrType)];
        return components && components.length > 0;
    }

    /**
     * Returns the number of components (of a certain type if given) in this set.
     * @param componentOrType
     */
    count(componentOrType?: ComponentOrType): number
    {
        const components = componentOrType ? this._typeDict[getType(componentOrType)] : this._list;
        return components ? components.length : 0;
    }

    /**
     * Returns an array of components in this set of a specific type if given.
     * @param componentOrType If given only returns components of the given type.
     */
    getArray<T extends Component>(componentOrType?: ComponentOrType<T> | T): Readonly<T[]>
    {
        if (componentOrType) {
            return (this._typeDict[getType(componentOrType)] || _EMPTY_ARRAY) as T[];
        }

        return this._list as T[];
    }

    /**
     * Returns the first found component in this set of the given type.
     * @param componentOrType Type of component to return.
     */
    get<T extends Component>(componentOrType: ComponentOrType<T> | T): T | undefined
    {
        const components = this._typeDict[getType(componentOrType)];
        return components ? components[0] as T : undefined;
    }

    /**
     * Returns the component with the given identifier in this set.
     * @param id Identifier of the entity to retrieve.
     */
    getById(id: string): Component | undefined
    {
        return this._dict[id];
    }

    /**
     * Returns the first component of the given type with the given name.
     * @param name
     * @param componentOrType
     */
    findByName<T extends Component>(name: string, componentOrType?: ComponentOrType<T>): T | undefined
    {
        const type = componentOrType ? getType(componentOrType) : null;

        return this._list.find(component =>
            component.name === name && (!type || component.type === type)
        ) as T;
    }
}