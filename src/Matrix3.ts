/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { IVector2 } from "./Vector2.js";
import { IVector3 } from "./Vector3.js";

////////////////////////////////////////////////////////////////////////////////

export interface IMatrix3
{
    elements: Float32Array;
}

/**
 * 3 by 3 matrix.
 */
export class Matrix3
{
    static readonly zeros = new Matrix3().makeZeros();
    static readonly ones = new Matrix3().makeOnes();
    static readonly identity = new Matrix3();

    /**
     * Returns a new matrix with all elements set to zero.
     */
    static makeZeros(): Matrix3
    {
        return new Matrix3().makeZeros();
    }

    /**
     * Returns a new matrix with all elements set to one.
     */
    static makeOnes(): Matrix3
    {
        return new Matrix3().makeOnes();
    }

    /**
     * Returns a new matrix set to the identity matrix.
     */
    static makeIndentity(): Matrix3
    {
        return new Matrix3();
    }

    /**
     * Returns a new 3 by 3 matrix with rows set to the given vectors.
     * @param row0 
     * @param row1 
     * @param row2 
     */
    static makeFromRowVectors(row0: IVector3, row1: IVector3, row2: IVector3): Matrix3
    {
        const matrix = new Matrix3();
        const e = matrix.elements;

        e[0] = row0.x; e[1] = row1.x; e[2] = row2.x;
        e[3] = row0.y; e[4] = row1.y; e[5] = row2.y;
        e[6] = row0.z; e[7] = row1.z; e[8] = row2.z;

        return matrix;
    }

    /**
     * Returns a new 3 by 3 matrix with columns set to the given vectors.
     * @param col0 
     * @param col1 
     * @param col2 
     */
    static makeFromColumnVectors(col0: IVector3, col1: IVector3, col2: IVector3): Matrix3
    {
        const matrix = new Matrix3();
        const e = matrix.elements;

        e[0] = col0.x; e[1] = col0.y; e[2] = col0.z;
        e[3] = col1.x; e[4] = col1.y; e[5] = col1.z;
        e[6] = col2.x; e[7] = col2.y; e[8] = col2.z;

        return matrix;
    }

    /**
     * Returns a text representation of the given matrix.
     * @param matrix
     */
    static toString(matrix: IMatrix3): string
    {
        const e = matrix.elements;
        return `[${e[0]}, ${e[3]}, ${e[6]}]\n[${e[1]}, ${e[4]}, ${e[7]}]\n[${e[2]}, ${e[5]}, ${e[8]}]`;

    }

    /** The matrix' elements in column major order. */
    elements: Float32Array;

    /**
     * Constructs a new 3 by 3 matrix.
     * If no initial values are given, the matrix is set to the identity.
     * @param elements Optional initial values in column-major order.
     */
    constructor(elements?: ArrayLike<number>)
    {
        if (elements) {
            this.elements = new Float32Array(elements);
            if (this.elements.length !== 9) {
                throw new RangeError("array length mismatch: must be 9");
            }
        }
        else {
            const e = this.elements = new Float32Array(9);
            e[0] = e[4] = e[8] = 1;
        }
    }

    /**
     * Copies the given matrix to this.
     * @param matrix 
     */
    copy(matrix: IMatrix3): this
    {
        this.elements.set(matrix.elements, 0);
        return this;
    }

    /**
     * Sets the elements of this to the given values.
     * @param e00
     * @param e01
     * @param e02
     * @param e10
     * @param e11
     * @param e12
     * @param e20
     * @param e21
     * @param e22
     */
    set(e00: number, e01: number, e02: number,
        e10: number, e11: number, e12: number,
        e20: number, e21: number, e22: number): this
    {
        const e = this.elements;
        e[0] = e00; e[3] = e10; e[6] = e20;
        e[1] = e01; e[4] = e11; e[7] = e21;
        e[2] = e02; e[5] = e12; e[8] = e22;
        return this;
    }

    /**
     * Sets the elements of this to the values of the given array.
     * @param array Array with 9 matrix elements in column-major or row-major order.
     * @param rowMajor If true expects array elements in row-major order, default is false (column-major).
     */
    setFromArray(array: ArrayLike<number>, rowMajor = false): this
    {
        if (rowMajor) {
            const e = this.elements;
            e[0] = array[0]; e[1] = array[3]; e[2] = array[6];
            e[3] = array[1]; e[4] = array[4]; e[5] = array[7];
            e[6] = array[2]; e[7] = array[5]; e[8] = array[8];
        }
        else {
            this.elements.set(array, 0);
        }
        return this;
    }

