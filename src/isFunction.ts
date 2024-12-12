/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export function isFunction(obj: unknown): boolean
{
    return !!(obj && obj.constructor && obj["call"] && obj["apply"]);
}