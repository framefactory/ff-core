/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Vector3, IVector3 } from "./Vector3.js";
import { Matrix3 } from "./Matrix3.js";

////////////////////////////////////////////////////////////////////////////////

export interface IQuad3
{
    points: IVector3[];    
}

export class Quad3 implements IQuad3
{
    points: Vector3[] = [];

    constructor()
    {
        for (let i = 0; i < 4; ++i) {
            this.points[i] = new Vector3();
        }
    }

    transformMat3(matrix: Matrix3): this
    {
        for (let i = 0; i < 4; ++i) {
            matrix.transformVector(this.points[i]);
        }
        return this;
    }

    homogenize(): this
    {
        for (let i = 0; i < 4; ++i) {
            this.points[i].homogenize();
        }
        return this;
    }

    getMin(result?: Vector3): Vector3
    {
        if (!result) {
            result = new Vector3();
        }

        result.setFromScalar(Number.MAX_VALUE);
        for (let i = 0; i < 4; ++i) {
            result.setMin(this.points[i]);
        }

        return result;
    }

    getMax(result?: Vector3): Vector3
    {
        if (!result) {
            result = new Vector3();
        }

        result.setFromScalar(-Number.MAX_VALUE);
        for (let i = 0; i < 4; ++i) {
            result.setMax(this.points[i]);
        }

        return result;
    }

}
