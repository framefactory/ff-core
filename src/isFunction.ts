/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export default function isFunction(obj: unknown): boolean
{
    return !!(obj && obj.constructor && obj["call"] && obj["apply"]);
}