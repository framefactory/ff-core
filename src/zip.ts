/**
 * FF Typescript Foundation Library
 * Copyright 2025 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

/**
 * Python-style zip function for two arrays. Returns an array of tuples,
 * each containing the i-th element of the input arrays. The output array
 * has the length of the shorter input array.
 */
export function zip<T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][]
{
    return Array.from(Array(Math.min(arr1.length, arr2.length)), 
        (_, i) => [arr1[i], arr2[i]]);
}

/**
 * Python-style zip function for three arrays. Returns an array of tuples,
 * each containing the i-th element of the input arrays. The output array
 * has the length of the shortest input array.
 */
export function zip3<T1, T2, T3>(arr1: T1[], arr2: T2[], arr3: T3[]): [T1, T2, T3][]
{
    return Array.from(Array(Math.min(arr1.length, arr2.length, arr3.length)), 
        (_, i) => [arr1[i], arr2[i], arr3[i]]);
}