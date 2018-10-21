/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Readonly } from "../types";
import Entity from "./Entity";
import Component, { ComponentOrType, IComponentChangeEvent } from "./Component";

////////////////////////////////////////////////////////////////////////////////

const _findEntity = (hierarchy: Hierarchy, name: string): Entity | null => {
    if (hierarchy.entity.name === name) {
        return hierarchy.entity;
    }

    const children = hierarchy.children;
    for (let i = 0, n = children.length; i < n; ++i) {
        const descendant = _findEntity(children[i], name);
        if (descendant) {
            return descendant;
        }
    }

    return null;
};

const _findOne = <T extends Component>(hierarchy: Hierarchy, componentOrType: ComponentOrType<T>): T | null => {
    const sibling = hierarchy.getComponent(componentOrType);
    if (sibling) {
        return sibling;
    }

    const children = hierarchy.children;
    for (let i = 0, n = children.length; i < n; ++i) {
        const descendant = _findOne(children[i], componentOrType);
        if (descendant) {
            return descendant;
        }
    }

    return null;
};

const _findAll = <T extends Component>(hierarchy: Hierarchy, componentOrType: ComponentOrType<T>): T[] => {

    let result = hierarchy.getComponents(componentOrType);

    const children = hierarchy.children;
    for (let i = 0, n = children.length; i < n; ++i) {
        const descendants = _findAll(children[i], componentOrType);
        if (descendants.length > 0) {
            result = result.concat(descendants);
        }
    }

    return result;
};

////////////////////////////////////////////////////////////////////////////////

/**
 * Emitted by [[Hierarchy]] component after the instance's state has changed.
 * @event
 */
export interface IHierarchyChangeEvent extends IComponentChangeEvent<Hierarchy>
{
    what: "add-parent" | "remove-parent" | "add-child" | "remove-child";
    component: Hierarchy;
}

/**
 * Allows arranging components in a hierarchical structure.
 *
 * ### Events
 * - *"change"* - emits [[IHierarchyChangeEvent]] after the instance's state has changed.
 */
export default class Hierarchy extends Component
{
    static readonly type: string = "Hierarchy";

    protected _parent: Hierarchy = null;
    protected _children: Hierarchy[] = [];

    /**
     * Returns the parent component of this.
     * @returns {Hierarchy}
     */
    get parent(): Hierarchy
    {
        return this._parent;
    }

    /**
     * Returns an array of child components of this.
     * @returns {Readonly<Hierarchy[]>}
     */
    get children(): Readonly<Hierarchy[]>
    {
        return this._children || [];
    }

    dispose()
    {
        // detach this from its parent
        if (this._parent) {
            this._parent.removeChild(this);
        }

        // detach children
        this._children.slice().forEach(child => this.removeChild(child));

        super.dispose();
    }

    /**
     * Adds another hierarchy component as a child to this component.
     * Emits a change/add-child event at this component and
     * a change/add-parent event at the child component.
     * @param {Hierarchy} component
     */
    addChild(component: Hierarchy)
    {
        if (component._parent) {
            throw new Error("component should not have a parent");
        }

        component._parent = this;
        this._children.push(component);

        component.emit<IHierarchyChangeEvent>("change", { what: "add-parent", component: this });
        this.emit<IHierarchyChangeEvent>("change", { what: "add-child", component });
    }

    /**
     * Removes a child component from this hierarchy component.
     * Emits a change/remove-child event at this component and
     * a change/remove-parent event at the child component.
     * @param {Hierarchy} component
     */
    removeChild(component: Hierarchy)
    {
        if (component._parent !== this) {
            throw new Error("component not a child of this");
        }

        const index = this._children.indexOf(component);
        this._children.splice(index, 1);
        component._parent = null;

        component.emit<IHierarchyChangeEvent>("change", { what: "remove-parent", component: this });
        this.emit<IHierarchyChangeEvent>("change", { what: "remove-child", component });
    }

    /**
     * Returns the root element of the hierarchy this component belongs to.
     * The root element is the hierarchy component that has no parent.
     * @returns {Hierarchy} The root hierarchy component.
     */
    getRoot(): Hierarchy
    {
        let root: Hierarchy = this;
        while(root._parent) {
            root = root._parent;
        }

        return root;
    }

    findEntityInSubtree(name: string): Entity | null
    {
        return _findEntity(this, name);
    }

    getComponentInSubtree<T extends Component>(componentOrType: ComponentOrType<T>): T | null
    {
        return _findOne(this, componentOrType);
    }

    getComponentsInSubtree<T extends Component>(componentOrType: ComponentOrType<T>): T[]
    {
        return _findAll(this, componentOrType);
    }

    hasComponentsInSubtree<T extends Component>(componentOrType: ComponentOrType<T>): boolean
    {
        return !!_findOne(this, componentOrType);
    }

    /**
     * Searches for the given component type in this entity and then recursively
     * in all parent entities.
     * @param {ComponentOrType<T>} componentOrType
     * @returns {T | undefined} The component if found or undefined else.
     */
    getNearestAncestor<T extends Component>(componentOrType: ComponentOrType<T>): T | undefined
    {
        let root: Hierarchy = this;
        let component = undefined;

        while(!component && root) {
            component = root.getComponent(componentOrType);
            root = root._parent;
        }

        return component;
    }

    /**
     * Returns a text representation of this object.
     * @returns {string}
     */
    toString()
    {
        return super.toString() + ` - children: ${this.children.length}`;
    }
}
