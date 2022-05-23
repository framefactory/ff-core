/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

const fourDigits = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

/**
 * Creates a standard hex GUID in the format
 * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * @returns {string} Globally unique identifier
 */
export default function uuid(): string
{
    return fourDigits() + fourDigits() + '-' + fourDigits() + '-' + fourDigits() + '-' +
        fourDigits() + '-' + fourDigits() + fourDigits() + fourDigits();
}