/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

/**
 * Calculates an unsafe hash for the given string.
 * @returns A hash string (base 36 encoded integer hash).
 */
export function hashString(str: string): string {
    // see https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
    let hash = 0;
    for (let i = 0, n = str.length; i < n; ++i) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return new Uint32Array([hash])[0].toString(36);
}

export function hashObject(obj: object): string {
    return hashString(JSON.stringify(obj));
}