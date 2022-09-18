/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { ReturnType } from "./types.js";
import Publisher, { ITypedEvent } from "./Publisher.js";
import Commander from "./Commander.js";

////////////////////////////////////////////////////////////////////////////////

export { Commander, ITypedEvent };
export type Actions<T extends Controller<any>> = ReturnType<T["createActions"]>;

export default abstract class Controller<T extends Controller<any>> extends Publisher
{
    public readonly actions: Actions<Controller<T>>;

    constructor(commander: Commander)
    {
        super();
        this.actions = this.createActions(commander);
    }

    abstract createActions(commander: Commander);
}