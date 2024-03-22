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

export function isEqual(date1: Date, date2: Date)
{
    return date1.getTime() === date2.getTime();
}

export function isSameDate(date1: Date, date2: Date)
{
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}