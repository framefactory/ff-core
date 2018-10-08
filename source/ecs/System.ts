/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Readonly } from "../types";
import Publisher, { IPublisherEvent } from "../Publisher";
import Component, { ComponentOrType, getType, Entity } from "./Component";
import Registry from "./Registry";
import LinkableSorter from "./LinkableSorter";

////////////////////////////////////////////////////////////////////////////////

const _EMPTY_ARRAY = [];

export { Entity, Component };

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

export interface ISystemContext
{
}

export default class System extends Publisher<System>
{
    readonly registry: Registry;
    readonly context: ISystemContext;

    private _entitiesById: { [id: string]: Entity };

    private _componentsByType: { [type: string]: Component[] };
    private _componentsById: { [id: string]: Component };
    private _componentList: Component[];
    private _initList: Component[];
    private _updateWaitList: any[];

    private _sorter: LinkableSorter;

    constructor(registry?: Registry)
    {
        super({ knownEvents: false });
        this.addEvents("entity", "component");

        this.registry = registry || new Registry();
        this.context = {};

        this._entitiesById = {};
        this._componentsByType = {};
        this._componentsById = {};
        this._componentList = [];
        this._initList = [];
        this._updateWaitList = [];

        this._sorter = new LinkableSorter();
    }

    create()
    {
        const context = this.context;
        const components = this._initList;

        for (let i = 0, n = components.length; i < n; ++i) {
            components[i].create(context);
        }
        components.length = 0;
    }

    update()
    {
        // initialize any new components first
        this.create();

        // call update on components in topological sort order
        const context = this.context;
        const components = this._componentList;

        for (let i = 0, n = components.length; i < n; ++i) {
            const component = components[i];
            if (component.changed) {
                component.update(context);
                component.resetChanged();
            }
        }

        // call pending callbacks on update waitlist
        this._updateWaitList.forEach(resolve => resolve());
        this._updateWaitList.length = 0;
    }

    tick()
    {
        const context = this.context;
        const components = this._componentList;

        for (let i = 0, n = components.length; i < n; ++i) {
            components[i].tick(context);
        }
    }

