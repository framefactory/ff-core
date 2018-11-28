/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import types from "./propertyTypes";
import { ISystemContext } from "./System";
import Component from "./Component";

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

    update(context: ISystemContext)
    {
    }

    tick(context: ISystemContext)
    {
    }

    dispose()
    {
    }
}