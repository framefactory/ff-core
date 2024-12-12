/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Vector3, IVector3 } from "./Vector3.js";
import { Vector4, IVector4 } from "./Vector4.js";
import { Quaternion, IQuaternion } from "./Quaternion.js";

////////////////////////////////////////////////////////////////////////////////

export enum ERotationOrder { XYZ, YXZ, ZXY, ZYX, YZX, XZY }

export interface IMatrix4
{
    elements: Float32Array;
}

/**
 * 4 by 4 matrix.
 */
export class Matrix4
{
    static readonly zeros = new Matrix4().makeZeros();
    static readonly ones = new Matrix4().makeOnes();
    static readonly identity = new Matrix4();

    /**
     * Returns a new matrix with all elements set to zero.
     */
    static makeZeros(): Matrix4
    {
        return new Matrix4().makeZeros();
    }

    /**
     * Returns a new matrix with all elements set to one.
     */
    static makeOnes(): Matrix4
    {
        return new Matrix4().makeOnes();
    }

    /**
     * Returns a new matrix set to the identity matrix.
     */
    static makeIdentity(): Matrix4
    {
        return new Matrix4();
    }

    /**
     * Returns a new 4 by 4 matrix with rows set to the given vectors.
     * @param row0 
     * @param row1 
     * @param row2 
     * @param row3 
     */
    static makeFromRowVectors(row0: IVector4, row1: IVector4, row2: IVector4, row3: IVector4): Matrix4
    {
        const matrix = new Matrix4();
        const e = matrix.elements;

        e[ 0] = row0.x; e[ 1] = row1.x; e[ 2] = row2.x; e[ 3] = row3.x;
        e[ 4] = row0.y; e[ 5] = row1.y; e[ 6] = row2.y; e[ 7] = row3.y;
        e[ 8] = row0.z; e[ 9] = row1.z; e[10] = row2.z; e[11] = row3.z;
        e[12] = row0.w; e[13] = row1.w; e[14] = row2.w; e[15] = row3.w;

        return matrix;
    }

    /**
     * Returns a new 4 by 4 matrix with columns set to the given vectors.
     * @param col0 
     * @param col1 
     * @param col2 
     * @param col3 
     */
    static makeFromColumnVectors(col0: IVector4, col1: IVector4, col2: IVector4, col3: IVector4): Matrix4
    {
        const matrix = new Matrix4();
        const e = matrix.elements;

        e[ 0] = col0.x; e[ 1] = col0.y; e[ 2] = col0.z; e[ 3] = col0.w;
        e[ 4] = col1.x; e[ 5] = col1.y; e[ 6] = col1.z; e[ 7] = col1.w;
        e[ 8] = col2.x; e[ 9] = col2.y; e[10] = col2.z; e[11] = col2.w;
        e[12] = col3.x; e[13] = col3.y; e[14] = col3.z; e[15] = col3.w;

        return matrix;
    }

    /**
     * Returns a text representation of the given matrix.
     * @param matrix
     */
    static toString(matrix: IMatrix4): string
    {
        const e = matrix.elements;
        return `[${e[0]}, ${e[4]}, ${e[8]}, ${e[12]}]\n[${e[1]}, ${e[5]}, ${e[9]}, ${e[13]}]\n[${e[2]}, ${e[6]}, ${e[10]}, ${e[14]}]\n[${e[3]}, ${e[7]}, ${e[11]}, ${e[15]}]`;
    }

    /** The matrix' elements in column major order. */
    elements: Float32Array;

    /**
     * Constructs a new 4 by 4 matrix.
     * If no initial values are given, the matrix is set to the identity.
     * @param elements Optional initial values in column-major order.
     */
    constructor(elements?: ArrayLike<number>)
    {
        if (elements) {
            this.elements = new Float32Array(elements);
            if (this.elements.length !== 16) {
                throw new RangeError("array length mismatch: must be 16");
            }
        }
        else {
            const e = this.elements = new Float32Array(16);
            e[0] = e[5] = e[10] = e[15] = 1;
        }
    }

    /**
     * Copies the given matrix to this.
     * @param matrix
     */
    copy(matrix: IMatrix4): this
    {
        this.elements.set(matrix.elements, 0);
        return this;
    }

    /**
     * Sets the elements of this to the given values.
     * @param e00
     * @param e01
     * @param e02
     * @param e03
     * @param e10
     * @param e11
     * @param e12
     * @param e13
     * @param e20
     * @param e21
     * @param e22
     * @param e23
     * @param e30
     * @param e31
     * @param e32
     * @param e33
     */
    set(e00: number, e01: number, e02: number, e03: number,
        e10: number, e11: number, e12: number, e13: number,
        e20: number, e21: number, e22: number, e23: number,
        e30: number, e31: number, e32: number, e33: number): Matrix4
    {
        const e = this.elements;
        e[0]  = e00; e[1]  = e10; e[2]  = e20; e[3]  = e30;
        e[4]  = e01; e[5]  = e11; e[6]  = e21; e[7]  = e31;
        e[8]  = e02; e[9]  = e12; e[10] = e22; e[11] = e32;
        e[12] = e03; e[13] = e13; e[14] = e23; e[15] = e33;
        return this;
    }

