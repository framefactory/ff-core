/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector3, { IVector3 } from "./Vector3.js";

////////////////////////////////////////////////////////////////////////////////

export interface IBox3
{
    min: IVector3;
    max: IVector3;
}

/**
 * 3-dimensional, axis aligned box.
 * The box is defined by a set of minimum and a set of maximum coordinates.
 */

export default class Box3 implements IBox3
{
    static makeFromPoints(min: IVector3, max: IVector3): Box3
    {
        return new Box3(min.x, min.y, min.z, max.x, max.y, max.z);
    }

    static makeInvalid(): Box3
    {
        return new Box3(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity);
    }

    min: Vector3;
    max: Vector3;

    /**
     * Creates a new Box3 object, initialized with the given minimum and maximum coordinates.
     * If no values are provided, minimum and maximum are set to zero.
     */
     constructor(minX?: number, minY?: number, minZ?: number, maxX?: number, maxY?: number, maxZ?: number)
    {
        this.min = new Vector3(minX, minY, minZ);
        this.max = new Vector3(maxX, maxY, maxZ);
    }

    get sizeX(): number {
        return this.max.x - this.min.x;
    }

    get sizeY(): number {
        return this.max.y - this.min.y;
    }

    get sizeZ(): number {
        return this.max.z - this.min.z;
    }

    get centerX(): number {
        return (this.min.x + this.max.x) * 0.5;
    }

    get centerY(): number {
        return (this.min.y + this.max.y) * 0.5;
    }

    get centerZ(): number {
        return (this.min.z + this.max.z) * 0.5;
    }

    getSize(): Vector3;
    getSize<T extends IVector3>(result: T): T;
    getSize(result?: IVector3): IVector3
    {
        const sx = this.max.x - this.min.x;
        const sy = this.max.y - this.min.y;
        const sz = this.max.z - this.min.z;

        if (result) {
            result.x = sx;
            result.y = sy;
            result.z = sz;
            return result;
        }

        return new Vector3(sx, sy, sz);
    }

    getCenter(): Vector3;
    getCenter<T extends IVector3>(result: T): T;
    getCenter(result?: IVector3): IVector3
    {
        const cx = (this.min.x + this.max.x) * 0.5;
        const cy = (this.min.y + this.max.y) * 0.5;
        const cz = (this.min.z + this.max.z) * 0.5;

        if (result) {
            result.x = cx;
            result.y = cy;
            result.z = cz;
            return result;
        }

        return new Vector3(cx, cy, cz);
    }

    set(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number)
    {
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }

    setFromPoints(min: IVector3, max: IVector3)
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
        this.min.set(Infinity, Infinity, Infinity);
        this.max.set(-Infinity, -Infinity, -Infinity);

        return this;
    }

    /**
     * Returns true if both minimum and maximum coordinates are finite.
     */
    isValid(): boolean
    {
        return isFinite(this.max.x - this.min.x)
            && isFinite(this.max.y - this.min.y)
            && isFinite(this.max.z - this.min.z);
    }

    contains(x: number, y: number, z: number): boolean
    {
        return x >= this.min.x && x < this.max.x
            && y >= this.min.y && y < this.max.y
            && z >= this.min.z && z < this.max.z;
    }

    containsPoint(point: IVector3): boolean
    {
        return point.x >= this.min.x && point.x < this.max.x
            && point.y >= this.min.y && point.y < this.max.y
            && point.z >= this.min.z && point.z < this.max.z;
    }

    uniteWith(other: IBox3): this
    {
        const p0 = this.min, p1 = this.max;

        p0.set(Math.min(p0.x, other.min.x), Math.min(p0.y, other.min.y), Math.min(p0.z, other.min.z));
        p1.set(Math.max(p1.x, other.max.x), Math.max(p1.y, other.max.y), Math.max(p1.z, other.max.z));

        return this;
    }

    intersectWith(other: IBox3): this
    {
        const min = this.min, max = this.max;

        min.set(Math.max(min.x, other.min.x), Math.max(min.y, other.min.y), Math.max(min.z, other.min.z));
        max.set(Math.min(max.x, other.max.x), Math.min(max.y, other.max.y), Math.min(max.z, other.max.z));

        return this;
    }

    include(x: number, y: number, z: number): this
    {
        const min = this.min, max = this.max;

        min.x = Math.min(min.x, x);
        min.y = Math.min(min.y, y);
        min.z = Math.min(min.z, z);

        max.x = Math.max(max.x, x);
        max.y = Math.max(max.y, y);
        max.z = Math.max(max.z, z);

        return this;
    }

    includePoint(point: IVector3): this
    {
        const min = this.min, max = this.max;

        min.x = Math.min(min.x, point.x);
        min.y = Math.min(min.y, point.y);
        min.z = Math.min(min.z, point.z);

        max.x = Math.max(max.x, point.x);
        max.y = Math.max(max.y, point.y);
        max.z = Math.max(max.z, point.z);

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
        if (min.z > max.z) {
            const t = min.z; min.z = max.z; max.z = t;
        }

        return this;
    }

    toString(): string
    {
        return `min: ${this.min.toString()}, max: ${this.max.toString()}`;
    }
}