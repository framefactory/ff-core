/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary } from "../types";
import uniqueId from "../uniqueId";
import Publisher, { IPublisherEvent } from "../Publisher";

import { ILinkable } from "./PropertySet";
import Component, { ComponentOrType, getType } from "./Component";
import ComponentSet, { IComponentTypeEvent } from "./ComponentSet";
import Module from "./Module";
import System from "./System";

////////////////////////////////////////////////////////////////////////////////

export { IComponentTypeEvent };

/**
 * Emitted by [[Entity]] after the instance's state has changed.
 * @event
 */
export interface IEntityChangeEvent extends IPublisherEvent<Entity>
{
    what: "name"
}

export interface IEntityComponentEvent<T extends Component = Component>
    extends IPublisherEvent<Entity>
{
    add: boolean;
    remove: boolean;
    component: T;
}

/**
 * Entity in an entity/component system.
 *
 * ### Events
 * - *"change"* - emits [[IEntityChangeEvent]] after the instance's state has changed.
 * - *"dispose"* - emits [[IEntityDisposeEvent]] before the instance is disposed.
 *
 * ### See also
 * - [[Component]]
 * - [[System]]
 */
export default class Entity extends Publisher<Entity>
{
    static readonly changeEvent = "change";
    static readonly componentEvent = "component";

    static create(module: Module, id?: string): Entity
    {
        const entity = new Entity(module, id);
        module._addEntity(entity);
        return entity;
    }

    readonly id: string;
    readonly module: Module;
    readonly system: System;
    readonly components: ComponentSet;

    private _name: string;


    constructor(module: Module, id?: string)
    {
        super();
        this.addEvents(Entity.changeEvent, Entity.componentEvent);

        this.id = id || uniqueId(8);

        this.module = module;
        this.system = module.system;
        this.components = new ComponentSet();

        this._name = "";
    }

    /**
     * Must be called to delete/destroy the entity. This unregisters the entity
     * and all its components from the system. Emits an [[IEntityDisposeEvent]] before disposal.
     */
    dispose()
    {
        // dispose components
        const componentList = this.components.getArray().slice();
        componentList.forEach(component => component.dispose());

        // remove entity from system and module
        this.module._removeEntity(this);
    }

    /**
     * Returns the name of this entity.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Sets the name of this entity.
     * This emits an [[IEntityChangeEvent]]
     * @param {string} value
     */
    set name(value: string) {
        this._name = value;
        this.emit<IEntityChangeEvent>(Entity.changeEvent, { what: "name" });
    }

    /**
     * Creates a new component of the given type. Adds it to this entity.
     * @param componentOrType Type of the component to create.
     * @param name Optional name for the component.
     * @param id Optional unique identifier for the component.
     */
    createComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string, id?: string): T
    {
        const component = this.system.registry.createComponent<T>(getType(componentOrType), this, id);

        if (name) {
            component.name = name;
        }

        return component;
    }

    /**
     * Creates a new component only if a component of this type doesn't exist yet in this entity.
     * Otherwise returns the existing component.
     * @param componentOrType Type of the component to create.
     * @param name Optional name for the component.
     */
    getOrCreateComponent<T extends Component>(componentOrType: ComponentOrType<T>, name?: string)
    {
        const component = this.components.get(componentOrType);
        if (component) {
            return component;
        }

        return this.createComponent(componentOrType, name);
    }

    setValue(path: string, value: any);
    setValue(componentOrType: ComponentOrType, path: string, value: any);
    setValue(location, pathOrValue, value?)
    {
        let component: Component;
        let path;

        if (typeof location === "string") {
            const parts = location.split(":");
            component = this.components.findByName(parts[0]) || this.components.get(parts[0]);
            path = parts[1];
            value = pathOrValue;
        }
        else {
            component = this.components.get(location);
            path = pathOrValue;
        }

        if (!component) {
            throw new Error("component not found");
        }
        if (!path) {
            throw new Error("invalid path");
        }

        component.setValue(path, value);
    }

    /**
     * Adds a listener for component add/remove events for a specific component type.
     * @param componentOrType The component type as example object, constructor function or string.
     * @param callback Event handler function.
     * @param context Optional context object on which to call the event handler function.
     */
    addComponentTypeListener<T extends Component>(
        componentOrType: ComponentOrType<T>, callback: (event: IComponentTypeEvent<T>) => void, context?: any)
    {
        this.components.on(getType(componentOrType), callback, context);
    }

    /**
     * Removes a listener for component add/remove events for a specific component type.
     * @param componentOrType The component type as example object, constructor function or string.
     * @param callback Event handler function.
     * @param context Optional context object on which to call the event handler function.
     */
    removeComponentTypeListener<T extends Component>(
        componentOrType: ComponentOrType<T>, callback: (event: IComponentTypeEvent<T>) => void, context?: any)
    {
        this.components.off(getType(componentOrType), callback, context);
    }

    deflate()
    {
        const json: any = {
            id: this.id
        };

        if (this.name) {
            json.name = this.name;
        }

        if (this.components.length > 0) {
            json.components = this.components.getArray().map(component => component.deflate());
        }

        return json;
    }

    inflate(json, linkableDict: Dictionary<ILinkable>)
    {
        if (json.components) {
            json.components.forEach(jsonComp => {
                const component = this.createComponent(jsonComp.type, jsonComp.name, jsonComp.id);
                component.inflate(jsonComp);
                linkableDict[jsonComp.id] = component;
            });
        }
    }

    inflateLinks(json, linkableDict: Dictionary<ILinkable>)
    {
        if (json.components) {
            json.components.forEach(jsonComp => {
                const component = this.components.getById(jsonComp.id);
                component.inflateLinks(jsonComp, linkableDict);
            });
        }
    }

    toString(verbose: boolean = false)
    {
        const components = this.components.getArray();
        const text = `Entity '${this.name}' - ${components.length} components`;

        if (verbose) {
            return text + "\n" + components.map(component => "  " + component.toString()).join("\n");
        }

        return text;
    }

    _addComponent(component: Component)
    {
        if (component.entity !== this) {
            throw new Error("component belongs to a different entity");
        }
        if (component.isEntitySingleton && this.components.has(component)) {
            throw new Error(`only one component of type '${component.type}' allowed per entity`);
        }

        this.module._addComponent(component);
        this.components._add(component);

        this.emit<IEntityComponentEvent>(Entity.componentEvent, { add: true, remove: false, component });
    }

    _removeComponent(component: Component)
    {
        this.emit<IEntityComponentEvent>(Entity.componentEvent, { add: false, remove: true, component });

        this.components._remove(component);
        this.module._removeComponent(component);
    }
}
