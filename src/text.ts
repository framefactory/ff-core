/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

/**
 * Converts the given string from space separated text to camel case.
 */
export function toCamelCase(text: string)
{
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index == 0 ? letter.toLowerCase() : letter.toUpperCase()
    ).replace(/\s+/g, '');
}

/**
 * Converts the given string from camel case to title case separated by spaces.
 */
export function toTitleCase(text: string)
{
    return text.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}
