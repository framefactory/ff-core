/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

let _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Creates a base64 encoded globally unique identifier with a default length of 12 characters.
 * The identifier only uses letters and digits and can safely be used for file names.
 * Unique combinations: 62 ^ 12 > 2 ^ 64
 * @param {number} length Number of base64 characters in the identifier.
 * @returns {string} Globally unique identifier
 */
export default function uniqueId(length?: number)
{
    if (!length || typeof length !== "number") {
        length = 12;
    }

    let id = "";
    for (let i = 0; i < length; ++i) {
        id += _chars[Math.random() * 62 | 0];
    }

    return id;
}