    /**
     * Sets all elements to zero.
     */
    makeZeros(): this
    {
        const e = this.elements;
        e[0] = 0; e[1] = 0; e[2] = 0;
        e[3] = 0; e[4] = 0; e[5] = 0;
        e[6] = 0; e[7] = 0; e[8] = 0;
        return this;
    }

    /**
     * Sets all elements to one.
     */
    makeOnes(): this
    {
        const e = this.elements;
        e[0] = 1; e[1] = 1; e[2] = 1;
        e[3] = 1; e[4] = 1; e[5] = 1;
        e[6] = 1; e[7] = 1; e[8] = 1;
        return this;
    }

    /**
     * Sets the identity matrix.
     */
    makeIdentity(): this
    {
        const e = this.elements;
        e[0] = 1; e[1] = 0; e[2] = 0;
        e[3] = 0; e[4] = 1; e[5] = 0;
        e[6] = 0; e[7] = 0; e[8] = 1;
        return this;
    }

    /**
     * Transposes the matrix in-place.
     */
    transpose(): this
    {
        const e = this.elements;
        const t0 = e[1]; e[1] = e[3]; e[3] = t0;
        const t1 = e[2]; e[2] = e[6]; e[6] = t1;
        const t2 = e[5]; e[5] = e[7]; e[7] = t2;
        return this;
    }

    /**
     * Makes this a transform matrix representing a translation by [tx, ty].
     * @param tx 
     * @param ty 
     */
    makeTranslation(tx: number, ty: number): this
    {
        const e = this.elements;
        e[6] = tx;
        e[7] = ty;
        e[1] = e[2] = e[3] = e[5] = 0;
        e[0] = e[4] = e[8] = 1;
        return this;
    }

    /**
     * Makes this a transform matrix representing a translation by the given vector.
     * @param translation 
     */
    makeTranslationFromVector(translation: IVector2): this
    {
        return this.makeTranslation(translation.x, translation.y);
    }

    /**
     * Sets the translation components of this matrix.
     * @param tx 
     * @param ty 
     */
    setTranslation(tx: number, ty: number): this
    {
        const e = this.elements;
        e[6] = tx;
        e[7] = ty;
        return this;
    }

    setTranslationFromVector(translation: IVector2): this
    {
        return this.setTranslation(translation.x, translation.y);
    }

    makeRotation(angle: number): this
    {
        const e = this.elements;
        const si = Math.sin(angle);
        const co = Math.cos(angle);

        e[0] = co; e[3] = -si; e[6] = 0;
        e[1] = si; e[4] = co;  e[7] = 0;
        e[2] = 0;  e[5] = 0;   e[8] = 1;

        return this;
    }

    setRotation(angle: number): this
    {
        const e = this.elements;
        const si = Math.sin(angle);
        const co = Math.cos(angle);

        e[0] = co; e[3] = -si;
        e[1] = si; e[4] = co;
        return this;
    }

    makeScale(sx: number, sy: number): this
    {
        const e = this.elements;
        e[0] = sx;
        e[4] = sy;
        e[1] = e[2] = e[3] = e[5] = e[6] = e[7] = 0;
        e[8] = 1;
        return this;
    }

    makeScaleFromVector(scale: IVector2): this
    {
        return this.makeScale(scale.x, scale.y);
    }

    makeUniformScale(scale: number): this
    {
        return this.makeScale(scale, scale);
    }

    setScale(sx: number, sy: number): this
    {
        const e = this.elements;
        e[0] = sx;
        e[4] = sy;
        return this;
    }

    setScaleFromVector(scale: IVector2): this
    {
        return this.setScale(scale.x, scale.y);
    }

    setUniformScale(scale: number): this
    {
        return this.setScale(scale, scale);
    }

    addScalar(scalar: number): this
    {
        const e = this.elements;
        e[0] += scalar; e[1] += scalar; e[2] += scalar;
        e[3] += scalar; e[4] += scalar; e[5] += scalar;
        e[6] += scalar; e[7] += scalar; e[8] += scalar;
        return this;
    }

    subtractScalar(scalar: number): this
    {
        const e = this.elements;
        e[0] -= scalar; e[1] -= scalar; e[2] -= scalar;
        e[3] -= scalar; e[4] -= scalar; e[5] -= scalar;
        e[6] -= scalar; e[7] -= scalar; e[8] -= scalar;
        return this;
    }

