/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { ISystemContext } from "./System";

////////////////////////////////////////////////////////////////////////////////

export default class Pulse implements ISystemContext
{
    time: Date;
    secondsElapsed: number;
    secondsDelta: number;
    frameNumber: number;

    protected _secondsStarted: number;
    protected _secondsStopped: number;

    constructor()
    {
        this.reset();
    }

    start()
    {
        if (this._secondsStopped > 0) {
            this._secondsStarted += (Date.now() * 0.001 - this._secondsStopped);
            this._secondsStopped = 0;
        }
    }

    stop()
    {
        if (this._secondsStopped === 0) {
            this._secondsStopped = Date.now() * 0.001;
        }
    }

    advance()
    {
        this.time = new Date();
        const elapsed = this.time.valueOf() * 0.001 - this._secondsStarted;
        this.secondsDelta = elapsed - this.secondsElapsed;
        this.secondsElapsed = elapsed;
        this.frameNumber++;
    }

    reset()
    {
        this.time = new Date();
        this.secondsElapsed = 0;
        this.secondsDelta = 0;
        this.frameNumber = 0;

        this._secondsStarted = Date.now() * 0.001;
        this._secondsStopped = this._secondsStarted;
    }
}