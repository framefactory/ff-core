/**
 * FF Typescript/React Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { assert } from "chai";
import Color from "@ff/core/Color";

const eps = 1e-6;

////////////////////////////////////////////////////////////////////////////////
// COLOR CLASS - TEST SUITE

export default function() {
    suite("Color", function() {
        suiteSetup(function() {

        });

        test("fromString - static constructor from 6-digit hex string #4d7e09", function() {
            const c = Color.fromString("#4d7e09");
            assert.approximately(c[0], 0x4d / 255, eps, "red");
            assert.approximately(c[1], 0x7e / 255, eps, "green");
            assert.approximately(c[2], 0x09 / 255, eps, "blue");
            assert.approximately(c[3], 0xff / 255, eps, "alpha");
        });

        test("fromString - static constructor from 3-digit hex string #6ea", function() {
            const c = Color.fromString("#6ea");
            assert.approximately(c[0], 0x66 / 255, eps, "red");
            assert.approximately(c[1], 0xee / 255, eps, "green");
            assert.approximately(c[2], 0xaa / 255, eps, "blue");
            assert.approximately(c[3], 0xff / 255, eps, "alpha");
        });

        test("fromString - static constructor from rgb(47, 25, 243)", function() {
            const c = Color.fromString("rgb(47, 25, 243)");
            assert.approximately(c[0], 47 / 255, eps, "red");
            assert.approximately(c[1], 25 / 255, eps, "green");
            assert.approximately(c[2], 243 / 255, eps, "blue");
            assert.approximately(c[3], 255 / 255, eps, "alpha");
        });

        test("fromString - static constructor from rgba(143, 12, 117, 0.5)", function() {
            const c = Color.fromString("rgba(143, 12, 117, 0.5)");
            assert.approximately(c[0], 143 / 255, eps, "red");
            assert.approximately(c[1], 12 / 255, eps, "green");
            assert.approximately(c[2], 117 / 255, eps, "blue");
            assert.approximately(c[3], 0.5, eps, "alpha");
        });

        test("fromString - static constructor from hsl(180, 100, 50)", function() {
            const c = Color.fromString("hsl(180, 100, 50)");
            assert.approximately(c[0], 0, eps, "red");
            assert.approximately(c[1], 1, eps, "green");
            assert.approximately(c[2], 1, eps, "blue");
            assert.approximately(c[3], 1, eps, "alpha");
        });

        test("fromString - static constructor from hsla(180, 100, 50, 0.5)", function() {
            const c = Color.fromString("hsla(180, 100, 50, 0.5)");
            assert.approximately(c[0], 0, eps, "red");
            assert.approximately(c[1], 1, eps, "green");
            assert.approximately(c[2], 1, eps, "blue");
            assert.approximately(c[3], 0.5, eps, "alpha");
        });

        test("constructor(r, g, b, a)", function() {
            const c = new Color(0.12, 1.15, -0.2, 0.3);
            assert.strictEqual(c[0], 0.12, "red");
            assert.strictEqual(c[1], 1.15, "green");
            assert.strictEqual(c[2], -0.2, "blue");
            assert.strictEqual(c[3], 0.3, "alpha");
        });

        test("constructor(array)", function() {
            const c = new Color([ 0.12, 1.15, -0.2, 0.3 ]);
            assert.strictEqual(c[0], 0.12, "red");
            assert.strictEqual(c[1], 1.15, "green");
            assert.strictEqual(c[2], -0.2, "blue");
            assert.strictEqual(c[3], 0.3, "alpha");
        });

        test("constructor(Color)", function() {
            const b = new Color([ 0.12, 1.15, -0.2, 0.3 ]);
            const c = new Color(b);
            assert.strictEqual(c[0], 0.12, "red");
            assert.strictEqual(c[1], 1.15, "green");
            assert.strictEqual(c[2], -0.2, "blue");
            assert.strictEqual(c[3], 0.3, "alpha");
        });

        test("getters red, green, blue, alpha", function() {
            const c = new Color(0.12, 0.45, 0.96, 0.1);
            assert.strictEqual(c.red, 0.12, "red");
            assert.strictEqual(c.green, 0.45, "green");
            assert.strictEqual(c.blue, 0.96, "blue");
            assert.strictEqual(c.alpha, 0.1, "alpha");
        });

        test("setters red, green, blue, alpha", function() {
            const c = new Color();
            c.red = 0.12;
            c.green = 0.45;
            c.blue = 0.96;
            c.alpha = 0.1;
            assert.strictEqual(c[0], 0.12, "red");
            assert.strictEqual(c[1], 0.45, "green");
            assert.strictEqual(c[2], 0.96, "blue");
            assert.strictEqual(c[3], 0.1, "alpha");
        });

        test("getters redByte, greenByte, blueByte, alphaByte", function() {
            const c = new Color(0.12, 0.45, 0.96, 0.1);
            assert.strictEqual(c.redByte, Math.floor(0.12 * 255), "red");
            assert.strictEqual(c.greenByte, Math.floor(0.45 * 255), "green");
            assert.strictEqual(c.blueByte, Math.floor(0.96 * 255), "blue");
            assert.strictEqual(c.alphaByte, Math.floor(0.1 * 255), "alpha");
        });

        test("setters redByte, greenByte, blueByte, alphaByte", function() {
            const c = new Color();
            c.redByte = 0.12 * 255;
            c.greenByte = 0.45 * 255;
            c.blueByte = 0.96 * 255;
            c.alphaByte = 0.1 * 255;
            assert.strictEqual(c[0], 0.12, "red");
            assert.strictEqual(c[1], 0.45, "green");
            assert.strictEqual(c[2], 0.96, "blue");
            assert.strictEqual(c[3], 0.1, "alpha");

        });

        test("toString - returns a 6-digit hex color if alpha === 1", function() {
            const str = "#4b7fda";
            const c = Color.fromString(str);
            assert.strictEqual(c.toString(), str);
        });

        test("toString - returns an rgba color string if alpha < 1", function() {
            const str = "rgba(143, 12, 117, 0.2)";
            const c = Color.fromString(str);
            assert.strictEqual(c.toString(), str);
        });

        test("setHSL - hsl to rgb conversion, without alpha", function() {
            const c = new Color();
            c.setHSL(240, 1, 0.5);
            assert.approximately(c[0], 0, eps, "red");
            assert.approximately(c[1], 0, eps, "green");
            assert.approximately(c[2], 1, eps, "blue");
            assert.approximately(c[3], 1, eps, "alpha");
        });

        test("setHSL - hsl to rgb conversion, with alpha", function() {
            const c = new Color();
            c.setHSL(120, 0.5, 0.5, 0.31);
            assert.approximately(c[0], 0.25, eps, "red");
            assert.approximately(c[1], 0.75, eps, "green");
            assert.approximately(c[2], 0.25, eps, "blue");
            assert.approximately(c[3], 0.31, eps, "alpha");
        });

        test("toHSL - rgb to hsl conversion (a)", function() {
            const b = { hue: 291, saturation: 0.31, luminance: 0.74 };
            const c = new Color();
            c.setHSL(b.hue, b.saturation, b.luminance);
            const d = c.toHSL();
            assert.approximately(d.hue, b.hue, eps, "hue");
            assert.approximately(d.saturation, b.saturation, eps, "saturation");
            assert.approximately(d.luminance, b.luminance, eps, "luminance");
        });

        test("toHSL - rgb to hsl conversion (b)", function() {
            const b = { hue: 35, saturation: 0.89, luminance: 0.12 };
            const c = new Color();
            c.setHSL(b.hue, b.saturation, b.luminance);
            const d = c.toHSL();
            assert.approximately(d.hue, b.hue, eps, "hue");
            assert.approximately(d.saturation, b.saturation, eps, "saturation");
            assert.approximately(d.luminance, b.luminance, eps, "luminance");
        });

        test("inverseMultiply", function() {
            const c = new Color(0.63, 0.42, 0.89, 0.2);
            const d = c.clone();
            const f = 0.52;
            d.inverseMultiply(f);
            assert.approximately(d[0], c[0] * (1 - f) + f, eps, "red");
            assert.approximately(d[1], c[1] * (1 - f) + f, eps, "green");
            assert.approximately(d[2], c[2] * (1 - f) + f, eps, "blue");
            assert.strictEqual(d[3], c[3], "alpha");
        });

        test("multiply", function() {
            const c = new Color(0.63, 0.42, 0.89, 0.2);
            const d = c.clone();
            const f = 0.67;
            d.multiply(f);
            assert.approximately(d[0], c[0] * f, eps, "red");
            assert.approximately(d[1], c[1] * f, eps, "green");
            assert.approximately(d[2], c[2] * f, eps, "blue");
            assert.strictEqual(d[3], c[3], "alpha");
        });
    });
};

