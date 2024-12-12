/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { PropOf, Dictionary } from "./types.js";
import { enumToArray } from "./enum.js";

////////////////////////////////////////////////////////////////////////////////

export interface IPropertyTemplate<T>
{
    path: string;
    schema: IPropertySchema<T>;
}

export interface IPropertySchema<T>
{
    preset: T;
    min?: number;
    max?: number;
    step?: number;
    speed?: number;
    precision?: number;
    bar?: boolean;
    percent?: boolean;
    options?: string[];
    labels?: string[];
    semantic?: string;
}

export type SchemaProps<T> = Partial<IPropertySchema<T>> | T;

type Vector<T = number> = T[];
type Matrix<T = number> = T[];

export const labels = {
    xyzw: [ "X", "Y", "Z", "W" ],
    rgba: [ "R", "G", "B", "A" ],
};

const parseProps = function<T>(props: SchemaProps<T>) {
    if (props === undefined || (typeof props === "object" && !Array.isArray(props))) {
        return props;
    }

    return { preset: props } as SchemaProps<T>;
};

export const makeType = function<T>(schema: IPropertySchema<T>, path: string, props: SchemaProps<T>): IPropertyTemplate<T> {
    props = parseProps(props);
    return { path, schema: props ? Object.assign({}, schema, props) : schema };
};

export const makeEnumType = function<T extends object>(enumeration: T, path: string, props: SchemaProps<PropOf<T>>): IPropertyTemplate<PropOf<T>> {
    props = parseProps(props);
    const schema = { enum: enumeration, options: enumToArray(enumeration), preset: 0 as unknown as PropOf<T> };
    return { path, schema: props ? Object.assign({}, schema, props) : schema };
};

export const makeOptionType = function(options: string[], path: string, props: SchemaProps<number>): IPropertyTemplate<number> {
    props = parseProps(props);
    const schema = { options, preset: 0 };
    return { path, schema: props ? Object.assign({}, schema, props) : schema };
};

export const schemas: Dictionary<IPropertySchema<any>> = {
    Number: { preset: 0 },
    Integer: { preset: 0, step: 1, speed: 0.34, precision: 0 },
    Natural: { preset: 0, step: 1, speed: 0.34, precision: 0, min: 0 },
    Unit: { preset: 0, min: 0, max: 1, bar: true },
    Percent: { preset: 0, min: 0, max: 1, bar: true, percent: true },
    Vector2: { preset: [0, 0] },
    Vector3: { preset: [0, 0, 0] },
    Vector4: { preset: [0, 0, 0, 0] },
    Matrix2: { preset: [1, 0, 0, 1] },
    Matrix3: { preset: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    Matrix4: { preset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    Scale: { preset: 1 },
    Scale2: { preset: [1, 1] },
    Scale3: { preset: [1, 1, 1] },
    IntVec2: { preset: [0, 0], step: 1, speed: 0.34, precision: 0 },
    IntVec3: { preset: [0, 0, 0], step: 1, speed: 0.34, precision: 0 },
    ColorRGB: { preset: [1, 1, 1], semantic: "color", labels: labels.rgba, min: 0, max: 1, bar: true },
    ColorRGBA: { preset: [1, 1, 1, 1], semantic: "color", labels: labels.rgba, min: 0, max: 1, bar: true },
    Boolean: { preset: false },
    String: { preset: "" },
    AssetPath: { preset: "", semantic: "asset-path" },
};

export const types = {
    Property: <T>(path: string, props?: SchemaProps<T>) => makeType<T>(undefined, path, props),
    Number: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Number, path, props),
    Integer: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Integer, path, props),
    Natural: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Natural, path, props),
    Unit: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Unit, path, props),
    Percent: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Percent, path, props),
    Vector2: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.Vector2, path, props),
    Vector3: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.Vector3, path, props),
    Vector4: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.Vector4, path, props),
    IntVec2: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.IntVec2, path, props),
    IntVec3: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.IntVec3, path, props),
    Matrix2: (path: string, props?: SchemaProps<Matrix>) => makeType<Matrix>(schemas.Matrix2, path, props),
    Matrix3: (path: string, props?: SchemaProps<Matrix>) => makeType<Matrix>(schemas.Matrix3, path, props),
    Matrix4: (path: string, props?: SchemaProps<Matrix>) => makeType<Matrix>(schemas.Matrix4, path, props),
    Scale: (path: string, props?: SchemaProps<number>) => makeType<number>(schemas.Scale, path, props),
    Scale2: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.Scale2, path, props),
    Scale3: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.Scale3, path, props),
    ColorRGB: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.ColorRGB, path, props),
    ColorRGBA: (path: string, props?: SchemaProps<Vector>) => makeType<Vector>(schemas.ColorRGBA, path, props),
    Boolean: (path: string, props?: SchemaProps<boolean>) => makeType<boolean>(schemas.Boolean, path, props),
    String: (path: string, props?: SchemaProps<string>) => makeType<string>(schemas.String, path, props),
    AssetPath: (path: string, props?: SchemaProps<string>) => makeType<string>(schemas.AssetPath, path, props),
    Enum: <T extends object>(path: string, enumeration: T, props?: SchemaProps<PropOf<T>>) => makeEnumType(enumeration, path, props),
    Option: (path: string, options: string[], props?: SchemaProps<number>) => makeOptionType(options, path, props),
};