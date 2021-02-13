/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { ITypedEvent } from "./Publisher";
import Property, { PropertiesFromTemplates, IPropertySchema, IPropertyChangeEvent } from "./Property";

////////////////////////////////////////////////////////////////////////////////

export interface IPropertyGroupChangeEvent extends ITypedEvent<"change">
{
    type: "change";
    property: Property;
    group: PropertyGroup;
}

export default class PropertyGroup extends Publisher
{
    properties: Property[];

    constructor()
    {
        super();
        this.addEvent("change");
    }

    createProperties<U>(templates: U, index?: number): this & PropertiesFromTemplates<U>
    {
        Object.keys(templates).forEach((key, i) => {
            const ii = index === undefined ? undefined : index + i;
            const template = templates[key];
            this.createProperty(template.path, template.schema, key, ii);
        });

        return this as this & PropertiesFromTemplates<U>;
    }

    createProperty<T>(path: string, schema: IPropertySchema<T>, key: string, index?: number): Property<T>
    {
        const property = new Property<T>(path, schema);
        this.addProperty(property, key, index);
        return property;
    }

    addProperty(property: Property, key: string, index?: number): void
    {
        if (property.group) {
            throw new Error("can't add, property already part of a group");
        }

        if (this[key]) {
            throw new Error(`key '${key}' already exists in group`);
        }

        property.on("change", this.onPropertyChange, this);

        property["_group"] = this;
        property["_key"] = key;

        if (index === undefined) {
            this.properties.push(property);
        }
        else {
            this.properties.splice(index, 0, property);
        }

        this[key] = property;
    }

    removeProperty(property: Property): void
    {
        if (property.group !== this) {
            throw new Error("can't remove, property not in this group");
        }

        if (this[property.key] !== property) {
            throw new Error(`property key '${property.key}' not found in group`);
        }

        property.off("change", this.onPropertyChange, this);

        this.properties.slice(this.properties.indexOf(property), 1);
        delete this[property.key];

        property["_group"] = null;
        property["_key"] = "";
    }

    protected onPropertyChange(event: IPropertyChangeEvent): void
    {
        this.emit<IPropertyGroupChangeEvent>({
            type: "change",
            property: event.property,
            group: this,
        });
    }
}