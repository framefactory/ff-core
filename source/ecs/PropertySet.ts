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
 * To make use of linkable properties and property sets, classes must implement this interface.
 */
export interface ILinkable
{
    /** A unique identifier for this instance. */
    id: string;
    /** Will be set to true if an input property changes. */
    changed: boolean;

    /** Set of input properties. */
    readonly ins: PropertySet;
    /** Set of output properties. */
    readonly outs: PropertySet;
}

/**
 * Emitted by [[Properties]] after changes in the properties configuration.
 * @event
 */
export interface IPropertySetChangeEvent extends IPublisherEvent<PropertySet>
{
    what: "add" | "remove" | "update";
    property: Property;
}

/**
 * A set of properties. Properties can be linked, such that one property updates another.
 * After adding properties to the set, they are available on the set using their key.
 * To make use of linkable properties, classes must implement the [[ILinkable]] interface.
 *
 * ### Events
 * - *"change"* - emits [[IPropertiesChangeEvent]] after properties have been added, removed, or renamed.
 */
export default class PropertySet extends Publisher<PropertySet>
{
    linkable: ILinkable;
    properties: Property[];

    private _propsByPath: Dictionary<Property>;

    constructor(linkable: ILinkable)
    {
        super();
        this.addEvents("change");

        this.linkable = linkable;
        this.properties = [];
        this._propsByPath = {};
    }

    get length()
    {
        return this.properties.length;
    }

    /**
     * Appends properties to the set.
     * @param {U} properties plain object with keys and properties.
     * @returns {this & U}
     */
    append<U extends Dictionary<Property>>(properties: U): this & U
    {
        Object.keys(properties).forEach(key => {
            const property = properties[key];
            property.key = key;
            this.add(property);
        });

        return this as this & U;
    }

    /**
     * Adds the given property to the set.
     * @param {Property} property The property to be added.
     */
    add(property: Property)
    {
        const key = property.key;
        if (!key) {
            throw new Error("can't add property without key");
        }

        if (this[key]) {
            throw new Error(`key already exists in properties: '${key}'`);
        }

        property.props = this;

        this[key] = property;
        this.properties.push(property);
        this._propsByPath[property.path] = property;

        this.emit<IPropertySetChangeEvent>("change", { what: "add", property });
    }

    /**
     * Removes the given property from the set.
     * @param {Property} property The property to be removed.
     */
    remove(property: Property)
    {
        if (this[property.key] !== property) {
            throw new Error(`property not found in set: ${property.key}`);
        }

        delete this[property.key];

        const props = this.properties;
        const index = props.indexOf(property);
        props.slice(index, 1);

        delete this._propsByPath[property.path];

        this.emit<IPropertySetChangeEvent>("change", { what: "remove", property });
    }

    /**
     * Returns a property by path.
     * @param {string} path The path of the property to be returned.
     * @returns {Property}
     */
    getProperty(path: string)
    {
        const property = this._propsByPath[path];
        if (!property) {
            throw new Error(`no property found at path '${path}'`);
        }

        return property;
    }

    /**
     * Sets the values of multiple properties.
     * @param values Dictionary of property key/value pairs.
     */
    setValues(values: Dictionary<any>)
    {
        Object.keys(values).forEach(
            key => this[key].setValue(values[key])
        );
    }

    /**
     * Sets the value of a property by path.
     * @param {string} path The path of the property whose value should be set.
     * @param value
     */
    setValue(path: string, value: any)
    {
        this.getProperty(path).setValue(value);
    }

    /**
     * Returns the value of a property by path.
     * @param {string} path The path of the property whose value should be returned.
     * @returns {any}
     */
    getValue(path: string)
    {
        return this.getProperty(path).value;
    }

    /**
     * Returns the changed flag of a property by path.
     * @param {string} path The path of the property whose change flag should be returned.
     * @returns {boolean}
     */
    hasChanged(path: string): boolean
    {
        return this.getProperty(path).changed;
    }

    /**
     * Establishes a link from a property in this set to a property in another set, by path.
     * @param {string} sourcePath Path of the source property, optionally including a sub-index ("[0]").
     * @param {PropertySet} targetProps Set containing the property to be linked to.
     * @param {string} targetPath Path of the target property, optionally including a sub-index ("[0]").
     */
    linkTo(sourcePath: string, targetProps: PropertySet, targetPath: string)
    {
        targetProps.linkFrom(this, sourcePath, targetPath);
    }

    /**
     * Establishes a link from a property in another set to a property in this set, by path.
     * @param {PropertySet} sourceProps Set containing the property to be linked from.
     * @param {string} sourcePath Path of the source property, optionally including a sub-index ("[0]").
     * @param {string} targetPath Path of the target property, optionally including a sub-index ("[0]").
     */
    linkFrom(sourceProps: PropertySet, sourcePath: string, targetPath: string)
    {
        const source = sourceProps.getPropertyWithIndex(sourcePath);
        const target = this.getPropertyWithIndex(targetPath);

        target.property.linkFrom(source.property, source.index, target.index);
    }

    /**
     * Removes a link from a property in this set to a property in another set, by path.
     * @param {string} sourcePath Path of the source property, optionally including a sub-index ("[0]").
     * @param {PropertySet} targetProps Set containing the target property.
     * @param {string} targetPath Path of the target property, optionally including a sub-index ("[0]").
     */
    unlinkTo(sourcePath: string, targetProps: PropertySet, targetPath: string)
    {
        targetProps.unlinkFrom(this, sourcePath, targetPath);
    }

    /**
     * Removes a link from a property in another set to a property in this set, by path.
     * @param {PropertySet} sourceProps Set containing the source property.
     * @param {string} sourcePath Path of the source property, optionally including a sub-index ("[0]").
     * @param {string} targetPath Path of the target property, optionally including a sub-index ("[0]").
     */
    unlinkFrom(sourceProps: PropertySet, sourcePath: string, targetPath: string)
    {
        const source = sourceProps.getPropertyWithIndex(sourcePath);
        const target = this.getPropertyWithIndex(targetPath);

        target.property.unlinkFrom(source.property, source.index, target.index);
    }

    deflate()
    {
        let json = null;

        this.properties.forEach(property => {
            const jsonProp = property.deflate();
            if (jsonProp) {
                json = json || {};
                json[property.key] = jsonProp;
            }
        });

        return json;
    }

    inflate(json: any)
    {
        Object.keys(json).forEach(key => {
            const jsonProp = json[key];
            if (jsonProp.schema) {
                const property = new Property(jsonProp.path, jsonProp.schema, jsonProp.preset, true);
                property.key = key;
                this.add(property);
            }
        });
    }

    inflateLinks(json: any, linkableDict: Dictionary<ILinkable>)
    {
        Object.keys(json).forEach(key => {
            this[key].inflate(json[key], linkableDict);
        });
    }

    protected getPropertyWithIndex(path: string): { property: Property, index?: number }
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
}
