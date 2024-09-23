/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Type } from "./types.js";

export function extend(derivedClass: Type, baseClass: Type): void
{
    // create prototype chain
    const derivedPrototype = Object.create(baseClass.prototype);
    derivedPrototype.constructor = derivedClass;
    derivedClass.prototype = derivedPrototype;

    // copy static properties
    Object.getOwnPropertyNames(baseClass).forEach(property => {
        derivedClass[property] = baseClass[property];
    });
}