/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Publisher, ITypedEvent } from "./Publisher.js";
import { schemas, types, IPropertySchema, IPropertyTemplate } from "./propertyTypes.js";
//import PropertyGroup from "./PropertyGroup.js";

////////////////////////////////////////////////////////////////////////////////

export { schemas, types }
export type { IPropertySchema, IPropertyTemplate };

export type ValueType = "number" | "boolean" | "string";

export type PropertyFromTemplate<T> = T extends IPropertyTemplate<infer U> ? Property<U> : never;
export type PropertiesFromTemplates<T> = { [P in keyof T]: PropertyFromTemplate<T[P]> };

export interface IPropertyChangeEvent extends ITypedEvent<"change">
{
    type: "change";
    property: Property;
}

export class Property<T = unknown> extends Publisher
{
    readonly type: ValueType;
    readonly schema: IPropertySchema<T>;
    readonly length: number;

    value: T;

    private _group: PropertyGroup;
    private _key: string;
    private _path: string;

    constructor(path: string, schema: IPropertySchema<T>)
    {
        super();
        this.addEvent("change");

        if (!schema || schema.preset === undefined) {
            throw new TypeError("invalid property schema");
        }

        const preset = schema.preset;

        this.type = typeof (Array.isArray(preset) ? preset[0] : preset) as ValueType;
        this.schema = schema;
        this.length = Array.isArray(preset) ? preset.length : 1;

        this.value = undefined;

        this._group = null;
        this._key = "";
        this._path = path;

        this.resetValue();
    }

    get group(): PropertyGroup {
        return this._group;
    }

    get key(): string {
        return this._key;
    }

    get path(): string {
        return this._path;
    }

    get name(): string {
        return this._path.split(".").pop();
    }

    set(): void
    {
        this.emit<IPropertyChangeEvent>({ type: "change", property: this });
    }

    setValue(value: T, silent?: boolean): void
    {
        this.value = value;

        if (!silent) {
            this.emit<IPropertyChangeEvent>({ type: "change", property: this });
        }
    }

    copyValue(value: T, silent?: boolean): void
    {
        if (Array.isArray(this.value)) {
            if (!Array.isArray(value) || value.length !== this.length) {
                throw new TypeError("array shape mismatch");
            }
            this.setValue(value.slice() as unknown as T, silent);
        }
        else {
            this.setValue(value, silent);
        }
    }

    cloneValue(): T
    {
        const value = this.value;

        if (Array.isArray(value)) {
            return value.slice() as unknown as T;
        }

        return this.value;
    }

    resetValue(silent?: boolean): void
    {
        this.setValue(this.clonePreset(), silent);
    }

    setOption(option: string, silent?: boolean): void
    {
        if (!this.schema.options) {
            throw new TypeError("not an option property");
        }
        if (option) {
            const value = this.schema.options.indexOf(option) as number;
            if (value >= 0) {
                this.setValue(value as T, silent);
            }
        }
    }

    getOption(): string
    {
        if (!this.schema.options) {
            throw new TypeError("not an option property");
        }

        return this.schema.options[this.value as any] || "";
    }

    isArray(): boolean
    {
        return Array.isArray(this.schema.preset);
    }

    isPreset(): boolean
    {
        const preset: any = this.schema.preset;

        if (this.isArray()) {
            for (let i = 0, n = preset.length; i < n; ++i) {
                if (this.value[i] !== preset[i]) {
                    return false;
                }
            }
            return true;
        }

        return this.value === preset;
    }

    protected clonePreset(): T
    {
        const preset = this.schema.preset;
        return Array.isArray(preset) ? preset.slice() as unknown as T : preset;
    }
}

////////////////////////////////////////////////////////////////////////////////

export interface IPropertyGroupChangeEvent extends ITypedEvent<"change">
{
    type: "change";
    property: Property;
    group: PropertyGroup;
}

export class PropertyGroup extends Publisher
{
    static fromTemplates<U>(templates: U, index?: number): PropertyGroup & PropertiesFromTemplates<U>
    {
        const group = new PropertyGroup();
        return group.createProperties(templates, index);
    }

    properties: Property[] = [];

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

    resetAll(silent?: boolean): void
    {
        this.properties.forEach(prop => prop.resetValue(silent));
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