/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

////////////////////////////////////////////////////////////////////////////////
// HELPER TYPES

export type Index = number;

export type Identifier = string;

export interface TypeOf<T> extends Function {
    new (...args: any[]): T;
}

export type ReturnType<T extends Function> =
    T extends (...args: any[]) => infer returnType ? returnType : never


export type PrimitiveType = number | boolean | string;

export type Identifiable<T> = T & { id: Identifier };

export type Dictionary<T> = { [id: string]: T };

export type Transformable<U, A, TA, B, TB>
    = U extends A ? TA
    : U extends B ? TB
    : TA | TB;

export type Partial<T> = { [P in keyof T]?: T[P]; };

export type Readonly<T> = { readonly [P in keyof T]: T[P]; };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>

