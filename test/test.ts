/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

// define vars on node global object (usually done by Webpack)
global["ENV_DEVELOPMENT"] = false;
global["ENV_PRODUCTION"] = true;
global["ENV_VERSION"] = "Test";

import Vector2_test from "./Vector2.test";
import Vector3_test from "./Vector3.test";
import Color_test from "./Color.test";
import clone_test from "./clone.test";
import check_test from "./check.test";
import conform_test from "./conform.test";
import SortedArray_test from "./SortedArray.test";
import SplineTrack_test from "./SplineTrack.test";

////////////////////////////////////////////////////////////////////////////////

export default suite("FF Core", function() {
    Vector2_test();
    Vector3_test();
    Color_test();
    clone_test();
    check_test();
    conform_test();
    SortedArray_test();
    SplineTrack_test();
});
