# jest-fs-snapshot · [![npm][1]][2] [![Build Status][3]][4] [![codecov][5]][6]

[Jest](https://jestjs.io) matcher for filesystem snapshotting.

## Table of Contents

-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [API](#api)
    -   [`toMatchFilesystemSnapshot`](#tomatchfilesystemsnapshot)
-   [Credits](#credits)

## Installation

```sh
yarn add jest-fs-snapshot
```

## Getting Started

1.  Extend Jest's `expect`

```js
import {toMatchFilesystemSnapshot} from 'jest-fs-snapshot';

expect.extend({toMatchFilesystemSnapshot});
```

2.  Use it in your tests!

```js
test('if build directory matches snapshot', () => {
    const pathToBuildDir = path.resolve(process.cwd(), '.build');
    expect(pathToBuildDir).toMatchFilesystemSnapshot();
});
```

This will create a `__fs_snapshots__` folder next to your test file with a snapshot file. On next runs it will chech if the snapshot against the source directory and with throw on mismatches.

## API

### .toMatchFilesystemSnapshot([pathToSnapshot])

**Arguments**

1.  `pathToSnapshot` _(String)_: An optional full path to a snapshot file.

## Credits

Many files for `encodings` fixture have been taken from https://github.com/mbbill/fencview.

---

[1]: https://img.shields.io/npm/v/jest-fs-snapshot.svg
[2]: https://npm.im/jest-fs-snapshot
[3]: https://travis-ci.com/vlad-zhukov/jest-fs-snapshot.svg?branch=master
[4]: https://travis-ci.com/vlad-zhukov/jest-fs-snapshot
[5]: https://codecov.io/gh/vlad-zhukov/jest-fs-snapshot/branch/master/graph/badge.svg
[6]: https://codecov.io/gh/vlad-zhukov/jest-fs-snapshot