    waitForUpdate(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            this._updateWaitList.push(resolve);
        });
    }

    sort()
    {
        // perform topological sort
        this._componentList = this._sorter.sort(this._componentList) as Component[];
    }

    /**
     * Adds a listener for component add/remove events for a specific component type.
     * @param {ComponentOrType<T>} componentOrType
     * @param {(event: IManagerComponentEvent<T extends Component>) => void} callback
     * @param context
     */
    addComponentEventListener<T extends Component>(
        componentOrType: ComponentOrType<T>, callback: (event: ISystemComponentEvent<T>) => void, context?: any)
    {
        this.on(getType(componentOrType), callback, context);
    }

    /**
     * Removes a listener for component add/remove events for a specific component type.
     * @param {ComponentOrType<T>} componentOrType
     * @param {(event: IManagerComponentEvent<T extends Component>) => void} callback
     * @param context
     */
    removeComponentEventListener<T extends Component>(
        componentOrType: ComponentOrType<T>, callback: (event: ISystemComponentEvent<T>) => void, context?: any)
    {
        this.off(getType(componentOrType), callback, context);
    }

    /**
     * Creates a new entity. The entity is added to this system and returned.
     * @param {string} name Optional name for the entity.
     * @returns {Entity}
     */
    createEntity(name?: string): Entity
    {
        const entity = this.doCreateEntity();

        if (name) {
            entity.name = name;
        }

        return entity;
    }

    findOrCreateEntity(name: string): Entity
    {
        const entity = this.findEntityByName(name);
        if (entity) {
            return entity;
        }

        return this.createEntity(name);
    }

    /**
     * Creates a new component of the given type and adds it to the given entity.
     * @param {Entity} entity The entity the new component is added to.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    createComponent<T extends Component>(entity: Entity, componentOrType: ComponentOrType<T>, name?: string): T | undefined
    {
        let component;

        if (typeof componentOrType === "string") {
            component = this.registry.createComponent(componentOrType, entity);
        }
        else {
            const Ctor = (componentOrType instanceof Component ? componentOrType.constructor : componentOrType) as typeof Component;
            component = new Ctor(entity);
        }

        if (component && name) {
            component.name = name;
        }

        return component;
    }

    /**
     * Creates a new component of the given type only if a component of this type doesn't exist yet in the system.
     * Otherwise returns the existing component.
     * @param {Entity} entity The entity the new component is added to.
     * @param {ComponentOrType<T>} componentOrType Type of the component to create.
     * @param {string} name Optional name for the component.
     * @returns {T} The created component.
     */
    getOrCreateComponent<T extends Component>(entity: Entity, componentOrType: ComponentOrType<T>, name?: string): T | undefined
    {
        const component = this.getComponent(componentOrType);
        if (component) {
            return component;
        }

        return this.createComponent(entity, componentOrType, name);
    }

    /**
     * Adds an entity to the system. Automatically called by the entity constructor.
     * @param {Entity} entity
     */
    addEntity(entity: Entity)
    {
        this._entitiesById[entity.id] = entity;
        this.didAddEntity(entity);
        this.emit<ISystemEntityEvent>("entity", { add: true, remove: false, entity });
    }

    /**
     * Removes an entity from the system. Automatically called by the entity's dispose method.
     * @param {Entity} entity
     */
    removeEntity(entity: Entity)
    {
        this.willRemoveEntity(entity);
        delete this._entitiesById[entity.id];
        this.emit<ISystemEntityEvent>("entity", { add: false, remove: true, entity });
    }

    findEntityByName(name: string): Entity | null
    {
        const entities = this._entitiesById;
        const ids = Object.keys(entities);

        for (let i = 0, n = ids.length; i < n; ++i) {
            const entity = entities[ids[i]];
            if (entity.name === name) {
                return entity;
            }
        }

        return null;
    }

    /**
     * Returns an entity by its identifier.
     * @param {string} id An entity's identifier.
     * @returns {Entity}
     */
    getEntityById(id: string)
    {
        return this._entitiesById[id];
    }

    /**
     * Adds a new component to the system. Called automatically by the component's constructor.
     * @param {Component} component
     */
    addComponent(component: Component)
    {
        this._initList.push(component);
        this._componentList.push(component);
        this._componentsById[component.id] = component;
        this.getComponentArrayByType(component.type).push(component);

        this.didAddComponent(component);

        this.emit<ISystemComponentEvent>("component", { add: true, remove: false, component });
        this.emit<ISystemComponentEvent>(component.type, { add: true, remove: false, component });
    }

    /**
     * Removes a component from the system. Called automatically by the component's dispose() method.
     * @param {Component} component
     * @returns {boolean} True if the component was successfully removed.
     */
    removeComponent(component: Component): boolean
    {
        if (!this._componentsById[component.id]) {
            return false;
        }

        this.willRemoveComponent(component);

        delete this._componentsById[component.id];

        let index = this._componentList.indexOf(component);
        this._componentList.splice(index, 1);

        index = this._initList.indexOf(component);
        if (index >= 0) {
            this._initList.splice(index, 1);
        }

        const components = this._componentsByType[component.type];
        index = components.indexOf(component);
        components.splice(index, 1);

        this.emit<ISystemComponentEvent>("component", { add: false, remove: true, component });
        this.emit<ISystemComponentEvent>(component.type, { add: false, remove: true, component });

        return true;
    }

    /**
     * Registers a component under the given base class. The component can then also be
     * retrieved by specifying the base class in getComponent(s) methods.
     * Called by a component's base class constructor.
     * @param {Component} component
     * @param {ComponentOrType} baseType
     */
    addBaseComponent(component: Component, baseType: ComponentOrType)
    {
        const type = getType(baseType);
        this.getComponentArrayByType(type).push(component);

        this.emit<ISystemComponentEvent>(type, { add: true, remove: false, component });
    }

    /**
     * Unregisters the base class of a component.
     * Called by a component's base class dispose method.
     * @param {Component} component
     * @param {ComponentOrType} baseType
     */
    removeBaseComponent(component: Component, baseType: ComponentOrType)
    {
        const type = getType(baseType);
        const components = this._componentsByType[type];
        const index = components.indexOf(component);
        components.splice(index, 1);

        this.emit<ISystemComponentEvent>(type, { add: false, remove: true, component });
    }

    /**
     * Returns true if the system contains components of the given type.
     * @param {ComponentOrType} componentOrType
     * @returns {boolean}
     */
    hasComponents(componentOrType: ComponentOrType): boolean
    {
        const type = getType(componentOrType);
        const components = this._componentsByType[type];
        return components && components.length > 0;
    }

    countComponents(componentOrType?: ComponentOrType): number
    {
        const components = componentOrType ? this._componentsByType[getType(componentOrType)] : this._componentList;
        return components ? components.length : 0;
    }

    /**
     * Returns an array of components of a specific type if given.
     * @param {ComponentOrType<T>} componentOrType If given only returns components of the given type.
     * @returns {T[]}
     */
    getComponents<T extends Component>(componentOrType?: ComponentOrType<T> | T): Readonly<T[]>
    {
        if (componentOrType) {
            return (this._componentsByType[getType(componentOrType)] || _EMPTY_ARRAY) as T[];
        }

        return this._componentList as T[];
    }

    /**
     * Returns the first found component of the given type.
     * @param {ComponentOrType<T>} componentOrType Type of component to return.
     * @returns {T | undefined}
     */
    getComponent<T extends Component>(componentOrType: ComponentOrType<T> | T): T | undefined
    {
        const components =  this._componentsByType[getType(componentOrType)];
        return components ? components[0] as T : undefined;
    }

    /**
     * Returns the component with the given identifier.
     * @param {string} id Identifier of the entity to retrieve.
     * @returns {T | undefined}
     */
    getComponentById<T extends Component>(id: string): T | undefined
    {
        return this._componentsById[id] as T;
    }

    /**
     * Returns the first component of the given type with the given name.
     * @param {string} name
     * @param {ComponentOrType<T>} componentOrType
     * @returns {T | undefined}
     */
    findComponentByName<T extends Component>(name: string, componentOrType?: ComponentOrType<T> | T): T | undefined
    {
        return this._componentList.find(component =>
            component.name === name && (!componentOrType || component.type === getType(componentOrType))
        ) as T;
    }

    toString(verbose: boolean = false)
    {
        const entityKeys = Object.keys(this._entitiesById);
        const numEntities = entityKeys.length;
        const numComponents = this._componentList.length;

        const text = `EntityManager - ${numEntities} entities, ${numComponents} components.`;

        if (verbose) {
            return text + "\n" + entityKeys.map(key => this._entitiesById[key].toString(true)).join("\n");
        }

        return text;
    }

    /**
     * Override to create a custom entity type derived from [[Entity]].
     * @returns {Entity}
     */
    protected doCreateEntity(): Entity
    {
        return new Entity(this);
    }

    /**
     * Called after a new entity has been added to the system.
     * [[ISystemEntityEvent]] has not been fired yet.
     * Override to perform custom operations after an entity has been added.
     * @param {Entity} entity The entity added to the system.
     */
    protected didAddEntity(entity: Entity)
    {
    }

    /**
     * Called before an entity is removed from the system.
     * [[ISystemEntityEvent]] has not been fired yet.
     * Override to perform custom operations before an entity is removed.
     * @param {Entity} entity The entity being removed from the system.
     */
    protected willRemoveEntity(entity: Entity)
    {
    }

    /**
     * Called after a new component has been added to the system.
     * [[ISystemComponentEvent]] has not been fired yet.
     * Override to perform custom operations after a component has been added.
     * @param {Component} component The component added to the system.
     */
    protected didAddComponent(component: Component)
    {
    }

    /**
     * Called before a component is removed from the system.
     * [[ISystemComponentEvent]] has not been fired yet.
     * Override to perform custom operations before a component is removed.
     * @param {Component} component The component being removed from the system.
     */
    protected willRemoveComponent(component: Component)
    {
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
