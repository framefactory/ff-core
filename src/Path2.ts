/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { IVector2 } from "./Vector2";

////////////////////////////////////////////////////////////////////////////////

export enum ESegmentType
{
    Move,
    Line,
    Bezier,
}

/**
 * Describes a segment of a 2-dimensional path.
 */
export interface ISegment2
{
    type: ESegmentType;
    p: IVector2;
    cp0?: IVector2;
    cp1?: IVector2;
}

/**
 * Describes a 2-dimensional path, composed from individual segments.
 */
export default class Path2
{
    static precision = 4;

    static fromSvgPathD(d: string): Path2
    {
        return new Path2().addSvgPathD(d);
    }
    
    static fromSvgLine(x1: string | number, y1: string | number, x2: string | number, y2: string | number)
    {
        return new Path2().addSvgLine(x1, y1, x2, y2);
    }

    protected static readonly rePath = /([mlhvcsqt]|-?[\d\.]*)[,\s]?/gmi;

    protected static next(d: string): string | null
    {
        const match = Path2.rePath.exec(d);
        return match && match[1];
    }

    protected static nextNumber(d: string): number
    {
        const match = Path2.next(d);
        return match ? parseFloat(match) : NaN;
    }

    protected static nextNumbers(count: number, d: string): number[]
    {
        const result = [];

        for (let i = 0; i < count; ++i) {
            const v = Path2.nextNumber(d);
            if (!isFinite(v)) {
                return null;
            }

            result.push(v);
        }

        return result;
    }

    protected static reset()
    {
        Path2.rePath.lastIndex = 0;
    }

    segments: ISegment2[] = [];

    get lastSegment(): ISegment2 {
        return this.segments[this.segments.length - 1];
    }

    clear(): this
    {
        this.segments.length = 0;
        return this;
    }

    beginAt(x: number, y: number): this
    {
        this.segments.length = 0;
        return this.moveTo(x, y);
    }

    beginAtPoint(point: IVector2): this
    {
        this.segments.length = 0;
        return this.moveToPoint(point);
    }

    moveTo(x: number, y: number): this
    {
        this.segments.push({
            type: ESegmentType.Move,
            p: { x, y },
        });

        return this;
    }

    moveToPoint(point: IVector2): this
    {
        return this.moveTo(point.x, point.y);
    }

    lineTo(x: number, y: number): this
    {
        this.segments.push({
            type: ESegmentType.Line,
            p: { x, y },
        });

        return this;
    }

    lineToPoint(point: IVector2): this
    {
        return this.lineTo(point.x, point.y);
    }

    bezierTo(c0x: number, c0y: number, c1x: number, c1y: number, x: number, y: number): this
    {
        this.segments.push({
            type: ESegmentType.Bezier,
            cp0: { x: c0x, y: c0y },
            cp1: { x: c1x, y: c1y },
            p: { x, y },
        });

        return this;
    }

    bezierToPoint(controlPoint0: IVector2, controlPoint1: IVector2, point: IVector2): this
    {
        return this.bezierTo(
            controlPoint0.x, controlPoint0.y,
            controlPoint1.x, controlPoint1.y,
            point.x, point.y
        );
    }

    addSvgPathD(d: string): this
    {
        Path2.reset();

        while(true) {
            const ls = this.lastSegment;

            const e = Path2.next(d);
            if (!e) {
                break;
            }

            switch(e) {
                case "M": {
                    const v = Path2.nextNumbers(2, d);
                    if (v) {
                        this.moveTo(v[0], v[1]);
                    }
                    break;
                }
                case "m": {
                    const v = Path2.nextNumbers(2, d);
                    if (v) {
                        this.moveTo(ls.p.x + v[0], ls.p.y + v[1]);
                    }
                    break;
                }
                case "L": {
                    const v = Path2.nextNumbers(2, d);
                    if (v) {
                        this.lineTo(v[0], v[1]);
                    }
                    break;
                }
                case "l": {
                    const v = Path2.nextNumbers(2, d);
                    if (v) {
                        this.lineTo(ls.p.x + v[0], ls.p.y + v[1]);
                    }
                    break;
                }
                case "H": {
                    const value = Path2.nextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(value, ls.p.y);
                    }
                    break;
                }
                case "h": {
                    const value = Path2.nextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x + value, ls.p.y);
                    }
                    break;
                }
                case "V": {
                    const value = Path2.nextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x, value);
                    }
                    break;
                }
                case "v": {
                    const value = Path2.nextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x, ls.p.y + value);
                    }
                    break;
                }
                case "C": {
                    const v = Path2.nextNumbers(6, d);
                    if (v) {
                        this.bezierTo(v[0], v[1], v[2], v[3], v[4], v[5]);
                    }
                    break;
                }
                case "c": {
                    const v = Path2.nextNumbers(6, d);
                    if (v) {
                        this.bezierTo(
                            ls.p.x + v[0], ls.p.y + v[1],
                            ls.p.x + v[2], ls.p.y + v[3],
                            ls.p.x + v[4], ls.p.y + v[5],
                        );
                        //this.lineTo(ls.p.x + v[4], ls.p.y + v[5]);
                    }
                    break;
                }
                default:
                    console.warn(`[Path2.fromSvgPathD] unsupported command '${e}' while parsing '${d}'`);
                    break;
            }
        }

        return this;
    }

    addSvgLine(x1: string | number, y1: string | number, x2: string | number, y2: string | number): this
    {
        this.moveTo(parseFloat(x1 as string), parseFloat(y1 as string));
        this.lineTo(parseFloat(x2 as string), parseFloat(y2 as string));
        return this;
    }

    toSvgPathD(): string
    {
        const pr = Path2.precision;
        const segs = this.segments;
        const d = [];
        let pp = { x: NaN, y: NaN };

        for (let i = 0, n = segs.length; i < n; ++i) {
            const seg = segs[i];
            const p = seg.p;

            switch(seg.type) {
                case ESegmentType.Move:
                    d.push(`M ${p.x.toFixed(pr)},${p.y.toFixed(pr)}`);
                    break;
                case ESegmentType.Line:
                    if (p.y === pp.y) {
                        d.push(`H ${p.x.toFixed(pr)}`);
                    }
                    else if (p.x === pp.x) {
                        d.push(`V ${p.y.toFixed(pr)}`);
                    }
                    else {
                        d.push(`L ${p.x.toFixed(pr)},${p.y.toFixed(pr)}`);
                    }
                    break;
                case ESegmentType.Bezier: {
                    const c0 = seg.cp0;
                    const c1 = seg.cp1;
                    d.push(`C ${c0.x.toFixed(pr)},${c0.y.toFixed(pr)},${c1.x.toFixed(pr)},${c1.y.toFixed(pr)},${p.x.toFixed(pr)},${p.y.toFixed(pr)}`)
                    break;
                }
                default:
                    console.warn(`[Path2.toSvgPathD] unhandled segment type: '${ESegmentType[seg.type]}'`);
                    break;
            }

            pp = p;
        }

        return d.join(" ");
    }
}