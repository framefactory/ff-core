/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Readonly, TypeOf } from "../types";
import uniqueId from "../uniqueId";
import Publisher, { IPublisherEvent } from "../Publisher";

import Component, { ComponentOrType, getType } from "./Component";
import System from "./System";

////////////////////////////////////////////////////////////////////////////////

const _EMPTY_ARRAY = [];

/**
 * Emitted by [[Entity]] after the instance's state has changed.
 * @event
 */
export interface IEntityChangeEvent extends IPublisherEvent<Entity>
{
    what: "name"
}

/**
 * Emitted by [[Entity]] when a component is added to or removed from the entity.
 * @event
 */
export interface IEntityComponentEvent extends IPublisherEvent<Entity>
{
    add: boolean;
    remove: boolean;
    component: Component;
}

/**
 * Emitted by [[Entity]] before the instance is disposed.
 * @event
 */
export interface IEntityDisposeEvent extends IPublisherEvent<Entity> {}

export interface ISerializedEntity
{
    id: string;
    name: string;
}

/**
 * Entity in an entity/component system.
 *
 * ### Events
 * - *"change"* - emits [[IEntityChangeEvent]] after the instance's state has changed.
 * - *"<Type>"* - emits [[IEntityComponentEvent]] when a component is added to or removed.
 * - *"dispose"* - emits [[IEntityDisposeEvent]] before the instance is disposed.
 *
 * ### See also
 * - [[Component]]
 * - [[System]]
 */
export default class Entity extends Publisher<Entity>
{
    public readonly id: string;
    public system: System;

    private _name: string;

    private _componentList: Component[];
    private _componentsByType: { [id:string]: Component[] };

    constructor(id?: string)
    {
        super();
        this.addEvents("component", "change", "dispose");

        this.id = id || uniqueId(8);
        this.system = null;

        this._name = "";

        this._componentList = [];
        this._componentsByType = {};
    }

    init(system: System)
    {
        this.system = system;
        system.addEntity(this);
    }

    /**
     * Must be called to delete/destroy the entity. This unregisters the entity
     * and all its components from the system. Emits an [[IEntityDisposeEvent]] before disposal.
     */
    dispose()
    {
        this.emit<IEntityDisposeEvent>("dispose");

        const componentList = this._componentList.slice();
        componentList.forEach(component => component.dispose());

        this.system.removeEntity(this);
    }

    /**
     * Returns the name of this entity.
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * Sets the name of this entity.
     * This emits an [[IEntityChangeEvent]]
     * @param {string} value
     */
    set name(value: string)
    {
        this._name = value;
        this.emit<IEntityChangeEvent>("change", { what: "name" });
    }

    /**
     * Creates and returns a new entity.
     * @param {string} name
     * @returns {Entity}
     */
    createEntity(name?: string): Entity
    {
        return this.system.createEntity(name);
    }

    /**
     * Creates a new component of the given type. Adds it to this entity.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    createComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string)
    {
        return this.system.createComponent(this, componentOrType, name);
    }

    /**
     * Creates a new component only if a component of this type doesn't exist yet in this entity.
     * Otherwise returns the existing component.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    getOrCreateComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string)
    {
        const component = this.getComponent(componentOrType);
        if (component) {
            return component;
        }

        return this.createComponent(componentOrType, name);
    }

    /**
     * Adds a component to this entity. Called automatically by the component's constructor.
     * @param {Component} component
     */
    addComponent(component: Component)
    {
        if (component.isSystemSingleton() && this.hasComponents(component, true)) {
            throw new Error(`only one component of type '${component.type}' allowed per system`);
        }
        if (component.isEntitySingleton() && this.hasComponents(component)) {
            throw new Error(`only one component of type '${component.type}' allowed per entity`);
        }

        // add component base types
        let baseType = Object.getPrototypeOf(component);
        while((baseType = Object.getPrototypeOf(baseType)).type !== Component.type) {
            this.addBaseComponent(component, baseType);
        }

        // add component and actual type
        this._componentList.push(component);
        this.getComponentArrayByType(component.type).push(component);

        // add to system
        this.system.addComponent(component);

        // notify sibling components in entity
        this._componentList.forEach(sibling => {
            if (sibling !== component) {
                sibling.didAddComponent(component);
            }
        });

        this.emit<IEntityComponentEvent>("component", { add: true, remove: false, component });
    }

    /**
     * Removes a component from this entity. Called automatically by the component's dispose() method.
     * @param {Component} component
     * @returns {boolean}
     */
    removeComponent(component: Component): boolean
    {
        // ensure component is registered
        let index = this._componentList.indexOf(component);
        if (index < 0) {
            return false;
        }

        // notify sibling components in entity
        this._componentList.forEach(sibling => {
            if (sibling !== component) {
                sibling.willRemoveComponent(component);
            }
        });

        // remove from system
        this.system.removeComponent(component);

        // remove component and actual type
        this._componentList.splice(index, 1);

        const components = this._componentsByType[component.type];
        index = components.indexOf(component);
        components.splice(index, 1);

        // remove component base types
        let baseType = Object.getPrototypeOf(component);
        while((baseType = Object.getPrototypeOf(baseType)).typeId !== Component.type) {
            this.removeBaseComponent(component, baseType);
        }

        this.emit<IEntityComponentEvent>("component", { add: false, remove: true, component });

        return true;
    }

