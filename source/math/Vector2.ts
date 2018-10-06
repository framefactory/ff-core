/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export interface IVector2
{
    x: number;
    y: number;
}

export default class Vector2 implements IVector2
{
    /**
     * Returns a new vector with all components set to zero.
     * @returns {Vector2}
     */
    static makeZeros()
    {
        return new Vector2(0, 0);
    }

    /**
     * Returns a new vector with all components set to one.
     * @returns {Vector2}
     */
    static makeOnes()
    {
        return new Vector2(1, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the X axis.
     * @returns {Vector2}
     */
    static makeUnitX()
    {
        return new Vector2(1, 0);
    }

    /**
     * Returns a new vector of unit length, parallel to the Y axis.
     * @returns {Vector2}
     */
    static makeUnitY()
    {
        return new Vector2(0, 1);
    }

    /**
     * Returns a new vector with components set from the given vector.
     * @param {IVector2} vector
     * @returns {Vector2}
     */
    static makeFromVector(vector: IVector2)
    {
        return new Vector2(vector.x, vector.y);
    }

    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param {number} scalar
     * @returns {Vector2}
     */
    static makeFromScalar(scalar: number)
    {
        return new Vector2(scalar, scalar);
    }

    /**
     * Returns a new vector with components set from the values of the given array.
     * @param {number[]} array
     * @returns {Vector2}
     */
    static makeFromArray(array: number[])
    {
        return new Vector2(array[0], array[1]);
    }

    x: number;
    y: number;

    /**
     * Constructs a new vector with the given x and y values.
     * If the parameters are omitted, the components are set to zero.
     * @param {number} x
     * @param {number} y
     */
    constructor(x?: number, y?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * Sets the components of this to the given values.
     * @param {number} x
     * @param {number} y
     * @returns {Vector2} this
     */
    set(x: number, y: number): Vector2
    {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Copies the components of the given vector to this.
     * @param {Vector2} vector
     * @returns {Vector2}
     */
    setVector(vector: IVector2): Vector2
    {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     * Sets each component of this to the given scalar value.
     * @param {number} scalar
     * @returns {Vector2}
     */
    setScalar(scalar: number): Vector2
    {
        this.x = scalar;
        this.y = scalar;
        return this;
    }


    /**
     * Sets the components of this to the values of the given array.
     * @param {number[]} array
     * @returns {Vector2} this
     */
    setArray(array: number[]): Vector2
    {
        this.x = array[0];
        this.y = array[1];
        return this;
    }

    /**
     * Sets all components of this to zero.
     * @returns {Vector2} this
     */
    setZeroes(): Vector2
    {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Sets all components of this to one.
     * @returns {Vector2} this
     */
    setOnes(): Vector2
    {
        this.x = 1;
        this.y = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the X axis.
     * @returns {Vector2} this
     */
    setUnitX(): Vector2
    {
        this.x = 1;
        this.y = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Y axis.
     * @returns {Vector2} this
     */
    setUnitY(): Vector2
    {
        this.x = 0;
        this.y = 1;
        return this;
    }

    /**
     * Adds the given vector to this.
     * @param {IVector2} other
     * @returns {Vector2} this
     */
    add(other: IVector2): Vector2
    {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Subtracts the given vector from this.
     * @param {IVector2} other
     * @returns {Vector2} this
     */
    sub(other: IVector2): Vector2
    {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /**
     * Component-wise multiplication of this with the given vector.
     * @param {IVector2} other
     * @returns {Vector2} this
     */
    mul(other: IVector2): Vector2
    {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    /**
     * Component-wise division of this by the given vector.
     * @param {IVector2} other
     * @returns {Vector2} this
     */
    div(other: IVector2): Vector2
    {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }

    /**
     * Adds the given scalar to each component of this.
     * @param {number} scalar
     * @returns {Vector2}
     */
    addScalar(scalar: number): Vector2
    {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    /**
     * Subtracts the given scalar from each component of this.
     * @param {number} scalar
     * @returns {Vector2}
     */
    subScalar(scalar: number): Vector2
    {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }

    /**
     * Multiplies each component of this with the given scalar.
     * @param {number} scalar
     * @returns {Vector2}
     */
    mulScalar(scalar: number): Vector2
    {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divides each component of this by the given scalar.
     * @param {number} scalar
     * @returns {Vector2}
     */
    divScalar(scalar: number): Vector2
    {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    /**
     * Inverts each component of this, e.g. x = 1 / x, ...
     * @returns {Vector2}
     */
    invert(): Vector2
    {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        return this;
    }

    /**
     * Negates each component of this, e.g. x = -x, ...
     * @returns {Vector2}
     */
    negate(): Vector2
    {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Normalizes this, making it a unit vector.
     * @returns {Vector2} this
     */
    normalize(): Vector2
    {
        const f = 1 / Math.sqrt(this.x * this.x + this.y * this.y);
        this.x *= f;
        this.y *= f;
        return this;
    }

    translate(tx: number, ty: number): Vector2
    {
        this.x += tx;
        this.y += ty;
        return this;
    }

    rotate(angle: number): Vector2
    {
        const co = Math.cos(angle);
        const si = Math.sin(angle);

        const x = this.x, y = this.y;
        this.x = co*x - si*y;
        this.y = si*x + co*y;
        return this;
    }

    scale(sx: number, sy: number): Vector2
    {
        this.x *= sx;
        this.y *= sy;
        return this;
    }

    /**
     * Returns the dot product of this and the given vector.
     * @param {IVector2} other
     * @returns {number}
     */
    dot(other: IVector2): number
    {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Returns the 2-norm (length) of this.
     * @returns {number}
     */
    length(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     * @returns {number}
     */
    lengthSquared(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Returns the distance this and other.
      * @param {IVector2} other
     * @returns {number}
     */
    distanceTo(other: IVector2): number
    {
        const dx = other.x - this.x;
        const dy = other.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Returns the angle between this and the positive X axis.
     * @returns {number}
     */
    angle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the angle between this and the given vector.
     * @param {IVector2} other
     * @returns {number}
     */
    angleTo(other: IVector2): number
    {
        return Math.atan2(this.y - other.y, this.x - other.x);
    }

    /**
     * Returns the minimum component of this.
     * @returns {number}
     */
    min()
    {
        return this.x < this.y ? this.x : this.y;
    }

    /**
     * Returns the maximum component of this.
     * @returns {number}
     */
    max()
    {
        return this.x > this.y ? this.x : this.y;
    }

    /**
     * Returns true if all components are zero.
     * @returns {boolean}
     */
    isZero(): boolean
    {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Returns a clone of this.
     * @returns {Vector2}
     */
    clone(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Returns an array with the components of this vector.
     * If given, the components are copied into the provided array.
     * @param {number[]} array
     * @returns {number[]}
     */
    toArray(array?: number[]): number[]
    {
        if (array) {
            array[0] = this.x;
            array[1] = this.y;
            return array;
        }

        return [
            this.x,
            this.y
        ];
    }

    /**
     * Returns a text representation of this.
     * @returns {string}
     */
    toString()
    {
        return `[${this.x}, ${this.y}]`;
    }
}