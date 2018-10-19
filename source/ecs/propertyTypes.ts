/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { enumToArray, TypeOf, PropOf } from "../types";

import Property, { IPropertySchema, PresetOrSchema } from "./Property";
import PropertyObject from "./PropertyObject";

////////////////////////////////////////////////////////////////////////////////

type Vector<T = number> = T[];
type Matrix<T = number> = T[];
//type Vector2<T = number> = [T, T];
//type Vector3<T = number> = [T, T, T];
//type Vector4<T = number> = [T, T, T, T];
//type Matrix3<T = number> = [T, T, T, T, T, T, T, T, T];
//type Matrix4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T];

export namespace Schemas
{
    export const Integer: IPropertySchema<number> = { preset: 0, step: 1 };
    export const ColorRGB: IPropertySchema<Vector> = { preset: [1, 1, 1], semantic: "color" };
    export const ColorRGBA: IPropertySchema<Vector> = { preset: [1, 1, 1, 1], semantic: "color" };
}

export default {
    getOptionIndex: function(arr: any[], index: number): number {
        const n = arr.length;
        const i = Math.trunc(index);
        return i < 0 ? 0 : (i > n ? 0 : i);
    },

    getOptionValue: function<T>(arr: T[], index: number): T {
        const n = arr.length;
        const i = Math.trunc(index);
        return arr[i < 0 ? 0 : (i > n ? 0 : i)];
    },

    getEnumEntry: function<T>(e: T, index: any): PropOf<T> {
        const i = Math.trunc(index);
        return (e[i] ? i : 0) as any as PropOf<T>;
    },

    getEnumName: function<T>(e: T, index: any): string {
        const i = Math.trunc(index);
        return e[i] || e[0];
    },

    isEnumEntry: function<T>(enumeration: number, index: number): boolean {
        return enumeration === Math.trunc(index);
    },

    toInt: function(v: any) {
        return Math.trunc(v);
    },

    Property: <T>(path: string, presetOrSchema: PresetOrSchema<T>, preset?: T) =>
        new Property<T>(path, presetOrSchema, preset),

    Event: (path: string) =>
        new Property<number>(path, { event: true, preset: 0 }),

    Number: (path: string, presetOrSchema?: PresetOrSchema<number>, preset?: number) =>
        new Property<number>(path, presetOrSchema || 0, preset),

    Boolean: (path: string, presetOrSchema?: PresetOrSchema<boolean>, preset?: boolean) =>
        new Property<boolean>(path, presetOrSchema || false, preset),

    String: (path: string, presetOrSchema?: PresetOrSchema<string>, preset?: string) =>
        new Property<string>(path, presetOrSchema || "", preset),

    Enum: <T>(path: string, enumeration: T, preset?: number) =>
        new Property<PropOf<T>>(path, { options: enumToArray(enumeration), preset: (preset || 0) as any as PropOf<T> }),

    Option: (path: string, options: string[], preset?: number) =>
        new Property<number>(path, { options, preset: preset || 0 }),

    Object: <T>(path: string, type?: TypeOf<PropertyObject<T>>) =>
        new Property<PropertyObject<T>>(path, type || null),

    Vector2: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || [0, 0], preset),

    Vector3: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || [0, 0, 0], preset),

    Vector4: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || [0, 0, 0, 0], preset),

    Matrix3: (path: string) =>
        new Property<Matrix>(path, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]),

    Matrix4: (path: string) =>
        new Property<Matrix>(path, [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]),

    ColorRGB: (path: string, preset?: Vector) =>
        new Property<Vector>(path, Schemas.ColorRGB, preset),

    ColorRGBA: (path: string, preset?: Vector) =>
        new Property<Vector>(path, Schemas.ColorRGBA, preset),
};