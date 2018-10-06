/**
 * FF Typescript/React Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Component from "@ff/core/ecs/Component";
import Make from "@ff/core/ecs/propertyTypes";

////////////////////////////////////////////////////////////////////////////////

export default class TestComponent extends Component
{
    static readonly type: string = "Test";
    static readonly isEntitySingleton: boolean = false;

    ins = this.makeProps({
        num0: Make.Number("Test.Number0"),
        num1: Make.Property("Test.Number1", 42),
        vec2: Make.Vector2("Test.Vector2"),
        vec3: Make.Vector3("Test.Vector3", { preset: [ 1, 2, 3] }),
        vec4: Make.Vector4("Test.Vector4", [ 1, 2, 3, 4 ]),
        bool0: Make.Property("Test.Boolean0", false),
        bool1: Make.Boolean("Test.Boolean1", { preset: true }),
        str0: Make.String("Test.String0"),
        str1: Make.String("Test.String1", "Hello"),
        strVec2: Make.Property("Test.StrVec", [ "first", "second" ]),
        enum0: Make.Enum("Test.Enum0", [ "one", "two", "three" ]),
        enum1: Make.Enum("Test.Enum1", [ "four", "five", "six" ], 2),
        enum2: Make.Property("Test.Enum2", { options: [ "seven", "eight", "nine" ], preset: 1 }),
        obj0: Make.Object("Test.Object0")
    });

    outs = this.makeProps({
        num0: Make.Number("Test.Number0"),
        num1: Make.Property("Test.Number1", 42),
        vec2: Make.Vector2("Test.Vector2"),
        vec3: Make.Vector3("Test.Vector3", { preset: [ 1, 2, 3] }),
        vec4: Make.Vector4("Test.Vector4", [ 1, 2, 3, 4 ]),
        bool0: Make.Property("Test.Boolean0", false),
        bool1: Make.Boolean("Test.Boolean1", { preset: true }),
        str0: Make.String("Test.String0"),
        str1: Make.String("Test.String1", "Hello"),
        strVec2: Make.Property("Test.StrVec", [ "first", "second" ]),
        enum0: Make.Enum("Test.Enum0", [ "one", "two", "three" ]),
        enum1: Make.Enum("Test.Enum1", [ "four", "five", "six" ], 2),
        enum2: Make.Property("Test.Enum2", { options: [ "seven", "eight", "nine" ], preset: 1 }),
        obj0: Make.Object("Test.Object0")
    });

    create()
    {
    }

    update()
    {
    }

    tick()
    {
    }
}


