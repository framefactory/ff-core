/**
 * FF Typescript/React Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { assert } from "chai";
import TestComponent from "./TestComponent";

import System from "@ff/core/ecs/System";

////////////////////////////////////////////////////////////////////////////////

export default function() {
    suite("Property", function() {
        const system = new System();
        const entity = system.createEntity("Test");
        const comp0 = entity.createComponent(TestComponent, "one");
        const comp1 = entity.createComponent(TestComponent, "two");
        const comp2 = entity.createComponent(TestComponent, "three");

        test("construction/path", function() {
            const ins = comp0.ins;
            assert.strictEqual(ins.num0.path, "Test.Number0");
            assert.strictEqual(ins.vec3.path, "Test.Vector3");
            assert.strictEqual(ins.obj0.path, "Test.Object0");
        });

        test("construction/preset", function() {
            const ins = comp0.ins;
            assert.strictEqual(ins.num0.value, 0);
            assert.strictEqual(ins.num1.value, 42);
            assert.deepStrictEqual(ins.vec2.value, [0, 0]);
            assert.deepStrictEqual(ins.vec3.value, [1, 2, 3]);
            assert.deepStrictEqual(ins.vec4.value, [1, 2, 3, 4]);
            assert.strictEqual(ins.bool0.value, false);
            assert.strictEqual(ins.bool1.value, true);
            assert.strictEqual(ins.str0.value, "");
            assert.strictEqual(ins.str1.value, "Hello");
            assert.strictEqual(ins.enum0.value, 0);
            assert.strictEqual(ins.enum1.value, 2);
            assert.strictEqual(ins.enum2.value, 1);
            assert.strictEqual(ins.obj0.value, null);
        });

        test("construction/type", function() {
            const ins = comp0.ins;
            assert.strictEqual(ins.num0.type, "number");
            assert.strictEqual(ins.num1.type, "number");
            assert.strictEqual(ins.num1.elements, 1);
            assert.deepStrictEqual(ins.vec2.type, "number");
            assert.strictEqual(ins.vec2.elements, 2);
            assert.deepStrictEqual(ins.vec3.type, "number");
            assert.strictEqual(ins.vec3.elements, 3);
            assert.deepStrictEqual(ins.vec4.type, "number");
            assert.strictEqual(ins.vec4.elements, 4);
            assert.strictEqual(ins.bool0.type, "boolean");
            assert.strictEqual(ins.bool0.elements, 1);
            assert.strictEqual(ins.bool1.type, "boolean");
            assert.strictEqual(ins.str0.type, "string");
            assert.strictEqual(ins.str1.type, "string");
            assert.strictEqual(ins.str1.elements, 1);
            assert.strictEqual(ins.enum0.type, "number", "enum0");
            assert.strictEqual(ins.enum1.type, "number", "enum1");
            assert.strictEqual(ins.enum2.type, "number", "enum2");
            assert.strictEqual(ins.obj0.type, "object");
        });

        test("construction/enum", function() {
            const ins = comp0.ins;
            assert.deepStrictEqual(ins.enum0.schema.options, [ "one", "two", "three" ]);
            assert.deepStrictEqual(ins.enum2.schema.options, [ "seven", "eight", "nine" ]);
        });

        test("linking/simple", function() {
            assert.isTrue(comp0.outs.num0.canLinkTo(comp1.ins.num0));
            comp0.outs.num0.linkTo(comp1.ins.num0);
            comp0.outs.num0.setValue(13);
            assert.strictEqual(comp1.ins.num0.value, 13);

            assert.isTrue(comp0.outs.vec3.canLinkTo(comp1.ins.vec3));
            comp0.outs.vec3.linkTo(comp1.ins.vec3);
            comp0.outs.vec3.value = [ 21, 22, 23 ];
            comp0.outs.vec3.setChanged();
            assert.deepStrictEqual(comp1.ins.vec3.value, [ 21, 22, 23 ]);

            assert.isTrue(comp0.outs.str1.canLinkTo(comp1.ins.str0));
            assert.strictEqual(comp0.outs.str1.value, "Hello");
            assert.strictEqual(comp1.ins.str0.value, "");
            comp0.outs.str1.linkTo(comp1.ins.str0);
            assert.strictEqual(comp1.ins.str0.value, "Hello");
            comp0.outs.str1.setValue("World");
            assert.strictEqual(comp1.ins.str0.value, "World");

            comp0.unlink();
            comp1.unlink();
        });

        test("linking/conversion", function() {
            assert.isTrue(comp0.outs.strVec2.canLinkTo(comp1.ins.vec2));
            comp0.outs.strVec2.linkTo(comp1.ins.vec2);
            comp0.outs.strVec2.setValue([ "11.1", "22.2" ]);
            assert.deepStrictEqual(comp1.ins.vec2.value, [ 11.1, 22.2 ]);
        });

        test("linking/elements", function() {
            assert.isTrue(comp0.outs.vec4.canLinkTo(comp1.ins.num0, 1, undefined));
            comp0.outs.vec4.linkTo(comp1.ins.num0, 1, undefined);
            comp1.ins.num0.value = 121;
            assert.strictEqual(comp1.ins.num0.value, 121);
            comp0.outs.vec4.setValue([ 123, 234, 345, 456 ]);
            assert.strictEqual(comp1.ins.num0.value, 234);

            assert.deepStrictEqual(comp1.ins.vec4.value, [ 1, 2, 3, 4 ]);
            assert.isTrue(comp0.outs.num0.canLinkTo(comp1.ins.vec4, undefined, 2));
            comp0.outs.num0.linkTo(comp1.ins.vec4, undefined, 2);
            assert.deepStrictEqual(comp1.ins.vec4.value, [ 1, 2, 13, 4 ]);
            comp0.outs.num0.value = 789;
            comp0.outs.num0.setChanged();
            assert.deepStrictEqual(comp1.ins.vec4.value, [ 1, 2, 789, 4 ]);
        });

        test("linking/sort", function() {
            const system = new System();
            const entity = system.createEntity("Test");
            const comps = new Array(10).fill(null).map(el => new TestComponent(entity));
            const indices = [ 5, 7, 1, 0, 6, 9, 4, 8, 2, 3 ];
            for (let i = 1; i < indices.length; ++i) {
                const c0 = comps[indices[i - 1]];
                const c1 = comps[indices[i]];
                c0.outs.num0.linkTo(c1.ins.num0);
            }
            system.sort();
            const sorted = system.getComponents();
            assert.equal(sorted.length, comps.length);
            for (let i = 0; i < comps.length; ++i) {
                assert.equal(comps[indices[i]], sorted[i]);
            }
        });
    });
};
