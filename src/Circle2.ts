/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector2, { IVector2 } from "./Vector2";

////////////////////////////////////////////////////////////////////////////////

export default class Circle2
{
    p: Vector2;
    r: number;

    constructor(x = 0, y = 0, r = 1)
    {
        this.p = new Vector2(x, y);
        this.r = r;
    }

    translate(tx: number, ty: number)
    {
        this.p.translate(tx, ty);
    }

    distanceTo(point: IVector2)
    {
        return Math.abs(this.p.distanceTo(point) - this.r);
    }
}