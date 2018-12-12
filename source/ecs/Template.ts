/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import {
    types,
    Component,
    IUpdateContext,
    IRenderContext
} from "./index";

////////////////////////////////////////////////////////////////////////////////

export class Base extends Component
{
    static readonly type: string = "Base";

    ins = this.ins.append({
        position: types.Vector3("Position")
    });
}

export default class Derived extends Base
{
    static readonly type: string = "Derived";

    ins = this.ins.append({
        rotation: types.Vector3("Rotation")
    });

    outs = this.outs.append({
        matrix: types.Matrix4("Matrix")
    });

    create()
    {
    }

    update(context: IUpdateContext): boolean
    {
        const { position, rotation } = this.ins;

        if (position.changed) {
            // ...
        }

        if (rotation.changed) {
            // ...
        }

        return true;
    }

    tick(context: IUpdateContext): boolean
    {
        return false;
    }

    preRender(context: IRenderContext)
    {
    }

    postRender(context: IRenderContext)
    {
    }

    dispose()
    {
    }
}