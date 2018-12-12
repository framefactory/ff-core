/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { IPublisherEvent } from "../Publisher";

import LinkableSorter from "./LinkableSorter";
import Component, { ComponentOrType, getType } from "./Component";
import ComponentSet, { IComponentTypeEvent } from "./ComponentSet";
import Entity from "./Entity";
import EntitySet from "./EntitySet";
import System, { IUpdateContext, IRenderContext } from "./System";

////////////////////////////////////////////////////////////////////////////////

export { IComponentTypeEvent };

export interface IModuleEntityEvent extends IPublisherEvent<Module>
{
    add: boolean;
    remove: boolean;
    entity: Entity;
}

export interface IModuleComponentEvent<T extends Component = Component>
    extends IPublisherEvent<Module>
{
    add: boolean;
    remove: boolean;
    component: T;
}

export default class Module extends Publisher<Module>
{
    static readonly entityEvent = "entity";
    static readonly componentEvent = "component";

    readonly system: System;

    entities = new EntitySet();
    components = new ComponentSet();

    protected preRenderList: Component[] = [];
    protected postRenderList: Component[] = [];

    private _sorter = new LinkableSorter();
    private _sortRequested = false;

    constructor(system: System)
    {
        super({ knownEvents: false });
        this.addEvents(Module.entityEvent, Module.componentEvent);

        this.system = system;
    }

    /**
     * Calls update() on all components in the module whose changed flag is set.
     * Returns true if at least one component changed its state.
     * @param context
     * @returns true if at least one component was updated.
     */
    update(context: IUpdateContext): boolean
    {
        if (this._sortRequested) {
            this._sortRequested = false;
            this.components.sort(this._sorter);
        }

        // call update on components in topological sort order
        const components = this.components.getArray();
        let updated = false;

        for (let i = 0, n = components.length; i < n; ++i) {
            const component = components[i];
            if (component.changed) {
                if (component.update && component.update(context)) {
                    updated = true;
                }

                component.resetChanged();
            }
        }

        return updated;
    }

    /**
     * Calls tick() on all components in the module.
     * @param context
     */
    tick(context: IUpdateContext): boolean
    {
        const components = this.components.getArray();
        let updated = false;

        for (let i = 0, n = components.length; i < n; ++i) {
            const component = components[i];
            if (component.tick && component.tick(context)) {
                updated = true;
            }
        }

        return updated;
    }

    preRender(context: IRenderContext)
    {
        const components = this.preRenderList;
        for (let i = 0, n = components.length; i < n; ++i) {
            components[i].preRender(context);
        }
    }

    postRender(context: IRenderContext)
    {
        const components = this.preRenderList;
        for (let i = 0, n = components.length; i < n; ++i) {
            components[i].postRender(context);
        }
    }

    /**
     * Requests a topological sort of the list of components based on how they are interlinked.
     * The sort is executed before the next update.
     */
    requestSort()
    {
        this._sortRequested = true;
    }

    createEntity(name?: string, id?: string)
    {
        const entity = Entity.create(this, id);

        if (name) {
            entity.name = name;
        }

        return entity;
    }

    findOrCreateEntity(name: string): Entity
    {
        const entity = this.entities.findByName(name);
        if (entity) {
            return entity;
        }

        return this.createEntity(name);
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
        const json: any = {};

        if (this.entities.length > 0) {
            json.entities = this.entities.getArray().map(entity => entity.deflate());
        }

        return json;
    }

    inflate(json)
    {
        if (json.entities) {
            const linkableDict = {};

            json.entities.forEach(jsonEntity => {
                const entity = this.createEntity(jsonEntity.name, jsonEntity.id);
                entity.inflate(json, linkableDict);
            });
            json.entities.forEach(jsonEntity => {
                const entity = this.entities.getById(jsonEntity.id);
                entity.inflateLinks(jsonEntity, linkableDict);
            })
        }
    }

    toString(verbose: boolean = false)
    {
        const entities = this.entities.getArray();
        const numComponents = this.components.count();

        const text = `Module - ${entities.length} entities, ${numComponents} components.`;

        if (verbose) {
            return text + "\n" + entities.map(entity => entity.toString(true)).join("\n");
        }

        return text;
    }

    _addEntity(entity: Entity)
    {
        this.system._addEntity(entity);
        this.entities._add(entity);

        this.emit<IModuleEntityEvent>(Module.entityEvent, { add: true, remove: false, entity });
    }

    _removeEntity(entity: Entity)
    {
        this.entities._remove(entity);
        this.system._removeEntity(entity);

        this.emit<IModuleEntityEvent>(Module.entityEvent, { add: false, remove: true, entity });
    }

    _addComponent(component: Component)
    {
        if (component.isModuleSingleton && this.components.has(component)) {
            throw new Error(`only one component of type '${component.type}' allowed per module`);
        }

        this.system._addComponent(component);
        this.components._add(component);

        if (component.preRender) {
            this.preRenderList.push(component);
        }
        if (component.postRender) {
            this.postRenderList.push(component);
        }

        const event = { add: true, remove: false, component, sender: this };
        this.emit<IModuleComponentEvent>(Module.componentEvent, event);
        this.emit<IModuleComponentEvent>(component.type, event);
    }

    _removeComponent(component: Component)
    {
        const event = { add: false, remove: true, component, sender: this };
        this.emit<IModuleComponentEvent>(Module.componentEvent, event);
        this.emit<IModuleComponentEvent>(component.type, event);

        this.components._remove(component);
        this.system._addComponent(component);

        if (component.preRender) {
            this.preRenderList.splice(this.preRenderList.indexOf(component), 1);
        }
        if (component.postRender) {
            this.postRenderList.splice(this.preRenderList.indexOf(component), 1);
        }
    }
}
