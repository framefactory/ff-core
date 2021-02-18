/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector2, { IVector2 } from "./Vector2";

////////////////////////////////////////////////////////////////////////////////

export interface IVector3
{
    x: number;
    y: number;
    z: number;
}

/**
 * 3-dimensional vector.
 */
export default class Vector3 implements IVector3
{
    static readonly zeros = new Vector3(0, 0, 0);
    static readonly ones = new Vector3(1, 1, 1);
    static readonly unitX = new Vector3(1, 0, 0);
    static readonly unitY = new Vector3(0, 1, 0);
    static readonly unitZ = new Vector3(0, 0, 1);

    /**
     * Returns a new vector with all components set to zero.
     */
    static makeZeros(): Vector3
    {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns a new vector with all components set to one.
     */
    static makeOnes(): Vector3
    {
        return new Vector3(1, 1, 1);
    }

    /**
     * Returns a new unit-length vector, parallel to the X axis.
     */
    static makeUnitX(): Vector3
    {
        return new Vector3(1, 0, 0);
    }

    /**
     * Returns a new unit-length vector, parallel to the Y axis.
     */
    static makeUnitY(): Vector3
    {
        return new Vector3(0, 1, 0);
    }

    /**
     * Returns a new unit-length vector, parallel to the Z axis.
     */
    static makeUnitZ(): Vector3
    {
        return new Vector3(0, 0, 1);
    }

    /**
     * Returns a new vector with components set from the given vector.
     * @param vector
     */
    static makeCopy(vector: IVector3): Vector3
    {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param scalar
     */
    static makeFromScalar(scalar: number): Vector3
    {
        return new Vector3(scalar, scalar, scalar);
    }

    /**
     * Returns a new vector with components set from the values of the given array.
     * @param array
     */
    static makeFromArray(array: number[]): Vector3
    {
        return new Vector3(array[0], array[1], array[2]);
    }

    /**
     * Returns a string representation of the given vector.
     * @param vector
     */
    static toString(vector: IVector3): string
    {
        return `[${vector.x}, ${vector.y}, ${vector.z}]`;
    }

    /** The vector's x component. */
    x: number;
    /** The vector's y component. */
    y: number;
    /** The vector's z component. */
    z: number;

    /**
     * Constructs a new vector with the given x, y, and z values.
     * Omitted or invalid values are set to zero.
     * @param x
     * @param y
     * @param z
     */
    constructor(x?: number, y?: number, z?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
     * Copies the components of the given vector to this.
     * @param vector
     */
    copy(vector: IVector3): this
    {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        return this;
    }

    /**
     * Sets the components to the given values.
     * @param x
     * @param y
     * @param z
     */
    set(x: number, y: number, z: number): this
    {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Sets each component to the given scalar value.
     * @param scalar
     */
    setFromScalar(scalar: number): this
    {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }

    /**
     * Sets the components to the values of the given array.
     * @param array
     * @param offset Optional start index of the array. Default is 0.
     */
    setFromArray(array: number[], offset = 0): this
    {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }

    /**
     * Sets all components to zero.
     */
    setZeros(): this
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Sets all components to one.
     */
    setOnes(): this
    {
        this.x = 1;
        this.y = 1;
        this.z = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the X axis.
     */
    setUnitX(): this
    {
        this.x = 1;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Y axis.
     */
    setUnitY(): this
    {
        this.x = 0;
        this.y = 1;
        this.z = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Z axis.
     */
    setUnitZ(): this
    {
        this.x = 0;
        this.y = 0;
        this.z = 1;
        return this;
    }

    /**
     * Swaps this and other vector.
     */
    swap(other: IVector3): this
    {
        const x = this.x;
        this.x = other.x;
        other.x = x;

        const y = this.y;
        this.y = other.y;
        other.y = y;

        const z = this.z;
        this.z = other.z;
        other.z = z;

        return this;
    }

    /**
     * Adds the given vector to this.
     * @param other
     */
    add(other: IVector3): this
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * Subtracts the given vector from this.
     * @param other
     */
    subtract(other: IVector3): this
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * Multiplies each component with the corresponding component of the given vector.
     * @param other
     */
    multiply(other: IVector3): this
    {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    /**
     * Divides each component by the corresponding component of the given vector.
     * @param other
     */
    divideBy(other: IVector3): this
    {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    /**
     * Adds the given scalar to each component.
     * @param scalar
     */
    addScalar(scalar: number): this
    {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        return this;
    }

    /**
     * Subtracts the given scalar from each component.
     * @param scalar
     */
    subtractScalar(scalar: number): this
    {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
        return this;
    }

    /**
     * Multiplies each component with the given scalar.
     * @param scalar
     */
    multiplyScalar(scalar: number): this
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * Divides each component by the given scalar.
     * @param scalar
     */
    divideByScalar(scalar: number): this
    {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }

    /**
     * Translates the vector by the given offsets.
     * @param tx
     * @param ty
     * @param tz
     */
    translate(tx: number, ty: number, tz: number): this
    {
        this.x += tx;
        this.y += ty;
        this.z += tz;
        return this;
    }

    /**
     * Rotates the vector by the given angle about the x-axis.
     * @param angle rotation angle in radians.
     */
    rotateX(angle: number): this
    {
        const co = Math.cos(angle);
        const si = Math.sin(angle);

        const y = this.y, z = this.z;
        this.y = co * y - si * z;
        this.z = si * y + co * z;
        return this;
    }

    /**
     * Rotates the vector by the given angle about the y-axis.
     * @param angle rotation angle in radians.
     */
    rotateY(angle: number): this
    {
        const co = Math.cos(angle);
        const si = Math.sin(angle);

        const x = this.x, z = this.z;
        this.x = co * x + si * z;
        this.z = -si * x + co * z;
        return this;
    }

    /**
     * Rotates the vector by the given angle about the z-axis.
     * @param angle rotation angle in radians.
     */
    rotateZ(angle: number): this
    {
        const co = Math.cos(angle);
        const si = Math.sin(angle);

        const x = this.x, y = this.y;
        this.x = co * x - si * y;
        this.y = si * x + co * y;
        return this;
    }

    /**
     * Scales the vector by the given factors.
     * @param sx
     * @param sy
     * @param sz
     */
    scale(sx: number, sy: number, sz: number): this
    {
        this.x *= sx;
        this.y *= sy;
        this.z *= sz;
        return this;
    }

    /**
     * Inverts each component of this, e.g. x = 1 / x, ...
     */
    invert(): this
    {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        this.z = 1 / this.z;
        return this;
    }

    /**
     * Negates each component of this, e.g. x = -x, ...
     */
    negate(): this
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * Normalizes the vector, making it a unit vector.
     */
    normalize(): this
    {
        const f = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x *= f;
        this.y *= f;
        this.z *= f;
        return this;
    }

    /**
     * Makes this vector homogeneous by dividing all components by the z component.
     */
    homogenize(): this
    {
        if (this.z != 0) {
            this.x /= this.z;
            this.y /= this.z;
            this.z = 1;
        }
        return this;
    }

    /**
     * Returns the dot product of this and the given vector.
     * @param other
     */
    dot(other: IVector3): number
    {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Assigns to this the cross product between this and the given vector.
     * @param other
     */
    cross(other: IVector3): this
    {
        const x = this.y * other.z - this.z * other.y;
        const y = this.z * other.x - this.x * other.z;
        const z = this.x * other.y - this.y * other.x;

        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Returns the 2-norm (length) of this.
     */
    length(): number
    {
        const x = this.x, y = this.y, z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     */
    lengthSquared(): number
    {
        const x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * Returns the distance between this and other.
     * @param other
     */
    distanceTo(other: IVector3): number
    {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dz = other.z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Returns the angle in the XY plane between this and the positive X axis.
     * @returns angle in radians.
     */
    angle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the angle in the XY plane between this and the given vector.
     * @param other
     * @returns angle in radians.
     */
    angleTo(other: IVector3): number
    {
        const x0 = this.x, y0 = this.y, x1 = other.x, y1 = other.y;
        return Math.acos((x0*x1 + y0*y1) / (Math.sqrt(x0*x0 + y0*y0) + Math.sqrt(x1*x1 + y1*y1)));
    }

    /**
     * Sets each component to the smaller component of this and other.
     * @param other 
     */
    setMin(other: IVector3): this
    {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        this.z = Math.min(this.z, other.z);
        return this;
    }

    /**
     * Sets each component to the larger component of this and other.
     * @param other
     */
    setMax(other: IVector3): this
    {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        this.z = Math.max(this.z, other.z);
        return this;
    }

    /**
     * Returns the smallest component.
     */
    min(): number
    {
        return this.x < this.y ? (this.x < this.z ? this.x : this.z) : (this.y < this.z ? this.y : this.z);
    }

    /**
     * Returns the largest component.
     */
    max(): number
    {
        return this.x > this.y ? (this.x > this.z ? this.x : this.z) : (this.y > this.z ? this.y : this.z);
    }

    /**
     * Returns true if all components are exactly zero.
     */
    isZero(): boolean
    {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    /**
     * Returns a clone.
     */
    clone(): Vector3
    {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Returns an array with the components of this.
     * @param array Optional destination array.
     * @param offset Optional start index of the array. Default is 0.
     */
    toArray(array?: number[], offset?: number): number[]
    {
        if (array) {
            if (offset === undefined) {
                offset = 0;
            }

            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            return array;
        }

        return [
            this.x,
            this.y,
            this.z
        ];
    }

    /**
     * Returns a [[Vector2]] with the x and y components of this.
     * @param result Optional destination vector.
     */
    toVector2(result?: Vector2): Vector2
    {
        if (result) {
            return result.set(this.x, this.y);
        }

        return new Vector2(this.x, this.y);
    }


    /**
     * Returns a text representation.
     */
    toString(): string
    {
        return Vector3.toString(this);
    }
}