/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

////////////////////////////////////////////////////////////////////////////////

export interface IQuaternion
{
    x: number;
    y: number;
    z: number;
    w: number;
}

export class Quaternion implements IQuaternion
{
    x: number;
    y: number;
    z: number;
    w: number;
}