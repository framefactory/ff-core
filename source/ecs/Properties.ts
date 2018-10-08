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

const _rePath = /^(\S*?)(\[(\d+)\])*$/;

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

    getProperty(path: string): { property: Property, index?: number }
    {
        const parts = path.match(_rePath);
        if (!parts) {
            throw new Error(`malformed path '${path}'`);
        }

        const property = this._propsByPath[parts[1]];
        if (!property) {
            throw new Error(`no property found at path '${path}'`);
        }

        const result: any = { property };
        if (parts[2] !== undefined) {
            result.index = parseInt(parts[2]);
        }

        return result;
    }
    
    setValue(path: string, value: any)
    {
        const { property } = this.getProperty(path);
        property.setValue(value);
    }

    setValues(values: Dictionary<any>)
    {
        Object.keys(values).forEach(
            key => this[key].setValue(values[key])
        );
    }

    getValue(path: string)
    {
        const { property } = this.getProperty(path);
        return property.value;
    }

    linkTo(sourcePath: string, targetProps: Properties, targetPath: string)
    {
        targetProps.linkFrom(this, sourcePath, targetPath);
    }

    linkFrom(sourceProps: Properties, sourcePath: string, targetPath: string)
    {
        const source = sourceProps.getProperty(sourcePath);
        const target = this.getProperty(targetPath);

        target.property.linkFrom(source.property, source.index, target.index);
    }

    unlinkTo(sourcePath: string, targetProps: Properties, targetPath: string)
    {
        targetProps.unlinkFrom(this, sourcePath, targetPath);
    }

    unlinkFrom(sourceProps: Properties, sourcePath: string, targetPath: string)
    {
        const source = sourceProps.getProperty(sourcePath);
        const target = this.getProperty(targetPath);

        target.property.unlinkFrom(source.property, source.index, target.index);
    }

}
