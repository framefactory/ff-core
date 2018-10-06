/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary } from "../types";
import Publisher, { IPublisherEvent } from "../Publisher";

import Property from "./Property";

////////////////////////////////////////////////////////////////////////////////

/**
 * To use linkable properties, classes must implement this interface.
 */
export interface ILinkable
{
    /** A unique identifier for this instance. */
    id: string;
    /** Will be set to true if an input property changes. */
    changed: boolean;

    /** Set of input properties. */
    readonly ins: Properties;
    /** Set of output properties. */
    readonly outs: Properties;
}

/**
 * Emitted by [[Properties]] after changes in the properties configuration.
 * @event
 */
export interface IPropertiesChangeEvent extends IPublisherEvent<Properties>
{
    what: "add" | "remove";
    property: Property;
}

/**
 * A set of properties. Properties can be linked, such that one property updates another.
 * To make use of linkable properties, classes must implement the [[ILinkable]] interface.
 *
 * ### Events
 * - *"change"* - emits [[IPropertiesChangeEvent]] after the properties' state has changed.
 * - *"value"* - emits [[Property]] after the value of a property has changed.
 */
export default class Properties extends Publisher<Properties>
{
    linkable: ILinkable;
    properties: Property[];

    private _propsByPath: Dictionary<Property>;

    constructor(linkable: ILinkable, props?: Dictionary<Property>)
    {
        super();
        this.addEvents("change", "value");

        this.linkable = linkable;
        this.properties = [];
        this._propsByPath = {};

        if (props) {
            Object.keys(props).forEach(
                key => this.add(key, props[key])
            );
        }
    }

    merge(props: Dictionary<Property>): this
    {
        Object.keys(props).forEach(
            key => this.add(key, props[key])
        );

        return this;
    }

    add(key: string, property: Property): this
    {
        property.parent = this;
        property.key = key;

        this[key] = property;
        this.properties.push(property);
        this._propsByPath[property.path] = property;

        return this;
    }

    remove(key: string): boolean
    {
        const property = this[key];
        if (!property) {
            return false;
        }

        delete this[key];

        const props = this.properties;
        const index = props.indexOf(property);
        props.slice(index, 1);

        delete this._propsByPath[property.path];
    }
    
    setValue(path: string, value: any)
    {
        const prop = this._propsByPath[path];
        if (!prop) {
            throw new Error(`no property found at path '${path}'`);
        }

        prop.setValue(value);
    }

    setValues(values: Dictionary<any>)
    {
        Object.keys(values).forEach(
            key => this[key].setValue(values[key])
        );
    }

    getValue(path: string)
    {
        const prop = this._propsByPath[path];
        if (!prop) {
            throw new Error(`no property found at path '${path}'`);
        }

        return prop.value;
    }
}
