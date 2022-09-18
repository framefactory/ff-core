# FF Core Typescript Foundation Library

Copyright 2022 [Frame Factory GmbH](https://framefactory.ch), [Ralph Wiedemeier](https://about.me/ralphw)

## Overview

This library is part of the Frame Factory Typescript foundation libraries. It provides core functions and types for building rich web and service applications.

## Features

- Collection types such as sorted arrays
- Utilities for handling objects (cloning, inheritance, mixin, type checking, etc.)
- Publisher base class for event broadcasting
- Dynamic type registration
- Rich color type with support for RGB and HSV with alpha channel. Converts to/from web color strings and float arrays (WebGL).
- Core math utilities
- Generators for unique ids
- Linear algebra types for graphics (vectors and matrices)
- Geometric primitives (paths, rectangles, boxes, etc.)
- Animation support (tweening, keyframe tracks with cubic spline support, etc.)
- Support for state machines and properties

## Usage

- `src` contains the TypeScript source code
- `build/js` contains transpiled JavaScript modules
- `build/types` contains TypeScript type annotations and maps
- `build/test` contains compiled test code

```
# clean build directory
npm run clean

# build the library
npm run build

# build and run the tests
npm run test
```

## License

[MIT](./LICENSE.md)