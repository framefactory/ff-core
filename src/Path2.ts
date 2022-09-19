/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Vector2, IVector2 } from "./Vector2.js";

////////////////////////////////////////////////////////////////////////////////

const _vec2 = new Vector2();

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
export class Path2
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

    private static readonly _rePath = /([mlhvcsqt]|-?[\d\.]*)[,\s]?/gmi;

    private static _reNext(d: string): string | null
    {
        const match = Path2._rePath.exec(d);
        return match && match[1];
    }

    private static _reNextNumber(d: string): number
    {
        const match = Path2._reNext(d);
        return match ? parseFloat(match) : NaN;
    }

    private static _reNextNumbers(count: number, d: string): number[]
    {
        const result = [];

        for (let i = 0; i < count; ++i) {
            const v = Path2._reNextNumber(d);
            if (!isFinite(v)) {
                return null;
            }

            result.push(v);
        }

        return result;
    }

    private static _reReset()
    {
        Path2._rePath.lastIndex = 0;
    }

    segments: ISegment2[] = [];

    get lastSegment(): ISegment2 {
        return this.segments[this.segments.length - 1];
    }

    get start(): IVector2 {
        const seg = this.segments[0];
        return seg ? seg.p : null;
    }

    get end(): IVector2 {
        const seg = this.lastSegment;
        return seg ? seg.p : null;
    }

    get length(): number {
        const segs = this.segments;
        let length = 0;
        let prev = segs[0];

        for (let i = 1, n = segs.length; i < n; ++i) {
            const seg = segs[i];

            switch(seg.type) {
                case ESegmentType.Move: 
                case ESegmentType.Line: {
                    length += _vec2.copy(prev.p).distanceTo(seg.p);
                    break;
                }
                case ESegmentType.Bezier: {
                    const ll = _vec2.copy(prev.p).distanceTo(seg.p);
                    const lc0 = _vec2.distanceTo(seg.cp0);
                    const lc1 = _vec2.copy(seg.cp1).distanceTo(seg.cp0);
                    const lc2 = _vec2.distanceTo(seg.p);
                    length += (ll + lc0 + lc1 + lc2) * 0.5;
                    break;
                }
            }

            prev = seg;
        }

        return length;
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

    moveTo(x: number, y: number, eps = 1e-5): this
    {
        const end = this.end;

        // avoid no-op moves
        if (!end || Math.abs(end.x - x) + Math.abs(end.y - y) > eps) {
            if (end) {
                console.info("[Path2.moveTo] inserted", Math.abs(end.x - x) + Math.abs(end.y - y));
            }
            this.segments.push({
                type: ESegmentType.Move,
                p: { x, y },
            });
        }

        return this;
    }

    moveToPoint(point: IVector2, eps = 1e-5): this
    {
        return this.moveTo(point.x, point.y, eps);
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
        Path2._reReset();

        while(true) {
            const ls = this.lastSegment;

            const e = Path2._reNext(d);
            if (!e) {
                break;
            }

            switch(e) {
                case "M": {
                    const v = Path2._reNextNumbers(2, d);
                    if (v) {
                        this.moveTo(v[0], v[1]);
                    }
                    break;
                }
                case "m": {
                    const v = Path2._reNextNumbers(2, d);
                    if (v) {
                        this.moveTo(ls.p.x + v[0], ls.p.y + v[1]);
                    }
                    break;
                }
                case "L": {
                    const v = Path2._reNextNumbers(2, d);
                    if (v) {
                        this.lineTo(v[0], v[1]);
                    }
                    break;
                }
                case "l": {
                    const v = Path2._reNextNumbers(2, d);
                    if (v) {
                        this.lineTo(ls.p.x + v[0], ls.p.y + v[1]);
                    }
                    break;
                }
                case "H": {
                    const value = Path2._reNextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(value, ls.p.y);
                    }
                    break;
                }
                case "h": {
                    const value = Path2._reNextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x + value, ls.p.y);
                    }
                    break;
                }
                case "V": {
                    const value = Path2._reNextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x, value);
                    }
                    break;
                }
                case "v": {
                    const value = Path2._reNextNumber(d);
                    if (isFinite(value)) {
                        this.lineTo(ls.p.x, ls.p.y + value);
                    }
                    break;
                }
                case "C": {
                    const v = Path2._reNextNumbers(6, d);
                    if (v) {
                        this.bezierTo(v[0], v[1], v[2], v[3], v[4], v[5]);
                    }
                    break;
                }
                case "c": {
                    const v = Path2._reNextNumbers(6, d);
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

    addPath(path: Path2, eps = 1e-5): this
    {
        const segs = path.segments;
 
        for (let i = 0, n = segs.length; i < n; ++i) {
            const seg = segs[i];
            switch(seg.type) {
                case ESegmentType.Move:
                    this.moveTo(seg.p.x, seg.p.y, eps);
                    break;
                case ESegmentType.Line:
                    this.lineTo(seg.p.x, seg.p.y);
                    break;
                case ESegmentType.Bezier:
                    this.bezierTo(seg.cp0.x, seg.cp0.y, seg.cp1.x, seg.cp1.y, seg.p.x, seg.p.y);
                    break;
            }
        }

        return this;
    }

    addReversePath(path: Path2, eps = 1e-5): this
    {
        const segs = path.segments;
        
        if (segs.length > 0) {
            this.moveToPoint(path.end, eps);

            for (let i = segs.length - 1; i > 0; --i) {
                const p = segs[i - 1].p;
                const seg = segs[i];
                switch(seg.type) {
                    case ESegmentType.Move:
                        this.moveToPoint(p, eps);
                        break;
                    case ESegmentType.Line:
                        this.lineToPoint(p);
                        break;
                    case ESegmentType.Bezier:
                        this.bezierToPoint(seg.cp1, seg.cp0, p);
                        break;
                }
            }
        }

        return this;
    }

    translate(tx: number, ty: number): this
    {
        const segs = this.segments;

        for (let i = 0, n = segs.length; i < n; ++i) {
            const seg = segs[i];
            seg.p.x += tx;
            seg.p.y += ty;
            if (seg.type === ESegmentType.Bezier) {
                seg.cp0.x += tx;
                seg.cp0.y += ty;
                seg.cp1.x += tx;
                seg.cp1.y += ty;
            }
        }

        return this;
    }

    scale(sx: number, sy: number)
    {
        const segs = this.segments;

        for (let i = 0, n = segs.length; i < n; ++i) {
            const seg = segs[i];
            seg.p.x *= sx;
            seg.p.y *= sy;
            if (seg.type === ESegmentType.Bezier) {
                seg.cp0.x *= sx;
                seg.cp0.y *= sy;
                seg.cp1.x *= sx;
                seg.cp1.y *= sy;
            }
        }

        return this;

    }

    getReversed<T extends Path2>(result: T): T
    {
        const segs = this.segments;

        if (segs.length > 0) {
            result.moveToPoint(this.end);
            for (let i = segs.length - 1; i > 0; --i) {
                const p = segs[i - 1].p;
                const seg = segs[i];
                switch(seg.type) {
                    case ESegmentType.Move:
                        result.moveToPoint(p);
                        break;
                    case ESegmentType.Line:
                        result.lineToPoint(p);
                        break;
                    case ESegmentType.Bezier:
                        result.bezierToPoint(seg.cp1, seg.cp0, p);
                        break;
                }
            }
        }

        return result;
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