    /**
     * Sets the elements of this to the values of the given array.
     * @param array Array with 16 matrix elements in column-major or row-major order.
     * @param rowMajor If true expects array elements in row-major order, default is false (column-major).
     */
    setFromArray(array: number[], rowMajor = false): this
    {
        if (rowMajor) {
            const e = this.elements;
            e[0]  = array[0];  e[1]  = array[4]; e[2]  = array[8];  e[3]  = array[12];
            e[4]  = array[1];  e[5]  = array[5]; e[6]  = array[9];  e[7]  = array[13];
            e[8]  = array[2];  e[9]  = array[6]; e[10] = array[10]; e[11] = array[14];
            e[12] = array[3];  e[13] = array[7]; e[14] = array[11]; e[15] = array[15];
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
        e[0]  = 0; e[1]  = 0; e[2]  = 0; e[3]  = 0;
        e[4]  = 0; e[5]  = 0; e[6]  = 0; e[7]  = 0;
        e[8]  = 0; e[9]  = 0; e[10] = 0; e[11] = 0;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 0;
        return this;
    }

    /**
     * Sets all elements to one.
     */
    makeOnes(): this
    {
        const e = this.elements;
        e[0]  = 1; e[1]  = 1; e[2]  = 1; e[3]  = 1;
        e[4]  = 1; e[5]  = 1; e[6]  = 1; e[7]  = 1;
        e[8]  = 1; e[9]  = 1; e[10] = 1; e[11] = 1;
        e[12] = 1; e[13] = 1; e[14] = 1; e[15] = 1;
        return this;
    }

    /**
     * Sets the identity matrix.
     */
    makeIdentity(): this
    {
        const e = this.elements;
        e[0]  = 1; e[1]  = 0; e[2]  = 0; e[3]  = 0;
        e[4]  = 0; e[5]  = 1; e[6]  = 0; e[7]  = 0;
        e[8]  = 0; e[9]  = 0; e[10] = 1; e[11] = 0;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
        return this;
    }

    /**
     * Transposes the matrix in-place.
     */
    transpose(): this
    {
        const e = this.elements;
        const t0 = e[4];  e[4]  = e[1];  e[1]  = t0;
        const t1 = e[8];  e[8]  = e[2];  e[2]  = t1;
        const t2 = e[12]; e[12] = e[3];  e[3]  = t2;
        const t3 = e[9];  e[9]  = e[6];  e[6]  = t3;
        const t4 = e[13]; e[13] = e[7];  e[7]  = t4;
        const t5 = e[14]; e[14] = e[11]; e[11] = t5;
        return this;
    }

    /**
     * Writes the basis vectors of the matrix to the given column vectors.
     * @param x Basis vector for the x axis.
     * @param y Basis vector for the y axis.
     * @param z Basis vector for the z axis.
     */
    getBasis(x: IVector3, y: IVector3, z: IVector3): this
    {
        const e = this.elements;
        x.x = e[0]; x.y = e[1]; x.z = e[2];
        y.x = e[4]; y.y = e[5]; y.z = e[6];
        z.x = e[8]; z.y = e[9]; z.z = e[10];
        return this;
    }

    /**
     * Sets the basis vectors of the matrix from the given column vectors.
     * @param x Basis vector for the x axis.
     * @param y Basis vector for the y axis.
     * @param z Basis vector for the z axis.
     */
    setBasis(x: IVector3, y: IVector3, z: IVector3): this
    {
        const e = this.elements;
        e[0] = x.x; e[1] = x.y; e[2] = x.z;
        e[4] = y.x; e[5] = y.y; e[6] = y.z;
        e[8] = z.x; e[9] = z.y; e[10] = z.z;
        return this;
    }

    /**
     * Sets the rotation part (upper 3 by 3 matrix) of this matrix
     * from the given matrix.
     * @param matrix Matrix to extract the rotation from.
     */
    setRotationFromMatrix(matrix: IMatrix4): this
    {
        const e = this.elements;
        const m = matrix.elements;

        const xx = m[0], xy = m[1], xz = m[2];
        const sx = 1 / Math.sqrt(xx * xx + xy * xy + xz * xz);
        const yx = m[4], yy = m[5], yz = m[6];
        const sy = 1 / Math.sqrt(yx * yx + yy * yy + yz * yz);
        const zx = m[8], zy = m[9], zz = m[10];
        const sz = 1 / Math.sqrt(zx * zx + zy * zy + zz * zz);

        e[0] = m[0] * sx; e[1] = m[1] * sx; e[2] = m[2] * sx;
        e[4] = m[4] * sy; e[5] = m[5] * sy; e[6] = m[2] * sy;
        e[8] = m[8] * sz; e[9] = m[9] * sz; e[10] = m[10] * sz;

        e[3] = e[7] = e[11] = e[12] = e[13] = e[14] = 0;
        e[15] = 1;

        return this;
    }

    setRotationX(angleX: number): this
    {
        // TODO: Implement
        return this;
    }

    setRotationY(angleY: number): this
    {
        // TODO: Implement
        return this;
    }

    setRotationZ(angleZ: number): this
    {
        // TODO: Implement
        return this;
    }

    setRotation(ax: number, ay: number, az: number, order: ERotationOrder): this
    {
        const e = this.elements;
        const sinX = Math.sin(ax), cosX = Math.cos(ax);
        const sinY = Math.sin(ay), cosY = Math.cos(ay);
        const sinZ = Math.sin(az), cosZ = Math.cos(az);

        switch(order) {
            case ERotationOrder.XYZ:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;

            case ERotationOrder.XZY:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;

            case ERotationOrder.YXZ:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;

            case ERotationOrder.YZX:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;

            case ERotationOrder.ZXY:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;

            case ERotationOrder.ZYX:
                e[0] = 0;
                e[4] = 0;
                e[8] = 0;
                e[1] = 0;
                e[5] = 0;
                e[9] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 0;
                break;
        }

        e[3] = e[7] = e[11] = e[12] = e[13] = e[14] = 0;
        e[15] = 1;

        return this;
    }

    setRotationFromVector(angles: IVector3, order: ERotationOrder): this
    {
        return this.setRotation(angles.x, angles.y, angles.y, order);
    }

    /**
     * Sets the rotation part (upper 3 by 3 matrix) of this matrix
     * from the given quaternion.
     * @param quat
     */
    setRotationFromQuaternion(quat: IQuaternion): this
    {
        // TODO: Implement
        return this;
    }

    setTranslation(tx: number, ty: number, tz: number): this
    {
        const e = this.elements;
        e[0]  = 1;  e[1]  = 0;  e[2]  = 0;  e[3]  = 0;
        e[4]  = 0;  e[5]  = 1;  e[6]  = 0;  e[7]  = 0;
        e[8]  = 0;  e[9]  = 0;  e[10] = 1;  e[11] = 0;
        e[12] = tx; e[13] = ty; e[14] = tz; e[15] = 1;
        return this;
    }

    setTranslationFromVector(translation: IVector3): this
    {
        return this.setTranslation(translation.x, translation.y, translation.z);
    }

    setScale(sx: number, sy: number, sz: number): this
    {
        const e = this.elements;
        e[0]  = sx; e[1]  = 0;  e[2]  = 0;  e[3]  = 0;
        e[4]  = 0;  e[5]  = sy; e[6]  = 0;  e[7]  = 0;
        e[8]  = 0;  e[9]  = 0;  e[10] = sz; e[11] = 0;
        e[12] = 0;  e[13] = 0;  e[14] = 0;  e[15] = 1;
        return this;
    }

    setScaleFromVector(scale: IVector3): this
    {
        return this.setScale(scale.x, scale.y, scale.z);
    }

    /**
     * Returns a new matrix set to the same values as this.
     */
    clone(): Matrix4
    {
        return new Matrix4(this.elements);
    }

    /**
     * Returns an array set to the values of this matrix
     * in column-major or row-major order.
     * @param target Optional target array.
     * @param rowMajor If true, writes the array in row major order. Default is false.
     */
    toArray(target?: number[], rowMajor = false): number[]
    {
        if (!target) {
            target = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        }

        const e = this.elements;

        if (rowMajor) {
            target[0] = e[0];  target[4] = e[1];  target[8]  = e[2];  target[12] = e[3];
            target[1] = e[4];  target[5] = e[5];  target[9]  = e[6];  target[13] = e[7];
            target[2] = e[8];  target[6] = e[9];  target[10] = e[10]; target[14] = e[11];
            target[3] = e[12]; target[7] = e[13]; target[11] = e[14]; target[15] = e[15];
        }
        else {
            target[0]  = e[0];  target[1]  = e[1];  target[2]  = e[2];  target[3]  = e[3];
            target[4]  = e[4];  target[5]  = e[5];  target[6]  = e[6];  target[7]  = e[7];
            target[8]  = e[8];  target[9]  = e[9];  target[10] = e[10]; target[11] = e[11];
            target[12] = e[12]; target[13] = e[13]; target[14] = e[14]; target[15] = e[15];
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
        return Matrix4.toString(this);
    }
}