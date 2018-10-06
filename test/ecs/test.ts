/**
 * FF Typescript/React Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import EntityComponent_test from "./EntityComponent.test";
import Property_test from "./Property.test";

////////////////////////////////////////////////////////////////////////////////

export default function() {
    suite("entity/component system", function() {
        EntityComponent_test();
        Property_test();
    })
}
