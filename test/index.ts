/**
 * FF Typescript Foundation Library
 * Copyright 2023 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

// define vars on node global object (usually done by Webpack)
global["ENV_DEVELOPMENT"] = false;
global["ENV_PRODUCTION"] = true;
global["ENV_VERSION"] = "Test";

import { Vector2_test } from "./Vector2.test.js";
import { Vector3_test } from "./Vector3.test.js";
import { Color_test } from "./Color.test.js";
import { clone_test } from "./clone.test.js";
import { check_test } from "./check.test.js";
import { conform_test } from "./conform.test.js";
import { SortedArray_test } from "./SortedArray.test.js";
import { SplineTrack_test } from "./SplineTrack.test.js";

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
