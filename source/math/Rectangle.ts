/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector2, { IVector2 } from "./Vector2";

////////////////////////////////////////////////////////////////////////////////

export default class Rectangle
{
    static makeZero()
    {
        return new Rectangle(0, 0, 0, 0);
    }

    /**
     * Returns a new rectangle where the minimum point is set to maximum values,
     * and the maximum point is set to minimum values.
     */
    static makeInvalid()
    {
        return new Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    }

    p0: Vector2;
    p1: Vector2;

    constructor(p0x?: number, p0y?: number, p1x?: number, p1y?: number)
    {
        this.p0 = new Vector2(p0x, p0y);
        this.p1 = new Vector2(p1x, p1y);
    }

    set(p0x: number, p0y: number, p1x: number, p1y: number): Rectangle
    {
        this.p0.set(p0x, p0y);
        this.p1.set(p1x, p1y);

        return this;
    }

    setPoints(p0: IVector2, p1: IVector2): Rectangle
    {
        this.p0.setVector(p0);
        this.p1.setVector(p1);

        return this;
    }

    unite(other: Rectangle): Rectangle
    {
        this.p0.set(Math.min(this.p0.x, other.p0.x), Math.min(this.p0.y, other.p0.y));
        this.p1.set(Math.max(this.p1.x, other.p1.x), Math.max(this.p1.y, other.p1.y));

        return this;
    }

    intersect(other: Rectangle): Rectangle
    {
        this.p0.set(Math.max(this.p0.x, other.p0.x), Math.max(this.p0.y, other.p0.y));
        this.p1.set(Math.min(this.p1.x, other.p1.x), Math.min(this.p1.y, other.p1.y));

        return this;
    }

    include(point: IVector2): Rectangle
    {
        this.p0.x = Math.min(this.p0.x, point.x);
        this.p0.y = Math.min(this.p0.y, point.y);

        this.p1.x = Math.max(this.p1.x, point.x);
        this.p1.y = Math.max(this.p1.y, point.y);

        return this;
    }
}