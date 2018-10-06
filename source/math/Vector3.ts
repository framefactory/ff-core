/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Vector2 from "./Vector2";

////////////////////////////////////////////////////////////////////////////////

export interface IVector3
{
    x: number;
    y: number;
    z: number;
}

export default class Vector3 implements IVector3
{
    /**
     * Returns a new vector with all components set to zero.
     * @returns {Vector3}
     */
    static makeZeros()
    {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns a new vector with all components set to one.
     * @returns {Vector3}
     */
    static makeOnes()
    {
        return new Vector3(1, 1, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the X axis.
     * @returns {Vector3}
     */
    static makeUnitX()
    {
        return new Vector3(1, 0, 0);
    }

    /**
     * Returns a new vector of unit length, parallel to the Y axis.
     * @returns {Vector3}
     */
    static makeUnitY()
    {
        return new Vector3(0, 1, 0);
    }

    /**
     * Returns a new vector of unit length, parallel to the Z axis.
     * @returns {Vector3}
     */
    static makeUnitZ()
    {
        return new Vector3(0, 0, 1);
    }

    /**
     * Returns a new vector with components set from the given vector.
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    static makeFromVector(vector: IVector3)
    {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param {number} scalar
     * @returns {Vector3}
     */
    static makeFromScalar(scalar: number)
    {
        return new Vector3(scalar, scalar, scalar);
    }

    /**
     * Returns a new vector with components set from the values of the given array.
     * @param {number[]} array
     * @returns {Vector3}
     */
    static makeFromArray(array: number[])
    {
        return new Vector3(array[0], array[1], array[2]);
    }

    x: number;
    y: number;
    z: number;

    /**
     * Constructs a new vector with the given x and y values.
     * If the parameters are omitted, the components are set to zero.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x?: number, y?: number, z?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
     * Sets the components of this to the given values.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3} this
     */
    set(x: number, y: number, z: number): Vector3
    {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Copies the components of the given vector to this.
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    setVector(vector: IVector3): Vector3
    {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        return this;
    }

    /**
     * Sets each component of this to the given scalar value.
     * @param {number} scalar
     * @returns {Vector3}
     */
    setScalar(scalar: number): Vector3
    {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }

    /**
     * Sets the components of this to the values of the given array.
     * @param {number[]} array
     * @returns {Vector3} this
     */
    setArray(array: number[]): Vector3
    {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        return this;
    }

    /**
     * Sets all components of this to zero.
     * @returns {Vector3} this
     */
    setZeroes(): Vector3
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Sets all components of this to one.
     * @returns {Vector3} this
     */
    setOnes(): Vector3
    {
        this.x = 1;
        this.y = 1;
        this.z = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the X axis.
     * @returns {Vector3} this
     */
    setUnitX(): Vector3
    {
        this.x = 1;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Y axis.
     * @returns {Vector3} this
     */
    setUnitY(): Vector3
    {
        this.x = 0;
        this.y = 1;
        this.z = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Z axis.
     * @returns {Vector3} this
     */
    setUnitZ(): Vector3
    {
        this.x = 0;
        this.y = 0;
        this.z = 1;
        return this;
    }

    /**
     * Adds the given vector to this.
     * @param {Vector3} other
     * @returns {Vector3} this
     */
    add(other: IVector3): Vector3
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * Subtracts the given vector from this.
     * @param {Vector3} other
     * @returns {Vector3} this
     */
    sub(other: IVector3): Vector3
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * Component-wise multiplication of this with the given vector.
     * @param {Vector3} other
     * @returns {Vector3} this
     */
    mul(other: IVector3): Vector3
    {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    /**
     * Component-wise division of this by the given vector.
     * @param {Vector3} other
     * @returns {Vector3} this
     */
    div(other: IVector3): Vector3
    {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    /**
     * Adds the given scalar to each component of this.
     * @param {number} scalar
     * @returns {Vector3}
     */
    addScalar(scalar: number): Vector3
    {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        return this;
    }

    /**
     * Subtracts the given scalar from each component of this.
     * @param {number} scalar
     * @returns {Vector3}
     */
    subScalar(scalar: number): Vector3
    {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
        return this;
    }

    /**
     * Multiplies each component of this with the given scalar.
     * @param {number} scalar
     * @returns {Vector3}
     */
    mulScalar(scalar: number): Vector3
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * Divides each component of this by the given scalar.
     * @param {number} scalar
     * @returns {Vector3}
     */
    divScalar(scalar: number): Vector3
    {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }

    /**
     * Inverts each component of this, e.g. x = 1 / x, ...
     * @returns {Vector3}
     */
    invert(): Vector3
    {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        this.z = 1 / this.z;
        return this;
    }

    /**
     * Negates each component of this, e.g. x = -x, ...
     * @returns {Vector3}
     */
    negate(): Vector3
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * Normalizes this, making it a unit vector.
     * @returns {Vector3} this
     */
    normalize(): Vector3
    {
        const f = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x *= f;
        this.y *= f;
        this.z *= f;
        return this;
    }

    /**
     * Makes this homogeneous by dividing all components by the last components.
     * @returns {Vector3} this
     */
    homogenize(): Vector3
    {
        this.x /= this.z;
        this.y /= this.z;
        this.z = 1;
        return this;
    }

    /**
     * Returns the dot product of this and the given vector.
     * @param {Vector3} other
     * @returns {number}
     */
    dot(other: IVector3): number
    {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: IVector3): Vector3
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
     * @returns {number}
     */
    length(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     * @returns {number}
     */
    lengthSquared(): number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * Returns the minimum component of this.
     * @returns {number}
     */
    min()
    {
        return this.x < this.y ? (this.x < this.z ? this.x : this.z) : (this.y < this.z ? this.y : this.z);
    }

    /**
     * Returns the maximum component of this.
     * @returns {number}
     */
    max()
    {
        return this.x > this.y ? (this.x > this.z ? this.x : this.z) : (this.y > this.z ? this.y : this.z);
    }

    /**
     * Returns true if all components are zero.
     * @returns {boolean}
     */
    isZero(): boolean
    {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    /**
     * Returns a clone of this.
     * @returns {Vector3}
     */
    clone(): Vector3
    {
        return new Vector3(this.x, this.y, this.z);
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
            return array;
        }

        return [
            this.x,
            this.y,
            this.z
        ];
    }

    /**
     * Returns a [[Vector2]] with the x and y components of this vector.
     * If a vector is given, the components of this are copied into it.
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    toVector2(vector?: Vector2): Vector2
    {
        if (vector) {
            vector.x = this.x;
            vector.y = this.y;
            return vector;
        }

        return new Vector2(this.x, this.y);
    }


    /**
     * Returns a text representation of this.
     * @returns {string}
     */
    toString()
    {
        return `[${this.x}, ${this.y}, ${this.z}]`;
    }
}