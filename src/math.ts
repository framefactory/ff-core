/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export const math = {

    PI: 3.1415926535897932384626433832795,
    DOUBLE_PI: 6.283185307179586476925286766559,
    HALF_PI: 1.5707963267948966192313216916398,
    QUARTER_PI: 0.78539816339744830961566084581988,
    DEG2RAD: 0.01745329251994329576923690768489,
    RAD2DEG: 57.295779513082320876798154814105,

    modulo: (n, m) => ((n % m) + m) % m,

    roundToNext: (v, m) => v + m - ((v + m - 1) % m) - 1,

    equal: (a, b, eps = 1e-5) => Math.abs(b - a) <= eps,

    lerp: (a, b, t) => a * (1 - t) + b * t,

    clamp: v => v < 0 ? 0 : (v > 1 ? 1 : v),

    limit: (v, min, max) => v < min ? min : (v > max ? max : v),

    limitInt: function(v, min, max) {
        v = Math.trunc(v);
        return v < min ? min : (v > max ? max : v);
    },

    normalize: (v, min, max) => (v - min) / (max - min),

    normalizeLimit: (v, min, max) => {
        v = (v - min) / (max - min);
        return v < 0.0 ? 0.0 : (v > 1.0 ? 1.0 : v);
    },

    denormalize: (t, min, max) => (min + t) * (max - min),

    scale: (v, minIn, maxIn, minOut, maxOut) =>
        minOut + (v - minIn) / (maxIn - minIn) * (maxOut - minOut),

    scaleLimit: (v, minIn, maxIn, minOut, maxOut) => {
        v = v < minIn ? minIn : (v > maxIn ? maxIn : v);
        return minOut + (v - minIn) / (maxIn - minIn) * (maxOut - minOut);
    },

    deg2rad: function(degrees) {
        return degrees * 0.01745329251994329576923690768489;
    },

    rad2deg: function(radians) {
        return radians * 57.295779513082320876798154814105;
    },

    deltaRadians: function(radA, radB) {
        while (radB - radA > math.PI) {
            radA += math.DOUBLE_PI;
        }
        while (radA - radB > math.PI) {
            radB += math.DOUBLE_PI;
        }

        return radB - radA;
    },

    deltaDegrees: function(degA, degB) {
        while (degB - degA > 180) {
            degA += 360;
        }
        while (degA - degB > 180) {
            degB += 360;
        }

        return degB - degA;
    },

    random: function(min: number, max: number) {
        return min + Math.random() * (max - min);
    },

    curves: {
        linear: t => t,

        easeIn: t => Math.sin(t * math.HALF_PI),
        easeOut: t => Math.cos(t * math.HALF_PI - math.PI) + 1.0,
        ease: t => Math.cos(t * math.PI - math.PI) * 0.5 + 0.5,

        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    }
};
