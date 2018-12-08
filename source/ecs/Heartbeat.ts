/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { IPublisherEvent } from "../Publisher";
import System from "./System";
import Pulse from "./Pulse";

////////////////////////////////////////////////////////////////////////////////

export interface IHeartbeatPulseEvent extends IPublisherEvent<Heartbeat>
{
    dirty: boolean;
}

export default class Heartbeat extends Publisher<Heartbeat>
{
    readonly system: System;
    readonly pulse: Pulse;

    protected animHandler: number;
    protected event: IHeartbeatPulseEvent;

    constructor(system: System)
    {
        super();
        this.addEvent("render");

        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        this.system = system;
        this.pulse = new Pulse();

        this.animHandler = 0;
        this.event = { sender: this, dirty: true };
    }

    start()
    {
        if (this.animHandler === 0) {
            this.pulse.start();
            this.animHandler = window.requestAnimationFrame(this.onAnimationFrame);
        }
    }

    stop()
    {
        if (this.animHandler !== 0) {
            this.pulse.stop();
            window.cancelAnimationFrame(this.animHandler);
            this.animHandler = 0;
        }
    }

    protected advance()
    {
        this.pulse.advance();
        this.system.advance(this.pulse);

        this.emit("pulse", this.event);
    }

    protected onAnimationFrame()
    {
        this.advance();
        this.animHandler = window.requestAnimationFrame(this.onAnimationFrame);
    }
}