    multiplyScalar(scalar: number): this
    {
        const e = this.elements;
        e[0] *= scalar; e[1] *= scalar; e[2] *= scalar;
        e[3] *= scalar; e[4] *= scalar; e[5] *= scalar;
        e[6] *= scalar; e[7] *= scalar; e[8] *= scalar;
        return this;
    }

    divideByScalar(scalar: number): this
    {
        const e = this.elements;
        e[0] /= scalar; e[1] /= scalar; e[2] /= scalar;
        e[3] /= scalar; e[4] /= scalar; e[5] /= scalar;
        e[6] /= scalar; e[7] /= scalar; e[8] /= scalar;
        return this;
    }

    transformVector<T extends IVector3>(vector: T): T
    {
        const e = this.elements;
        const x = vector.x, y = vector.y, z = vector.z;
        vector.x = e[0] * x + e[3] * y + e[6] * z;
        vector.y = e[1] * x + e[4] * y + e[7] * z;
        vector.z = e[2] * x + e[5] * y + e[8] * z;
        return vector;
    }

    transformVector2<T extends IVector2>(vector: T, z = 1): T
    {
        const e = this.elements;
        const x = vector.x, y = vector.y;
        vector.x = e[0] * x + e[3] * y + e[6] * z;
        vector.y = e[1] * x + e[4] * y + e[7] * z;
        const vz = e[2] * x + e[5] * y + e[8] * z;
        if (vz !== 0.0) {
            vector.x /= vz;
            vector.y /= vz;
        }
        return vector;
    }

    multiply(other: Matrix3): this
    {
        const a = this.elements;
        const b = other.elements;

        const t00 = a[0]*b[0] + a[3]*b[1] + a[6]*b[2];
        const t01 = a[0]*b[3] + a[3]*b[4] + a[6]*b[5];
        const t02 = a[0]*b[6] + a[3]*b[7] + a[6]*b[8];
        const t10 = a[1]*b[0] + a[4]*b[1] + a[7]*b[2];
        const t11 = a[1]*b[3] + a[4]*b[4] + a[7]*b[5];
        const t12 = a[1]*b[6] + a[4]*b[7] + a[7]*b[8];
        const t20 = a[2]*b[0] + a[5]*b[1] + a[8]*b[2];
        const t21 = a[2]*b[3] + a[5]*b[4] + a[8]*b[5];
        const t22 = a[2]*b[6] + a[5]*b[7] + a[8]*b[8];

        a[0] = t00; a[3] = t01; a[6] = t02;
        a[1] = t10; a[4] = t11; a[7] = t12;
        a[2] = t20; a[5] = t21; a[8] = t22;
        return this;
    }

    premultiply(other: Matrix3): this
    {
        const a = other.elements;
        const b = this.elements;

        const t00 = a[0]*b[0] + a[3]*b[1] + a[6]*b[2];
        const t01 = a[0]*b[3] + a[3]*b[4] + a[6]*b[5];
        const t02 = a[0]*b[6] + a[3]*b[7] + a[6]*b[8];
        const t10 = a[1]*b[0] + a[4]*b[1] + a[7]*b[2];
        const t11 = a[1]*b[3] + a[4]*b[4] + a[7]*b[5];
        const t12 = a[1]*b[6] + a[4]*b[7] + a[7]*b[8];
        const t20 = a[2]*b[0] + a[5]*b[1] + a[8]*b[2];
        const t21 = a[2]*b[3] + a[5]*b[4] + a[8]*b[5];
        const t22 = a[2]*b[6] + a[5]*b[7] + a[8]*b[8];

        b[0] = t00; b[3] = t01; b[6] = t02;
        b[1] = t10; b[4] = t11; b[7] = t12;
        b[2] = t20; b[5] = t21; b[8] = t22;
        return this;
    }

