/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Readonly } from "../types";
import Component, { ComponentType, IComponentChangeEvent } from "./Component";

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
        return this._children;
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
        this.emit<IHierarchyChangeEvent>("changed", { what: "remove-child", component });
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

    /**
     * Searches for the given component type in this entity and then recursively
     * in all parent entities.
     * @param {ComponentType<T>} componentType
     * @returns {T | undefined} The component if found or undefined else.
     */
    getNearestAncestor<T extends Component>(componentType: ComponentType<T>): T | undefined
    {
        let root: Hierarchy = this;
        let component = undefined;

        while(!component && root) {
            component = root.getComponent(componentType);
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
        return super.toString() + ` - children: ${this._children.length}`;
    }
}
