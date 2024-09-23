/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

////////////////////////////////////////////////////////////////////////////////

export interface IVector2
{
    x: number;
    y: number;
}

/**
 * 2-dimensional vector.
 */
export class Vector2 implements IVector2
{
    static readonly zeros = new Vector2(0, 0);
    static readonly ones = new Vector2(1, 1);
    static readonly unitX = new Vector2(1, 0);
    static readonly unitY = new Vector2(0, 1);

    /**
     * Returns a new vector with all components set to zero.
     */
    static makeZeros(): Vector2
    {
        return new Vector2(0, 0);
    }

    /**
     * Returns a new vector with all components set to one.
     */
    static makeOnes(): Vector2
    {
        return new Vector2(1, 1);
    }

    /**
     * Returns a new vector of unit length, parallel to the X axis.
     */
    static makeUnitX(): Vector2
    {
        return new Vector2(1, 0);
    }

    /**
     * Returns a new vector of unit length, parallel to the Y axis.
     */
    static makeUnitY(): Vector2
    {
        return new Vector2(0, 1);
    }

    /**
     * Returns a new vector with components set from the given vector.
     * @param vector
     */
    static makeCopy(vector: IVector2): Vector2
    {
        return new Vector2(vector.x, vector.y);
    }

    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param scalar
     */
    static makeFromScalar(scalar: number): Vector2
    {
        return new Vector2(scalar, scalar);
    }

    /**
     * Returns a new vector with components set from the values of the given array.
     * @param array
     */
    static makeFromArray(array: number[] | [number, number]): Vector2
    {
        return new Vector2(array[0], array[1]);
    }

    /**
     * Returns a string representation of the given vector.
     * @param vector
     */
    static toString(vector: IVector2): string
    {
        return `[${vector.x}, ${vector.y}]`; // test test
    }

    /** The vector's x component. */
    x: number;
    /** The vector's y component. */
    y: number;

    /**
     * Constructs a new vector with the given x and y values.
     * Omitted or invalid values are set to zero.
     * @param x
     * @param y
     */
    constructor(x?: number, y?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * Copies the components of the given vector to this.
     * @param vector
     */
    copy(vector: IVector2): this
    {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     * Sets the components to the given values.
     * @param x
     * @param y
     */
    set(x: number, y: number): this
    {
        this.x = x;
        this.y = y;
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
        return this;
    }


    /**
     * Sets the components to the values of the given array.
     * @param array
     * @param offset Optional start index of the array. Default is 0.
     */
    setFromArray(array: number[] | [number, number], offset = 0): this
    {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }

    /**
     * Sets all components to zero.
     */
    setZeros(): this
    {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Sets all components to one.
     */
    setOnes(): this
    {
        this.x = 1;
        this.y = 1;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the X axis.
     */
    setUnitX(): this
    {
        this.x = 1;
        this.y = 0;
        return this;
    }

    /**
     * Makes this a unit vector parallel to the Y axis.
     */
    setUnitY(): this
    {
        this.x = 0;
        this.y = 1;
        return this;
    }

    /**
     * Swaps this and other vector.
     */
    swap(other: IVector2): this
    {
        const x = this.x;
        this.x = other.x;
        other.x = x;

        const y = this.y;
        this.y = other.y;
        other.y = y;

        return this;
    }

    /**
     * Adds the given vector to this.
     * @param other
     */
    add(other: IVector2): this
    {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Subtracts the given vector from this.
     * @param other
     */
    subtract(other: IVector2): this
    {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /**
     * Multiplies each component with the corresponding component of the given vector.
     * @param other
     */
    multiply(other: IVector2): this
    {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    /**
     * Divides each component by the corresponding component of the given vector.
     * @param other
     */
    divideBy(other: IVector2): this
    {
        this.x /= other.x;
        this.y /= other.y;
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
        return this;
    }

    /**
     * Multiplies the given vector by factor and adds the result to this.
     * @param other 
     * @param factor 
     */
    multiplyAdd(other: IVector2, factor: number): this
    {
        this.x += other.x * factor;
        this.y += other.y * factor;
        return this;
    }

    /**
     * Translates the vector by the given offsets.
     * @param tx
     * @param ty
     */
    translate(tx: number, ty: number): this
    {
        this.x += tx;
        this.y += ty;
        return this;
    }

    /**
     * Rotates the vector by the given angle.
     * @param angle rotation angle in radians.
     */
    rotate(angle: number): this
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
     */
    scale(sx: number, sy: number): this
    {
        this.x *= sx;
        this.y *= sy;
        return this;
    }

    /**
     * Inverts each component, e.g. x = 1 / x, ...
     */
    invert(): this
    {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        return this;
    }

    /**
     * Negates each component, e.g. x = -x, ...
     */
    negate(): this
    {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Normalizes the vector, making it a unit vector.
     */
    normalize(): this
    {
        const f = 1 / Math.sqrt(this.x * this.x + this.y * this.y);
        this.x *= f;
        this.y *= f;
        return this;
    }

    /**
     * Returns the dot product of this and the given vector.
     * @param other
     */
    dot(other: IVector2): number
    {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Returns the 2-norm (length) of this.
     */
    length(): number
    {
        const x = this.x, y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     */
    lengthSquared(): number
    {
        const x = this.x, y = this.y;
        return x * x + y * y;
    }

    /**
     * Returns the distance between this and other.
      * @param other
     */
    distanceTo(other: IVector2): number
    {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Returns the angle between this and the positive X axis.
     * @returns angle in radians.
     */
    angle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the angle between this and the given vector.
     * @param other
     * @returns angle in radians.
     */
    angleBetween(other: IVector2): number
    {
        const x0 = this.x, y0 = this.y, x1 = other.x, y1 = other.y;
        return Math.acos((x0*x1 + y0*y1) / (Math.sqrt(x0*x0 + y0*y0) + Math.sqrt(x1*x1 + y1*y1)));
    }

    /**
     * Returns the angle from this to the other vector in counter-clockwise direction.
     * @param other 
     * @returns angle in radians.
     */
    angleTo(other: IVector2): number
    {
        return Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x);
    }

    /**
     * Sets each component to the smaller component of this and other.
     * @param other 
     */
    setMin(other: IVector2): this
    {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        return this;
    }

    /**
     * Sets each component to the larger component of this and other.
     * @param other
     */
    setMax(other: IVector2): this
    {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        return this;
    }

    /**
     * Returns the smallest component.
     */
    min(): number
    {
        return this.x < this.y ? this.x : this.y;
    }

    /**
     * Returns the largest component.
     */
    max(): number
    {
        return this.x > this.y ? this.x : this.y;
    }

    /**
     * Returns true if all components are exactly zero.
     */
    isZero(): boolean
    {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Returns a clone.
     */
    clone(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Returns a plain object with the components of this.
     * @param obj 
     */
    toObject(obj?: IVector2): IVector2
    {
        if (obj) {
            obj.x = this.x;
            obj.y = this.y;
            return obj;
        }

        return { x: this.x, y: this.y };
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
            return array;
        }

        return [
            this.x,
            this.y
        ];
    }

    /**
     * Returns a text representation.
     */
    toString(): string
    {
        return Vector2.toString(this);
    }
}