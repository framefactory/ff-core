/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

const PI = Math.PI;
const HALF_PI = PI * 0.5;

export enum EEasingCurve {
    Linear,
    EaseQuad,
    EaseInQuad,
    EaseOutQuad,
    EaseCubic,
    EaseInCubic,
    EaseOutCubic,
    EaseQuart,
    EaseInQuart,
    EaseOutQuart,
    EaseQuint,
    EaseInQuint,
    EaseOutQuint,
    EaseSine,
    EaseInSine,
    EaseOutSine,
}

export function getEasingFunction(curve: EEasingCurve): (t: number) => number
{
    return easingFunctions[EEasingCurve[curve]];
}

export const easingFunctions = {
    Linear: function (t: number): number { return t },

    EaseQuad: function (t: number): number { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t },
    EaseInQuad: function (t: number): number { return t*t },
    EaseOutQuad: function (t: number): number { return t*(2-t) },

    EaseCubic: function (t: number): number { return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    EaseInCubic: function (t: number): number { return t*t*t },
    EaseOutCubic: function (t: number): number { return (--t)*t*t+1 },

    EaseQuart: function (t: number): number { return t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    EaseInQuart: function (t: number): number { return t*t*t*t },
    EaseOutQuart: function (t: number): number { return 1-(--t)*t*t*t },

    EaseQuint: function (t: number): number { return t < 0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
    EaseInQuint: function (t: number): number { return t*t*t*t*t },
    EaseOutQuint: function (t: number): number { return 1+(--t)*t*t*t*t },

    EaseSine: function (t: number): number { return -0.5 * (Math.cos(t * PI) - 1); },
    EaseInSine: function (t: number): number { return 1 - Math.cos(t * HALF_PI); },
    EaseOutSine: function (t: number): number { return Math.sin(t * HALF_PI); },
};