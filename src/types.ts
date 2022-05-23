/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

////////////////////////////////////////////////////////////////////////////////
// HELPER TYPES

export type Index = number;

export type Identifier = string;

export type Constructor<T = any> = {
    new (...args: any[]): T;
}

export interface Type extends Function {
    new (...args: any[]): object;
}

export interface TypeOf<T> extends Function {
    new (...args: any[]): T;
}

export type PropOf<T> = T extends {} ? T[keyof T] : never;

export type ReturnType<T extends Function> =
    T extends (...args: any[]) => infer returnType ? returnType : never


export type PrimitiveType = number | boolean | string;

export type Identifiable<T extends object = object> = T & { id: Identifier };

export type MaybeIdentifiable<T extends object = object> = T & { id?: Identifier };

export type Dictionary<T> = { [id: string]: T };

export type Transformable<U, A, TA, B, TB>
    = U extends A ? TA
    : U extends B ? TB
    : TA | TB;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>

export type PartialOptional<T, U> = Pick<T, Exclude<keyof T, keyof U>> & Partial<U>

export type Record<K extends keyof any, T> = { [P in K]: T; };

export type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };

export type TypedArray = ArrayLike<number> & {
    BYTES_PER_ELEMENT: number;
    byteLength: number;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): TypedArray;
    [Symbol.toStringTag]: any;
};

export type TypedArrayConstructor<T extends TypedArray> = {
    new (): T;
    new (size: number): T;
    new (buffer: ArrayBuffer): T;
    BYTES_PER_ELEMENT: number;
}