    invert(determinant?: number): this
    {
        if (determinant === undefined) {
            determinant = this.determinant();
        }

        if (determinant !== 0) {
            const e = this.elements;

            const t00 = (e[4]*e[8] - e[7]*e[5]) / determinant;
            const t01 = (e[6]*e[5] - e[3]*e[8]) / determinant;
            const t02 = (e[3]*e[7] - e[6]*e[4]) / determinant;
            const t10 = (e[2]*e[7] - e[1]*e[8]) / determinant;
            const t11 = (e[0]*e[8] - e[2]*e[6]) / determinant;
            const t12 = (e[1]*e[6] - e[0]*e[7]) / determinant;
            const t20 = (e[1]*e[5] - e[2]*e[4]) / determinant;
            const t21 = (e[2]*e[3] - e[0]*e[5]) / determinant;
            const t22 = (e[0]*e[4] - e[1]*e[3]) / determinant;

            e[0] = t00; e[3] = t01; e[6] = t02;
            e[1] = t10; e[4] = t11; e[7] = t12;
            e[2] = t20; e[5] = t21; e[8] = t22;
        }

        return this;
    }

    determinant(): number
    {
        const e = this.elements;

        return e[2]*e[3]*e[7] - e[2]*e[6]*e[4]
             - e[1]*e[3]*e[8] + e[1]*e[6]*e[5]
             - e[0]*e[5]*e[7] + e[0]*e[4]*e[8];
    }

    /**
     * Applies a translation to this matrix
     * by pre-multiplying the matrix with the translation transform.
     * @param tx 
     * @param ty 
     */
    translate(tx: number, ty: number): this
    {
        const e = this.elements;
        e[0] += e[2] * tx; e[1] += e[2] * ty;
        e[3] += e[5] * tx; e[4] += e[5] * ty;
        e[6] += e[8] * tx; e[7] += e[8] * ty;
        return this;
    }

    translateByVector(vector: IVector2): this
    {
        return this.translate(vector.x, vector.y);
    }

    /**
     * Applies a rotation transform to this matrix
     * by pre-multiplying the matrix with the rotation transform.
     * @param angle 
     */
    rotate(angle: number): this
    {
        const e = this.elements;
        const si = Math.sin(angle);
        const co = Math.cos(angle);

        const t00 = e[0]*co - e[1]*si;
        const t01 = e[3]*co - e[4]*si;
        const t02 = e[6]*co - e[7]*si;
        const t10 = e[0]*si + e[1]*co;
        const t11 = e[3]*si + e[4]*co;
        const t12 = e[6]*si + e[7]*co;

        e[0] = t00; e[3] = t01; e[6] = t02;
        e[1] = t10; e[4] = t11; e[7] = t12;
        return this;
    }

    /**
     * Applies a scale transform to this matrix
     * by pre-multiplying the matrix with the scale transform.
     * @param sx 
     * @param sy 
     */
    scale(sx: number, sy: number): this
    {
        const e = this.elements;
        e[0] *= sx; e[3] *= sx; e[6] *= sx;
        e[1] *= sy; e[4] *= sy; e[7] *= sy;
        return this;
    }

    scaleByVector(vector: IVector2): this
    {
        return this.scale(vector.x, vector.y);
    }

    /**
     * Applies a uniform scale transform to this matrix
     * by pre-multiplying the matrix with the uniform scale transform.
     * @param scale 
     */
    uniformScale(scale: number): this
    {
        return this.scale(scale, scale);
    }

    /**
     * Returns a new matrix set to the same values as this.
     */
    clone(): Matrix3
    {
        return new Matrix3(this.elements);
    }

    /**
     * Returns an array set to the values of this matrix
     * in column-major or row-major order.
     * @param target Optional target array.
     * @param rowMajor If true, values are written in row-major order.
     */
    toArray(target?: number[], rowMajor = false): number[]
    {
        if (!target) {
            target = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        }

        const e = this.elements;

        if (rowMajor) {
            target[0] = e[0]; target[3] = e[1]; target[2] = e[2];
            target[1] = e[3]; target[4] = e[4]; target[5] = e[5];
            target[2] = e[6]; target[5] = e[7]; target[8] = e[8];
        }
        else {
            target[0] = e[0];  target[1] = e[1];  target[2] = e[2];
            target[3] = e[3];  target[4] = e[4];  target[5] = e[5];
            target[6] = e[6];  target[7] = e[7];  target[8] = e[8];
        }

        return target;
    }

    /**
     * Returns a Float32Array set to the values of this matrix
     * in column-major order.
     * @param target Optional target array.
     */
    toTypedArray(target?: Float32Array): Float32Array
    {
        if (target) {
            target.set(this.elements, 0);
            return target;
        }

        return new Float32Array(this.elements);
    }

    /**
     * Returns a text representation of this matrix.
     */
    toString(): string
    {
        return Matrix3.toString(this);
    }
}