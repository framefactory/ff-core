/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, TypeOf } from "../types";
import uniqueId from "../uniqueId";
import Publisher, { IPublisherEvent } from "../Publisher";

import Property from "./Property";
import PropertySet, { ILinkable } from "./PropertySet";
import Entity, { IComponentTypeEvent } from "./Entity";
import System, { IUpdateContext, IRenderContext } from "./System";

////////////////////////////////////////////////////////////////////////////////

export interface IComponentEvent<T extends Component = Component> extends IPublisherEvent<T>
{
}

/**
 * Emitted by [[Component]] after the instance's state has changed.
 * @event
 */
export interface IComponentChangeEvent<T extends Component = Component> extends IPublisherEvent<T>
{
    what: string;
}

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

    private _entity: Entity;
    private _type: ComponentOrType<T>;

    constructor(entity: Entity, componentOrType: ComponentOrType<T>,
        didAdd?: (component: T) => void, willRemove?: (component: T) => void) {

        this.didAdd = didAdd;
        this.willRemove = willRemove;

        this._entity = entity;
        this._type = componentOrType;

        entity.addComponentTypeListener(this._type, this.onComponent, this);
        this.component = entity.components.get(componentOrType);

        if (this.component && didAdd) {
            didAdd(this.component);
        }
    }

    dispose()
    {
        this._entity.removeComponentTypeListener(this._type, this.onComponent, this);
    }

    protected onComponent(event: IComponentTypeEvent<T>)
    {
        if (event.add) {
            this.component = event.component;
            this.didAdd(event.component);
        }
        else if (event.remove) {
            this.willRemove(event.component);
            this.component = null;
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
    private readonly _type: string;
    private readonly _system: System;

    constructor(owner: Component, componentOrType?: ComponentOrType<T>) {
        this._type = componentOrType ? getType(componentOrType) : null;
        this._id = componentOrType instanceof Component ? componentOrType.id : undefined;
        this._system = owner.system;
    }

    get component(): T | null {
        return this._id ? this._system.components.getById(this._id) as T || null : null;
    }
    set component(component: T) {
        if (component && this._type && !(component instanceof this._system.registry.getComponentType(this._type))) {
            throw new Error(`can't assign component of type '${(component as Component).type || "unknown"}' to link of type '${this._type}'`);
        }
        this._id = component ? component.id : undefined;
    }
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
    static readonly isModuleSingleton: boolean = false;
    static readonly isSystemSingleton: boolean = false;

    static readonly changeEvent = "change";

    /**
     * Creates a new component and attaches it to the given entity.
     * @param type Type of the component to create.
     * @param entity Entity to attach the component new to.
     * @param id Unique id for the component. Can be omitted, will be created automatically.
     */
    static create<T extends Component = Component>(type: ComponentType<T>, entity: Entity, id?: string): T
    {
        const Ctor = type as TypeOf<T>;
        const component = new Ctor(entity, id);

        component.create();
        entity._addComponent(component);
        return component;
    }

    readonly id: string;
    readonly entity: Entity;

    ins: PropertySet = new PropertySet(this);
    outs: PropertySet = new PropertySet(this);

    changed: boolean = true;

    private _name: string = "";
    private _trackers: ComponentTracker[] = [];

    /**
     * Protected constructor. Use the static [[Component.create]] method instead.
     * @param entity Entity to attach the component new to.
     * @param id Unique id for the component. Can be omitted, will be created automatically.
     */
    constructor(entity: Entity, id?: string)
    {
        super();
        this.addEvents(Component.changeEvent);

        this.id = id || uniqueId();
        this.entity = entity;
    }

    /**
     * Returns the type identifier of this component.
     * @returns {string}
     */
    get type() {
        return (this.constructor as typeof Component).type;
    }

    /**
     * Returns the set of sibling components of this component.
     * Sibling components are components belonging to the same entity.
     */
    get components() {
        return this.entity.components;
    }

    /**
     * Returns the module this component and its entity belong to.
     */
    get module() {
        return this.entity.module;
    }

    /**
     * Returns the system this component and its entity belong to.
     */
    get system(): System {
        return this.entity.system;
    }

    /**
     * Returns the name of this component.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    get isEntitySingleton() {
        return (this.constructor as typeof Component).isEntitySingleton;
    }

    get isModuleSingleton() {
        return (this.constructor as typeof Component).isModuleSingleton;
    }

    get isSystemSingleton() {
        return (this.constructor as typeof Component).isSystemSingleton;
    }

    /**
     * Sets the name of this component.
     * This emits an [[IComponentChangeEvent]].
     * @param {string} value
     */
    set name(value: string)
    {
        this._name = value;
        this.emit<IComponentChangeEvent>(Component.changeEvent, { what: "name" });
    }

    /**
     * Called after construction of the component.
     * Override to perform initialization tasks where you need access to other components.
     */
    create()
    {
    }

    /**
     * Called during each cycle if the component's input properties have changed.
     * Override to update the status of the component based on the input properties.
     * @param context
     * @returns True if the state of the component has been changed during the update.
     */
    update(context: IUpdateContext): boolean
    {
        throw new Error("this should never be called");
    }

    /**
     * Called during each cycle, after the component has been updated.
     * Override to let the component perform regular tasks.
     * @param context
     */
    tick(context: IUpdateContext): boolean
    {
        throw new Error("this should never be called");
    }

    /**
     * Called just before the component is rendered.
     * This function can be called multiple times during each cycle,
     * once for each render target.
     * @param context Information about the render configuration.
     */
    preRender(context: IRenderContext)
    {
        throw new Error("this should never be called");
    }

    /**
     * Called just after the component has been rendered.
     * This function can be called multiple times during each cycle,
     * once for each render target.
     * @param context Information about the render configuration.
     */
    postRender(context: IRenderContext)
    {
        throw new Error("this should never be called");
    }

    /**
     * Removes the component from its entity and deletes it.
     * Emits an [[IComponentDisposeEvent]] before disposal.
     */
    dispose()
    {
        this.unlink();
        this._trackers.forEach(tracker => tracker.dispose());
        this.entity._removeComponent(this);
    }

    in(path: string)
    {
        return this.ins.getProperty(path);
    }

    out(path: string)
    {
        return this.outs.getProperty(path);
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
     * @param name
     */
    createEntity(name?: string): Entity
    {
        return this.module.createEntity(name);
    }

    /**
     * Creates a new component of the given type. Adds it to the same entity as this component.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    createComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string)
    {
        return this.entity.createComponent(componentOrType, name);
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
        const tracker = new ComponentTracker(this.entity, componentOrType, didAdd, willRemove);
        this._trackers.push(tracker);
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

    // is(componentOrType: ComponentOrType)
    // {
    //     return this.type === getType(componentOrType);
    // }

    /**
     * Use "this.ins.append" instead.
     * @deprecated
     * @param {T} props
     * @returns {PropertySet & T}
     */
    protected makeProps<T extends Dictionary<Property>>(props: T): PropertySet & T
    {
        throw new Error("'makeProps' is deprecated. Use 'this.ins.append' instead.");
    }

    deflate()
    {
        const json: any = {
            type: this.type,
            id: this.id
        };

        if (this.name) {
            json.name = this.name;
        }
        const jsonIns = this.ins.deflate();
        if (jsonIns) {
            json.ins = jsonIns;
        }
        const jsonOuts = this.outs.deflate();
        if (jsonOuts) {
            json.outs = jsonOuts;
        }

        return json;
    }

    inflate(json: any)
    {
        if (json.ins) {
            this.ins.inflate(json.ins);
        }
        if (json.outs) {
            this.outs.inflate(json.outs);
        }
    }

    inflateLinks(json: any, linkableDict: Dictionary<ILinkable>)
    {
        if (json.ins) {
            this.ins.inflateLinks(json, linkableDict);
        }
        if (json.outs) {
            this.outs.inflateLinks(json, linkableDict);
        }
    }

    /**
     * Returns a text representation of the component.
     * @returns {string}
     */
    toString()
    {
        return `${this.type}${this.name ? " (" + this.name + ")" : ""}`;
    }
}

Component.prototype.update = null;
Component.prototype.tick = null;
Component.prototype.preRender = null;
Component.prototype.postRender = null;
