/**
 * FF Typescript/React Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Color_test from "./Color.test";
import clone_test from "./clone.test";
import check_test from "./check.test";
import conform_test from "./conform.test";
import SortedArray_test from "./SortedArray.test";
import animation_test from "./animation/test";

////////////////////////////////////////////////////////////////////////////////

suite("FF Core", function() {
    Color_test();
    clone_test();
    check_test();
    conform_test();
    SortedArray_test();
    animation_test();
});
