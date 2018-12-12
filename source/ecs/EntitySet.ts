/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, Readonly } from "../types";

import Entity from "./Entity";

////////////////////////////////////////////////////////////////////////////////

export default class EntitySet
{
    protected _dict: Dictionary<Entity> = {};
    protected _list: Entity[] = [];

    /**
     * Adds an entity to the set. Automatically called by the entity constructor.
     * @param {Entity} entity
     */
    _add(entity: Entity)
    {
        if (this._dict[entity.id]) {
            throw new Error("entity already registered");
        }

        this._dict[entity.id] = entity;
        this._list.push(entity);
    }

    /**
     * Removes an entity from the set. Automatically called by the entity's dispose method.
     * @param {Entity} entity
     */
    _remove(entity: Entity)
    {
        const index = this._list.indexOf(entity);
        if (index < 0) {
            throw new Error("entity not found");
        }

        delete this._dict[entity.id];
        this._list.splice(index, 1);
    }

    get length() {
        return this._list.length;
    }

    /**
     * Returns an array of all entities in the set.
     */
    getArray(): Readonly<Entity[]>
    {
        return this._list;
    }

    /**
     * Returns an entity by its identifier.
     * @param {string} id An entity's identifier.
     */
    getById(id: string): Entity | null
    {
        return this._dict[id] || null;
    }

    /**
     * Returns the first entity with the given name, or null if no entity with
     * the given name exists. Performs a linear search; don't use in time-critical code.
     * @param name Name of the entity to find.
     */
    findByName(name: string): Entity | null
    {
        const entities = this._list;

        for (let i = 0, n = entities.length; i < n; ++i) {
            if (entities[i].name === name) {
                return entities[i];
            }
        }

        return null;
    }

    /**
     * Returns all entities not containing a hierarchy component with a parent.
     * Performs a linear search; don't use in time-critical code.
     */
    findRoots(): Entity[]
    {
        const entities = this._list;
        const result = [];

        for (let i = 0, n = entities.length; i < n; ++i) {
            // TODO: Solve circular dependency on HierarchyComponent
            const hierarchy: any = entities[i].components.get("Hierarchy");
            if (!hierarchy || !hierarchy.parent) {
                result.push(entities[i]);
            }
        }

        return result;
    }
}