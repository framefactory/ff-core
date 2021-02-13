/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { ITypedEvent } from "./Publisher";
import { schemas, types, IPropertySchema, IPropertyTemplate } from "./propertyTypes";
import PropertyGroup from "./PropertyGroup";

////////////////////////////////////////////////////////////////////////////////

export { schemas, types, IPropertySchema, IPropertyTemplate };

export type ValueType = "number" | "boolean" | "string";

export type PropertyFromTemplate<T> = T extends IPropertyTemplate<infer U> ? Property<U> : never;
export type PropertiesFromTemplates<T> = { [P in keyof T]: PropertyFromTemplate<T[P]> };

export interface IPropertyChangeEvent extends ITypedEvent<"change">
{
    type: "change";
    property: Property;
}

export default class Property<T = unknown> extends Publisher
{
    readonly type: ValueType;
    readonly schema: IPropertySchema<T>;
    readonly length: number;

    private _value: T;
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

        this._value = undefined;
        this._group = null;
        this._key = "";
        this._path = path;

        this.resetValue();
    }

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
        this.emit<IPropertyChangeEvent>({ type: "change", property: this });
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

    setValue(value?: T, silent?: boolean): void
    {
        if (value !== undefined) {
            this._value = value;
        }

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

        const value = this.schema.options.indexOf(option) as unknown;
        if (value >= 0) {
            this.setValue(value as T, silent);
        }
    }

    isArray(): boolean
    {
        return Array.isArray(this.schema.preset);
    }

    protected clonePreset(): T
    {
        const preset = this.schema.preset;
        return Array.isArray(preset) ? preset.slice() as unknown as T : preset;
    }
}