/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

// ENUM HELPER FUNCTIONS

export const enumToArray = function(e: object): string[] {
    return Object.keys(e).filter(key => isNaN(Number(key)));
};
