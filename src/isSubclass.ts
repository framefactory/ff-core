/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Constructor } from "./types";

export default function isSubclass(derived: Constructor, base: Constructor): boolean
{
    if (!derived || !base) {
        return false;
    }

    let prototype = derived.prototype;
    while (prototype) {
        if (prototype === base.prototype) {
            return true;
        }

        prototype = prototype.prototype;
    }

    return false;
}