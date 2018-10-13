/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Readonly, TypeOf } from "../types";
import uniqueId from "../uniqueId";
import Publisher, { IPublisherEvent } from "../Publisher";

import System, { ISystemContext } from "./System";
import Entity from "./Entity";
import Properties, { ILinkable } from "./Properties";
import Property, { ISerializedProperty } from "./Property";

////////////////////////////////////////////////////////////////////////////////

export { Entity };

/**
 * Emitted by [[Component]] after the instance's state has changed.
 * @event
 */
export interface IComponentChangeEvent<T extends Component = Component> extends IPublisherEvent<T>
{
    what: string;
}

/**
 * Emitted by [[Component]] before the instance is disposed.
 * @event
 */
export interface IComponentDisposeEvent<T extends Component = Component> extends IPublisherEvent<T> {}

/** The constructor function of a [[Component]]. */
export type ComponentType<T extends Component = Component> = TypeOf<T> & { type: string };

/** A [[Component]] instance, [[Component]] constructor function or a type string. */
export type ComponentOrType<T extends Component = Component> = T | ComponentType<T> | string;

/** Returns the type string of the given [[ComponentOrType]]. */
export function getType<T extends Component>(componentOrType: ComponentOrType<T>): string {
    return typeof componentOrType === "string" ? componentOrType : componentOrType.type;
}

/**
 * Tracks components of a specific type in the same entity.
 * Maintains a reference to the component if found and executes
 * callbacks if the component of the tracked type is added or removed.
 */
export class ComponentTracker<T extends Component = Component>
{
    /** The component being tracked. */
    component: T;
    /** Called after a component has been assigned to the tracker. */
    didAdd: (component: T) => void;
    /** Called before a component is removed from the tracker. */
    willRemove: (component: T) => void;

    constructor(owner: Component, componentOrType: ComponentOrType<T>,
        didAdd?: (component: T) => void, willRemove?: (component: T) => void) {

        this.didAdd = didAdd;
        this.willRemove = willRemove;

        this.component = owner.getComponent(componentOrType);

        if (this.component && didAdd) {
            didAdd(this.component);
        }
    }
}

/**
 * Maintains a weak reference to a component.
 * The reference is set to null after the linked component is removed.
 */
export class ComponentLink<T extends Component = Component>
{
    private _id: string;
    private _type: string;
    private _system: System;

    constructor(owner: Component, componentOrType?: ComponentOrType<T>) {
        this._type = componentOrType ? getType(componentOrType) : null;
        this._id = componentOrType instanceof Component ? componentOrType.id : undefined;
        this._system = owner.system;
    }

    get component(): T | null {
        return this._id ? this._system.getComponentById(this._id) || null : null;
    }
    set component(component: T) {
        if (component && this._type && !(component instanceof this._system.registry.getComponentType(this._type))) {
            throw new Error(`can't assign component of type '${component.type}' to link of type '${this._type}'`);
        }
        this._id = component ? component.id : undefined;
    }
}

export interface ISerializedComponent
{
    id: string;
    entity: string;
    ins: ISerializedProperty[];
    outs: ISerializedProperty[];
}

/**
 * Base class for components in an entity-component system.
 *
 * ### Events
 * - *"change"* - emits [[IComponentChangeEvent]] after the instance's state has changed.
 * - *"dispose"* - emits [[IComponentDisposeEvent]] before the instance is disposed.
 *
 * ### See also
 * - [[ComponentTracker]]
 * - [[ComponentLink]]
 * - [[ComponentType]]
 * - [[ComponentOrType]]
 * - [[Entity]]
 * - [[System]]
 */
export default class Component extends Publisher<Component> implements ILinkable
{
    static readonly type: string = "Component";

    static readonly isEntitySingleton: boolean = true;
    static readonly isSystemSingleton: boolean = false;

    readonly id: string;
    entity: Entity;

    ins: Properties = new Properties(this);
    outs: Properties = new Properties(this);

    changed: boolean = true;
    private _name: string = "";

    private _tracked: Dictionary<ComponentTracker> = {};


    constructor(id?: string)
    {
        super();
        this.addEvents("change", "dispose");

        this.id = id || uniqueId();
        this.entity = null;
    }

    init(entity: Entity)
    {
        this.entity = entity;
        entity.addComponent(this);

        this.create();
    }

    /**
     * Returns the type identifier of this component.
     * @returns {string}
     */
    get type()
    {
        return (this.constructor as typeof Component).type;
    }

    /**
     * Returns the entity component system this component and its entity belong to.
     * @returns {System}
     */
    get system()
    {
        return this.entity.system;
    }

    /**
     * Returns the name of this component.
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * Sets the name of this component.
     * This emits an [[IComponentChangeEvent]].
     * @param {string} value
     */
    set name(value: string)
    {
        this._name = value;
        this.emit<IComponentChangeEvent>("change", { what: "name" });
    }

    /**
     * Called after construction of the component.
     * Perform initialization tasks where you need access to other components.
     */
    create()
    {
    }

    update(context: ISystemContext)
    {
    }

    tick(context: ISystemContext)
    {
    }

    destroy()
    {
    }

    /**
     * Removes the component from its entity and deletes it.
     * Emits an [[IComponentDisposeEvent]] before disposal.
     */
    dispose()
    {
        this.emit<IComponentDisposeEvent>("dispose");

        this.destroy();
        this.unlink();
        this.entity.removeComponent(this);
    }

    inflate()
    {

    }

    deflate()
    {

    }

    in(path: string)
    {
        return this.ins.getProperty(path).property;
    }

