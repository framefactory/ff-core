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

export const schemas = {
    vector2: { preset: [0, 0] },
    vector2_ones: { preset: [1, 1] },
    vector3: { preset: [0, 0, 0] },
    vector3_ones: { preset: [1, 1, 1] },
    vector4: { preset: [0, 0, 0, 0] },
    vector4_ones: { preset: [1, 1, 1, 1] },
    matrix2: { preset: [1, 0, 0, 1] },
    matrix3: { preset: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    matrix4: { preset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    integer: { preset: 0, step: 1 } as IPropertySchema<number>,
    colorRGB: { preset: [1, 1, 1], semantic: "color" } as IPropertySchema<Vector>,
    colorRGBA: { preset: [1, 1, 1, 1], semantic: "color" } as IPropertySchema<Vector>
};

export const types = {
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

    getEnumIndex: function<T>(e: T, index: any): PropOf<T> {
        const i = Math.trunc(index);
        return (e[i] ? i : 0) as any as PropOf<T>;
    },

    getEnumName: function<T>(e: T, index: any): string {
        const i = Math.trunc(index);
        return e[i] || e[0];
    },

    isEnumIndex: function<T>(enumeration: number, index: number): boolean {
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
        new Property<Vector>(path, presetOrSchema || schemas.vector2, preset),

    Vector2_Ones: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || schemas.vector2_ones, preset),

    Vector3: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || schemas.vector3, preset),

    Vector3_Ones: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || schemas.vector3_ones, preset),

    Vector4: (path: string, presetOrSchema?: PresetOrSchema<Vector>, preset?: Vector) =>
        new Property<Vector>(path, presetOrSchema || schemas.vector4, preset),

    Matrix3: (path: string) =>
        new Property<Matrix>(path, schemas.matrix3),

    Matrix4: (path: string) =>
        new Property<Matrix>(path, schemas.matrix4),

    ColorRGB: (path: string, preset?: Vector) =>
        new Property<Vector>(path, schemas.colorRGB, preset),

    ColorRGBA: (path: string, preset?: Vector) =>
        new Property<Vector>(path, schemas.colorRGBA, preset),
};