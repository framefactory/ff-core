/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Vector2, IVector2 } from "./Vector2.js";

////////////////////////////////////////////////////////////////////////////////

export interface IBox2
{
    min: IVector2;
    max: IVector2;
}

/**
 * 2-dimensional, axis aligned box.
 * The box is defined by a set of minimum and a set of maximum coordinates.
 */
export class Box2 implements IBox2
{
    static makeFromPoints(min: IVector2, max: IVector2): Box2
    {
        return new Box2(min.x, min.y, max.x, max.y);
    }

    static makeInvalid(): Box2
    {
        return new Box2(Infinity, Infinity, -Infinity, -Infinity);
    }

    min: Vector2;
    max: Vector2;

    /**
     * Creates a new Box2 object, initialized with the given minimum and maximum coordinates.
     * If no values are provided, minimum and maximum are set to zero.
     */
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number)
    {
        this.min = new Vector2(minX, minY);
        this.max = new Vector2(maxX, maxY);
    }

    get sizeX(): number {
        return this.max.x - this.min.x;
    }

    get sizeY(): number {
        return this.max.y - this.min.y;
    }

    get centerX(): number {
        return (this.min.x + this.max.x) * 0.5;
    }

    get centerY(): number {
        return (this.min.y + this.max.y) * 0.5;
    }

    getSize(): Vector2;
    getSize<T extends IVector2>(result: T): T;
    getSize(result?: IVector2): IVector2
    {
        const sx = this.max.x - this.min.x;
        const sy = this.max.y - this.min.y;

        if (result) {
            result.x = sx;
            result.y = sy;
            return result;
        }

        return new Vector2(sx, sy);
    }

    getCenter(): Vector2;
    getCenter<T extends IVector2>(result: T): T;
    getCenter(result?: IVector2): IVector2
    {
        const cx = (this.min.x + this.max.x) * 0.5;
        const cy = (this.min.y + this.max.y) * 0.5;

        if (result) {
            result.x = cx;
            result.y = cy;
            return result;
        }

        return new Vector2(cx, cy);
    }

    set(minX: number, minY: number, maxX: number, maxY: number): this
    {
        this.min.set(minX, minY);
        this.max.set(maxX, maxY);

        return this;
    }

    setFromPoints(min: IVector2, max: IVector2): this
    {
        this.min.copy(min);
        this.max.copy(max);

        return this;
    }

    /**
     * Invalidates the box by setting minimum coordinates to positive infinity,
     * and maximum coordinates to negative infinity.
     */
    invalidate(): this
    {
        this.min.set(Infinity, Infinity);
        this.max.set(-Infinity, -Infinity);

        return this;
    }

    /**
     * Returns true if both minimum and maximum coordinates are finite.
     */
    isValid(): boolean
    {
        return isFinite(this.max.x - this.min.x)
            && isFinite(this.max.y - this.min.y);
    }

    contains(x: number, y: number): boolean
    {
        return x >= this.min.x && x < this.max.x
            && y >= this.min.y && y < this.max.y;
    }

    containsPoint(point: IVector2): boolean
    {
        return point.x >= this.min.x && point.x < this.max.x
            && point.y >= this.min.y && point.y < this.max.y;
    }

    uniteWith(other: IBox2): this
    {
        const p0 = this.min, p1 = this.max;

        p0.set(Math.min(p0.x, other.min.x), Math.min(p0.y, other.min.y));
        p1.set(Math.max(p1.x, other.max.x), Math.max(p1.y, other.max.y));

        return this;
    }

    intersectWith(other: IBox2): this
    {
        const min = this.min, max = this.max;

        min.set(Math.max(min.x, other.min.x), Math.max(min.y, other.min.y));
        max.set(Math.min(max.x, other.max.x), Math.min(max.y, other.max.y));

        return this;
    }

    include(x: number, y: number): this
    {
        const min = this.min, max = this.max;

        min.x = Math.min(min.x, x);
        min.y = Math.min(min.y, y);

        max.x = Math.max(max.x, x);
        max.y = Math.max(max.y, y);

        return this;
    }

    includePoint(point: IVector2): this
    {
        const min = this.min, max = this.max;

        min.x = Math.min(min.x, point.x);
        min.y = Math.min(min.y, point.y);

        max.x = Math.max(max.x, point.x);
        max.y = Math.max(max.y, point.y);

        return this;
    }

    /**
     * Ensures minimum coordinates are smaller than maximum coordinates.
     * Swaps coordinates if necessary.
     */
    normalize(): this
    {
        const min = this.min, max = this.max;

        if (min.x > max.x) {
            const t = min.x; min.x = max.x; max.x = t;
        }
        if (min.y > max.y) {
            const t = min.y; min.y = max.y; max.y = t;
        }

        return this;
    }

    toString(): string
    {
        return `min: ${this.min.toString()}, max: ${this.max.toString()}`;
    }
}