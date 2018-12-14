/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { IPublisherEvent } from "../Publisher";

import Component, { ComponentOrType, getType } from "./Component";
import ComponentSet, { IComponentTypeEvent } from "./ComponentSet";
import Entity from "./Entity";
import EntitySet from "./EntitySet";
import Module from "./Module";
import Registry from "./Registry";
import Hierarchy from "./Hierarchy";

////////////////////////////////////////////////////////////////////////////////

export { IComponentTypeEvent };

export interface ISystemEntityEvent extends IPublisherEvent<System>
{
    add: boolean;
    remove: boolean;
    entity: Entity;
}

export interface ISystemComponentEvent<T extends Component = Component>
    extends IPublisherEvent<System>
{
    add: boolean;
    remove: boolean;
    component: T;
}

export interface IUpdateContext
{
}

export interface IRenderContext
{
}

export default class System extends Publisher<System>
{
    static readonly entityEvent = "entity";
    static readonly componentEvent = "component";

    readonly registry: Registry;
    readonly entities: EntitySet;
    readonly components: ComponentSet;
    readonly module: Module;

    private _updateWaitList: any[];


    constructor(registry?: Registry)
    {
        super();
        this.addEvents(System.entityEvent, System.componentEvent);

        this.registry = registry || new Registry();
        this.entities = new EntitySet();
        this.components = new ComponentSet();
        this.module = new Module(this);

        this._updateWaitList = [];
    }

    /**
     * Calls update() on all components in the system whose changed flag is set.
     * @param context
     * @returns true if the state of at least one component has changed.
     */
    update(context: IUpdateContext): boolean
    {
        const dirty = this.module.update(context);

        // call pending callbacks on update wait list
        this._updateWaitList.forEach(resolve => resolve());
        this._updateWaitList.length = 0;

        return dirty;
    }

    /**
     * Calls tick() on all components in the system.
     * @param context
     * @returns true if the state of at least one component has changed.
     */
    tick(context: IUpdateContext): boolean
    {
        return this.module.tick(context);
    }

    preRender(context: IRenderContext)
    {
        this.module.preRender(context);
    }

    postRender(context: IRenderContext)
    {
        this.module.postRender(context);
    }

    waitForUpdate(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            this._updateWaitList.push(resolve);
        });
    }

    emitComponentEvent(target: Component, name: string, event: any)
    {
        while (target) {
            target.emit(name, event);

            if (event.stopPropagation) {
                return;
            }

            const components = target.components.getArray();
            for (let i = 0, n = components.length; i < n; ++i) {
                const component = components[i];
                if (component !== target) {
                    component.emit(name, event);

                    if (event.stopPropagation) {
                        return;
                    }
                }
            }

            const hierarchy = target.components.get(Hierarchy);
            target = hierarchy ? hierarchy.parent : null;
        }
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
        return this.module.deflate();
    }

    inflate(json)
    {
        this.module.inflate(json);
    }

    toString(verbose: boolean = false)
    {
        const entities = this.entities.getArray();
        const numComponents = this.components.count();

        const text = `System - ${entities.length} entities, ${numComponents} components.`;

        if (verbose) {
            return text + "\n" + entities.map(entity => entity.toString(true)).join("\n");
        }

        return text;
    }

    _addEntity(entity: Entity)
    {
        this.entities._add(entity);

        this.entityAdded(entity);
        this.emit<ISystemEntityEvent>(System.entityEvent, { add: true, remove: false, entity });
    }

    _removeEntity(entity: Entity)
    {
        this.entities._remove(entity);

        this.entityRemoved(entity);
        this.emit<ISystemEntityEvent>(System.entityEvent, { add: false, remove: true, entity });
    }

    _addComponent(component: Component)
    {
        if (component.isSystemSingleton && this.components.has(component)) {
            throw new Error(`only one component of type '${component.type}' allowed per system`);
        }

        this.components._add(component);

        this.componentAdded(component);
        this.emit<ISystemComponentEvent>(System.componentEvent, { add: true, remove: false, component });
    }

    _removeComponent(component: Component)
    {
        this.components._remove(component);

        this.componentRemoved(component);
        this.emit<ISystemComponentEvent>(System.componentEvent, { add: false, remove: true, component });
    }

    /**
     * Called after a new entity has been added to the system.
     * [[ISystemEntityEvent]] has not been fired yet.
     * Override to perform custom operations after an entity has been added.
     * @param {Entity} entity The entity added to the system.
     */
    protected entityAdded(entity: Entity)
    {
    }

    /**
     * Called before an entity is removed from the system.
     * [[ISystemEntityEvent]] has not been fired yet.
     * Override to perform custom operations before an entity is removed.
     * @param {Entity} entity The entity being removed from the system.
     */
    protected entityRemoved(entity: Entity)
    {
    }

    /**
     * Called after a new component has been added to the system.
     * [[ISystemComponentEvent]] has not been fired yet.
     * Override to perform custom operations after a component has been added.
     * @param {Component} component The component added to the system.
     */
    protected componentAdded(component: Component)
    {
    }

    /**
     * Called before a component is removed from the system.
     * [[ISystemComponentEvent]] has not been fired yet.
     * Override to perform custom operations before a component is removed.
     * @param {Component} component The component being removed from the system.
     */
    protected componentRemoved(component: Component)
    {
    }
}