    /**
     * Returns true if there are components (of a certain type if given) in this entity
     * or in the entire entity-component system (if global is set to true).
     * @param {ComponentOrType} componentOrType
     * @param {boolean} global
     * @returns {boolean}
     */
    hasComponents(componentOrType: ComponentOrType, global?: boolean): boolean
    {
        if (global) {
            return this.system.hasComponents(componentOrType);
        }

        const components = this._componentsByType[getType(componentOrType)];
        return components && components.length > 0;
    }

    /**
     * Returns the number of components (of a certain type if given) in this entity
     * or in the entire entity-component system (if global is set to true).
     * @param {ComponentOrType} componentOrType
     * @param {boolean} global
     * @returns {boolean}
     */
    countComponents(componentOrType?: ComponentOrType, global?: boolean): number
    {
        if (global) {
            return this.system.countComponents(componentOrType);
        }

        const components = componentOrType ? this._componentsByType[getType(componentOrType)] : this._componentList;
        return components ? components.length : 0;
    }

    /**
     * Returns an array of components of a specific type if given. Includes components
     * from all entities if global is set to true.
     * @param {ComponentOrType} componentOrType If given only returns components of the given type.
     * @param {boolean} global If true, includes components from all entities.
     * @returns {T[]}
     */
    getComponents<T extends Component>(componentOrType?: ComponentOrType<T> | T, global?: boolean): Readonly<T[]>
    {
        if (componentOrType) {
            if (global) {
                return this.system.getComponents<T>(componentOrType);
            }

            return (this._componentsByType[getType(componentOrType)] || _EMPTY_ARRAY) as T[];
        }

        return this._componentList as T[];
    }

    /**
     * Returns the first found component of the given type.
     * @param {ComponentOrType<T>} componentOrType Type of component to return.
     * @param {boolean} global If true, includes components from all entities.
     * @returns {T | undefined}
     */
    getComponent<T extends Component>(componentOrType: ComponentOrType<T> | T, global?: boolean): T | undefined
    {
        if (global) {
            return this.system.getComponent<T>(componentOrType);
        }

        const components = this._componentsByType[getType(componentOrType)];
        return components ? components[0] as T : undefined;
    }

    /**
     * Returns the component with the given identifier from all entities in the system.
     * @param {string} id Identifier of the entity to retrieve.
     * @returns {T | undefined}
     */
    getComponentById<T extends Component>(id: string): T | undefined
    {
        return this.system.getComponentById(id);
    }

    /**
     * Returns the first component of the given type with the given name.
     * Searches components from all entities if global is set to true.
     * @param {string} name
     * @param {ComponentOrType<T>} componentOrType
     * @param {boolean} global If true, searches components from all entities.
     * @returns {T | undefined}
     */
    findComponentByName<T extends Component>(
        name: string, componentOrType?: ComponentOrType<T>, global?: boolean): T | undefined
    {
        if (global) {
            return this.system.findComponentByName<T>(name, componentOrType);
        }

        return this._componentList.find(component =>
            component.name === name && (!componentOrType || component.type === getType(componentOrType))
        ) as T;
    }

    toJSON(): ISerializedEntity
    {
        return {
            id: this.id,
            name: this._name
        }
    }

    toString(verbose: boolean = false)
    {
        const text = `Entity '${this.name}' - ${this.countComponents()} components`;

        if (verbose) {
            return text + "\n" + this._componentList.map(component => "  " + component.toString()).join("\n");
        }

        return text;
    }

    /**
     * Registers a component under the given base class. The component can then also be
     * retrieved by specifying the base class in getComponent(s) methods.
     * Called by a component's base class constructor.
     * @param {Component} component
     * @param {ComponentOrType} baseType
     */
    protected addBaseComponent(component: Component, baseType: ComponentOrType)
    {
        this.getComponentArrayByType(getType(baseType)).push(component);
        this.system.addBaseComponent(component, baseType);
    }

    /**
     * Unregisters the base class of a component.
     * Called by a component's base class dispose method.
     * @param {Component} component
     * @param {ComponentOrType} baseType
     */
    protected removeBaseComponent(component: Component, baseType: ComponentOrType)
    {
        const components = this._componentsByType[getType(baseType)];
        const index = components.indexOf(component);
        components.splice(index, 1);

        this.system.removeBaseComponent(component, baseType);
    }

    protected getComponentArrayByType(type: string): Component[]
    {
        let components = this._componentsByType[type];

        if (!components) {
            components = this._componentsByType[type] = [];
        }

        return components;
    }
}
