/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector3, { IVector3 } from "./Vector3";

////////////////////////////////////////////////////////////////////////////////

export interface IVector4
{
    x: number;
    y: number;
    z: number;
    w: number;
}

export default class Vector4
{
    /**
     * Returns a new vector with all components set to zero.
     * @returns {Vector4}
     */
    static makeZeros(): Vector4
    {
        return new Vector4(0, 0, 0, 0);
    }

    /**
     * Returns a new vector with all components set to one.
     * @returns {Vector4}
     */
    static makeOnes(): Vector4
    {
        return new Vector4(1, 1, 1, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the X axis.
     * @returns {Vector4}
     */
    static makeUnitX(): Vector4
    {
        return new Vector4(1, 0, 0, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the Y axis.
     * @returns {Vector4}
     */
    static makeUnitY(): Vector4
    {
        return new Vector4(0, 1, 0, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the Z axis.
     * @returns {Vector4}
     */
    static makeUnitZ(): Vector4
    {
        return new Vector4(0, 0, 1, 1);
    }

    /**
     * Returns a new vector with components set from the given vector.
     * @param {Vector4} vector
     * @returns {Vector4}
     */
    static makeFromVector(vector: IVector4)
    {
        return new Vector4(vector.x, vector.y, vector.z, vector.w);
    }

    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param {number} scalar
     * @returns {Vector4}
     */
    static makeFromScalar(scalar: number)
    {
        return new Vector4(scalar, scalar, scalar, scalar);
    }

    /**
     * Returns a new vector with components set from the values of the given array.
     * @param {number[]} array
     * @returns {Vector4}
     */
    static makeFromArray(array: number[]): Vector4
    {
        return new Vector4(array[0], array[1], array[2], array[3]);
    }

    x: number;
    y: number;
    z: number;
    w: number;

    /**
     * Returns a new positional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 0.
     * @param {Vector3} position
     * @returns {Vector4}
     */
    static makeFromPosition(position: IVector3): Vector4
    {
        return new Vector4(position.x, position.y, position.z, 0);
    }

    /**
     * Returns a new directional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 1.
     * @param {Vector3} direction
     * @returns {Vector4} this
     */
    static makeFromDirection(direction: IVector3): Vector4
    {
        return new Vector4(direction.x, direction.y, direction.z, 1);
    }

    /**
     * Constructs a new vector with the given x and y values.
     * If the parameters are omitted, the components are set to zero.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     */
    constructor(x?: number, y?: number, z?: number, w?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    /**
     * Sets the components of this to the given values.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     * @returns {Vector4} this
     */
    set(x: number, y: number, z: number, w: number): Vector4
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }

    /**
     * Copies the components of the given vector to this.
     * @param {Vector4} vector
     * @returns {Vector4}
     */
    setVector(vector: IVector4): Vector4
    {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        this.w = vector.w;
        return this;
    }

    /**
     * Sets each component of this to the given scalar value.
     * @param {number} scalar
     * @returns {Vector4}
     */
    setScalar(scalar: number): Vector4
    {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        this.w = scalar;
        return this;
    }

    /**
     * Sets the components of this to the values of the given array.
     * @param {number[]} array
     * @returns {Vector4} this
     */
    setArray(array: number[]): Vector4
    {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        this.w = array[3];
        return this;
    }

    /**
     * Sets this as positional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 0.
     * @param {Vector3} position
     * @returns {Vector4} this
     */
    setPosition(position: IVector3): Vector4
    {
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
        this.w = 0;
        return this;
    }

    /**
     * Sets this as directional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 1.
     * @param {Vector3} direction
     * @returns {Vector4} this
     */
    setDirection(direction: IVector3): Vector4
    {
        this.x = direction.x;
        this.y = direction.y;
        this.z = direction.z;
        this.w = 1;
        return this;
    }

    /**
     * Sets all components of this to zero.
     * @returns {Vector4} this
     */
    setZeroes(): Vector4
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        return this;
    }

    /**
     * Sets all components of this to one.
     * @returns {Vector4} this
     */
    setOnes(): Vector4
    {
        this.x = 1;
        this.y = 1;
        this.z = 1;
        this.w = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the X axis.
     * @returns {Vector4} this
     */
    setUnitX(): Vector4
    {
        this.x = 1;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Y axis.
     * @returns {Vector4} this
     */
    setUnitY(): Vector4
    {
        this.x = 0;
        this.y = 1;
        this.z = 0;
        this.w = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Z axis.
     * @returns {Vector4} this
     */
    setUnitZ(): Vector4
    {
        this.x = 0;
        this.y = 0;
        this.z = 1;
        this.w = 1;
        return this;
    }

    /**
     * Adds the given vector to this.
     * @param {Vector4} other
     * @returns {Vector4} this
     */
    add(other: IVector4): Vector4
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    }

    /**
     * Subtracts the given vector from this.
     * @param {Vector4} other
     * @returns {Vector4} this
     */
    sub(other: IVector4): Vector4
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
        return this;
    }

    /**
     * Component-wise multiplication of this with the given vector.
     * @param {Vector4} other
     * @returns {Vector4} this
     */
    mul(other: IVector4): Vector4
    {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        this.w *= other.w;
        return this;
    }

    /**
     * Component-wise division of this by the given vector.
     * @param {Vector4} other
     * @returns {Vector4} this
     */
    div(other: IVector4): Vector4
    {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        this.w /= other.w;
        return this;
    }

    /**
     * Normalizes this, making it a unit vector.
     * @returns {Vector4} this
     */
    normalize(): Vector4
    {
        const f = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x *= f;
        this.y *= f;
        this.z *= f;
        this.w *= f;
        return this;
    }

    /**
     * Makes this homogeneous by dividing all components by the last components.
     * @returns {Vector4} this
     */
    homogenize(): Vector4
    {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        this.w = 1;
        return this;
    }

    /**
     * Projects this onto the given vector.
     * @param {Vector4} other
     * @returns {Vector4}
     */
    project(other: IVector4): Vector4
    {
        const f = this.dot(other) / this.lengthSquared();
        this.x *= f;
        this.y *= f;
        this.z *= f;
        this.w *= f;
        return this;
    }

    /**
     * Returns the dot product of this and the given vector.
     * @param {Vector4} other
     * @returns {number}
     */
    dot(other: IVector4): number
    {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    }

    /**
     * Returns the 2-norm (length) of this.
     * @returns {number}
     */
    length(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     * @returns {number}
     */
    lengthSquared(): number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    /**
     * Returns true if all components are zero.
     * @returns {boolean}
     */
    isZero(): boolean
    {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0;
    }

    /**
     * Returns a clone of this.
     * @returns {Vector4}
     */
    clone(): Vector4
    {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    /**
     * Returns an array with the components of this vector.
     * If an array is given, the components of this are copied into it.
     * @param {number[]} array
     * @returns {number[]}
     */
    toArray(array?: number[]): number[]
    {
        if (array) {
            array[0] = this.x;
            array[1] = this.y;
            array[2] = this.z;
            array[3] = this.w;
            return array;
        }

        return [
            this.x,
            this.y,
            this.z,
            this.w
        ];
    }

    /**
     * Returns a [[Vector3]] with the x, y, and z components of this vector.
     * If a vector is given, the components of this are copied into it.
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    toVector3(vector?: Vector3): Vector3
    {
        if (vector) {
            vector.x = this.x;
            vector.y = this.y;
            vector.z = this.z;
            return vector;
        }

        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Returns a text representation of this.
     * @returns {string}
     */
    toString()
    {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}