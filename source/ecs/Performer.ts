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

export interface IPerformerRenderEvent extends IPublisherEvent<Performer>
{
    system: System;
    pulse: Pulse;
    dirty: boolean;
}

export default class Performer extends Publisher<Performer>
{
    system: System;

    protected pulse: Pulse;
    protected animHandler: number;
    protected renderEvent: IPerformerRenderEvent;

    constructor(system?: System)
    {
        super();
        this.addEvent("render");

        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        this.system = system;
        this.pulse = new Pulse();
        this.animHandler = 0;
        this.renderEvent = { system, pulse: this.pulse, sender: this, dirty: true };
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

        this.system.update(this.pulse);
        this.system.tick(this.pulse);

        this.emit("render", this.renderEvent);
    }

    protected onAnimationFrame()
    {
        this.advance();
        this.animHandler = window.requestAnimationFrame(this.onAnimationFrame);
    }
}