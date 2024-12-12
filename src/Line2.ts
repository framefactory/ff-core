/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Vector2, IVector2 } from "./Vector2.js";

////////////////////////////////////////////////////////////////////////////////

export class Line2
{
    p0: Vector2;
    p1: Vector2;

    constructor(x0 = 0, y0 = 0, x1 = 1, y1 = 0)
    {
        this.p0 = new Vector2(x0, y0);
        this.p1 = new Vector2(x1, y1);
    }

    setPointAngle(point: IVector2, angle: number, length = 1): this
    {
        this.p0.copy(point);
        this.p1.copy(point).translate(length, 0).rotate(angle);
        return this;
    }

    setAngle(angle: number): this
    {
        const p0 = this.p0;
        const p1 = this.p1;
        const length = p1.distanceTo(p0);
        p1.copy(p0).translate(length, 0).rotate(angle);
        return this;
    }

    translate(tx: number, ty: number): this
    {
        this.p0.translate(tx, ty);
        this.p1.translate(tx, ty);
        return this;
    }

    rotate(angle: number): this
    {
        const p0 = this.p0;
        this.p1.subtract(p0).rotate(angle).add(p0);
        return this;
    }

    length(): number
    {
        return this.p1.distanceTo(this.p0);
    }

    distanceTo(point: IVector2): number
    {
        const p0 = this.p0;
        const p1 = this.p1;
        return Math.abs((p1.x - p0.x) * (p0.y - point.y) - (p0.x - point.x) * (p1.y - p0.y)) / p1.distanceTo(p0);
    }

    distanceToSegment(point: IVector2): number
    {
        const p0 = this.p0;
        const p1 = this.p1;
        const dist = p1.distanceTo(p0);

        const dx0 = point.x - p0.x;
        const dy0 = point.y - p0.y;
        const dx1 = p1.x - p0.x;
        const dy1 = p1.y - p0.y;

        let t = (dx0 * dx1 + dy0 * dy1) / dist; 
        t = t < 0 ? 0 : (t > 1 ? 1 : t);

        const dx = p0.x + t * (p1.x - p0.x) - point.x;
        const dy = p0.y + t * (p1.y - p0.y) - point.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
}