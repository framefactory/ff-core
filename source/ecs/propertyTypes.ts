/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { TypeOf } from "../types";
import Property, { IPropertySchema, PresetOrSchema } from "./Property";
import PropertyObject from "./PropertyObject";

////////////////////////////////////////////////////////////////////////////////

type Vector<T = number> = T[];
type Vector2<T = number> = [T, T];
type Vector3<T = number> = [T, T, T];
type Vector4<T = number> = [T, T, T, T];
type Matrix3<T = number> = [T, T, T, T, T, T, T, T, T];
type Matrix4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T];

export namespace Schemas
{
    export const Integer: IPropertySchema<number> = { preset: 0, step: 1 };
    export const ColorRGB: IPropertySchema<Vector3> = { preset: [1, 1, 1], semantic: "color" };
    export const ColorRGBA: IPropertySchema<Vector4> = { preset: [1, 1, 1, 1], semantic: "color" };
}

export default {
    Property: <T>(path: string, presetOrSchema: PresetOrSchema<T>, preset?: T) =>
        new Property<T>(path, presetOrSchema, preset),

    Number: (path: string, presetOrSchema?: PresetOrSchema<number>, preset?: number) =>
        new Property<number>(path, presetOrSchema || 0, preset),

    Boolean: (path: string, presetOrSchema?: PresetOrSchema<boolean>, preset?: boolean) =>
        new Property<boolean>(path, presetOrSchema || false, preset),

    String: (path: string, presetOrSchema?: PresetOrSchema<string>, preset?: string) =>
        new Property<string>(path, presetOrSchema || "", preset),

    Enum: (path: string, options: string[], preset?: number) =>
        new Property<number>(path, { options, preset: preset || 0 }),

    Object: <T>(path: string, type?: TypeOf<PropertyObject<T>>) =>
        new Property<PropertyObject<T>>(path, type || null),

    Vector2: (path: string, presetOrSchema?: PresetOrSchema<Vector2>, preset?: Vector2) =>
        new Property<Vector2>(path, presetOrSchema || [0, 0], preset),

    Vector3: (path: string, presetOrSchema?: PresetOrSchema<Vector3>, preset?: Vector3) =>
        new Property<Vector3>(path, presetOrSchema || [0, 0, 0], preset),

    Vector4: (path: string, presetOrSchema?: PresetOrSchema<Vector4>, preset?: Vector4) =>
        new Property<Vector4>(path, presetOrSchema || [0, 0, 0, 0], preset),

    Matrix3: (path: string) =>
        new Property<Matrix3>(path, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]),

    Matrix4: (path: string) =>
        new Property<Matrix4>(path, [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]),

    ColorRGB: (path: string, preset?: Vector3) =>
        new Property<Vector3>(path, Schemas.ColorRGB, preset),

    ColorRGBA: (path: string, preset?: Vector4) =>
        new Property<Vector4>(path, Schemas.ColorRGBA, preset),
};