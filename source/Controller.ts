/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { ReturnType } from "./types";
import Publisher, { IPublisherEvent } from "./Publisher";
import Commander from "./Commander";

////////////////////////////////////////////////////////////////////////////////

export { Commander, IPublisherEvent };
export type Actions<T extends Controller<any>> = ReturnType<T["createActions"]>;

export default abstract class Controller<T extends Controller<any>> extends Publisher<T>
{
    public readonly actions: Actions<Controller<T>>;

    constructor(commander: Commander)
    {
        super();
        this.actions = this.createActions(commander);
    }

    abstract createActions(commander: Commander);
}