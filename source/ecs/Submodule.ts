/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Component from "./Component";
import Module from "./Module";
import { IUpdateContext, IRenderContext } from "./System";

////////////////////////////////////////////////////////////////////////////////

export default class Submodule extends Component
{
    static readonly type: string = "Submodule";

    readonly module = new Module(this.system);

    update(context: IUpdateContext): boolean
    {
        return this.module.update(context);
    }

    tick(context: IUpdateContext): boolean
    {
        // keep changed flag set to ensure module is always updated
        this.changed = true;

        return this.module.tick(context);
    }

    preRender(context: IRenderContext)
    {
        this.module.preRender(context);
    }

    postRender(context: IRenderContext)
    {
        this.module.postRender(context);
    }

    inflate(json: any)
    {
        super.inflate(json);
        this.module.inflate(json.module);
    }

    deflate()
    {
        const json = super.deflate();
        json.module = this.module.deflate();
    }
}
