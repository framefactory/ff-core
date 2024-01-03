/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export function toLocalISOString(date: Date)
{
    const tzOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
}