    out(path: string)
    {
        return this.outs.getProperty(path).property;
    }

    setValue(path: string, value: any)
    {
        const prop = this.ins.properties.find(prop => prop.path === path);
        if (!prop) {
            throw new Error(`property '${path}' not found on '${this.name}': `);
        }

        prop.setValue(value);
    }

    getValue(path: string): any
    {
        const prop = this.ins.properties.find(prop => prop.path === path);
        if (!prop) {
            throw new Error(`property '${path}' not found on '${this.name}': `);
        }

        return prop.value;
    }

    unlink()
    {
        this.ins.properties.forEach(property => property.unlink());
        this.outs.properties.forEach(property => property.unlink());
    }

    resetChanged()
    {
        this.changed = false;
        const ins = this.ins.properties;
        for (let i = 0, n = ins.length; i < n; ++i) {
            ins[i].changed = false;
        }
    }

    /**
     * Convenience function, creates and returns a new entity.
     * @param {string} name
     * @returns {Entity}
     */
    createEntity(name?: string): Entity
    {
        return this.system.createEntity(name);
    }

    /**
     * Creates a new component of the given type. Adds it to the same entity as this component.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    createComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string)
    {
        return this.system.createComponent(this.entity, componentOrType, name);
    }

    /**
     * Returns true if there are components (of a certain type if given) in the parent entity
     * or in the entire entity-component system (if global is set to true).
     * @param {ComponentOrType} componentOrType
     * @param {boolean} global
     * @returns {boolean}
     */
    hasComponents(componentOrType: ComponentOrType, global?: boolean): boolean
    {
        return this.entity.hasComponents(componentOrType, global);
    }

    /**
     * Returns the number of components (of a certain type if given) in the parent entity
     * or in the entire entity-component system (if global is set to true).
     * @param {ComponentOrType} componentOrType
     * @param {boolean} global
     * @returns {boolean}
     */
    countComponents(componentOrType?: ComponentOrType, global?: boolean): number
    {
        return this.entity.countComponents(componentOrType, global);
    }

    /**
     * Returns an array of components of a specific type if given. Includes components
     * from all entities if global is set to true.
     * @param {ComponentOrType<T>} componentOrType If given only returns components of the given type.
     * @param {boolean} global If true, includes components from all entities.
     * @returns {T[]}
     */
    getComponents<T extends Component>(componentOrType?: ComponentOrType<T> | T, global?: boolean): Readonly<T[]>
    {
        return this.entity.getComponents<T>(componentOrType, global);
    }

    /**
     * Returns the first found component of the given type in the parent entity
     * or in the entire entity-component system if global is set to true.
     * @param {ComponentOrType<T>} componentOrType Type of component to return.
     * @param {boolean} global If true, includes components from all entities.
     * @returns {T | undefined}
     */
    getComponent<T extends Component>(componentOrType: ComponentOrType<T> | T, global?: boolean): T | undefined
    {
        return this.entity.getComponent<T>(componentOrType, global);
    }

    /**
     * Tracks the given component type. If a component of this type is added
     * to or removed from the entity, it will be added or removed from the tracker.
     * @param {ComponentOrType} componentOrType
     * @param {(component: T) => void} didAdd
     * @param {(component: T) => void} willRemove
     */
    trackComponent<T extends Component>(componentOrType: ComponentOrType<T>,
        didAdd?: (component: T) => void, willRemove?: (component: T) => void): ComponentTracker<T>
    {
        const type = getType(componentOrType);
        if (this._tracked[type]) {
            throw new Error(`component type already tracked: '${type}'`);
        }

        const tracker = new ComponentTracker(this, componentOrType, didAdd, willRemove);
        this._tracked[type] = tracker;
        return tracker;
    }

    /**
     * Returns a weak reference to a component.
     * The reference is set to null after the linked component is removed.
     */
    linkComponent<T extends Component>(component: T): ComponentLink<T>
    {
        return new ComponentLink<T>(this, component);
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
        return this.entity.findComponentByName(name, componentOrType, global);
    }

    is(componentOrType: ComponentOrType)
    {
        return this.type === getType(componentOrType);
    }

    isEntitySingleton()
    {
        return (this.constructor as typeof Component).isEntitySingleton;
    }

    isSystemSingleton()
    {
        return (this.constructor as typeof Component).isSystemSingleton;
    }

    /**
     * Called after a component was added to the parent entity.
     * @param {Component} component
     */
    didAddComponent(component: Component)
    {
        const tracker = this._tracked[component.type];
        if (tracker && !tracker.component) {
            tracker.component = component;
            tracker.didAdd && tracker.didAdd(component);
        }
    }

    /**
     * Called before a component is removed from the parent entity.
     * @param {Component} component
     */
    willRemoveComponent(component: Component)
    {
        const tracker = this._tracked[component.type];
        if (tracker && tracker.component === component) {
            tracker.willRemove && tracker.willRemove(component);
            tracker.component = null;
        }
    }

    /**
     * Returns a text representation of this object.
     * @returns {string}
     */
    toString()
    {
        return `${this.type}${this.name ? " (" + this.name + ")" : ""}`;
    }

    protected makeProps<T extends Dictionary<Property>>(props: T): Properties & T
    {
        return new Properties(this, props) as Properties & T;
    }

    protected mergeProps<T extends Dictionary<Property>, U extends Dictionary<Property>>(propsA: Properties & T, propsB: U): Properties & T & U
    {
        return propsA.merge(propsB) as Properties & T & U
    }
}
