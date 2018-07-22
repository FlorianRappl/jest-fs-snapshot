import {getDirectoryTree, compareDirectoryTrees} from '../src/tree';
import {getFixture} from '../__test-helpers__/util';

describe('compareDirectoryTrees()', () => {
    it('should throw if a node has an unknown type', () => {
        expect(() => compareDirectoryTrees({actual: 'foo', expected: {size: 0}})).toThrowErrorMatchingInlineSnapshot(
            `"Unknown node type '\\"foo\\"' at ./."`
        );

        expect(() =>
            compareDirectoryTrees({actual: {size: 0}, expected: {foo: 'bar'}})
        ).toThrowErrorMatchingInlineSnapshot(`"Unknown node type '{\\"foo\\":\\"bar\\"}' at ./."`);

        const actual = {
            files: {
                foo: 'bar',
            },
        };

        const expected = {
            files: {
                foo: {
                    size: 0,
                },
            },
        };

        expect(() => compareDirectoryTrees({actual, expected})).toThrowErrorMatchingInlineSnapshot(
            `"Unknown node type '\\"bar\\"' at ./foo."`
        );
    });

    it('should throw if the root is not a directory', () => {
        const options1 = {
            actual: {
                size: 1,
            },
            expected: {
                files: {},
            },
        };
        expect(() => compareDirectoryTrees(options1)).toThrowErrorMatchingInlineSnapshot(
            `"The roots must be directories but got a file and a directory."`
        );

        const options2 = {
            actual: {
                files: {},
            },
            expected: {
                size: 2,
            },
        };
        expect(() => compareDirectoryTrees(options2)).toThrowErrorMatchingInlineSnapshot(
            `"The roots must be directories but got a directory and a file."`
        );

        const options3 = {
            actual: {
                size: 1,
            },
            expected: {
                size: 2,
            },
        };
        expect(() => compareDirectoryTrees(options3)).toThrowErrorMatchingInlineSnapshot(
            `"The roots must be directories but got a file and a file."`
        );
    });

    it('should throw if node types are different', () => {
        const options1 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        files: {},
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options1)).toThrowErrorMatchingInlineSnapshot(
            `"Nodes at './foo' have different types: a file and a directory."`
        );

        const options2 = {
            actual: {
                files: {
                    foo: {
                        files: {},
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 1,
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options2)).toThrowErrorMatchingInlineSnapshot(
            `"Nodes at './foo' have different types: a directory and a file."`
        );

        const options3 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                files: {},
                            },
                        },
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options3)).toThrowErrorMatchingInlineSnapshot(
            `"Nodes at './bar/baz' have different types: a directory and a file."`
        );
    });

    it('should throw if files have different sizes', () => {
        const options1 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 11,
                            },
                        },
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 2,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 11,
                            },
                        },
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options1)).toThrowErrorMatchingInlineSnapshot(
            `"Files at './foo' have different size: 1 and 2."`
        );

        const options2 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 11,
                            },
                        },
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options2)).toThrowErrorMatchingInlineSnapshot(
            `"Files at './bar/baz' have different size: 11 and 12."`
        );
    });

    it('should throw if directory contents are different', () => {
        const options1 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        size: 11,
                    },
                    baz: {
                        size: 21,
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        size: 11,
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options1)).toThrowErrorMatchingInlineSnapshot(
            `"Directories at ./ are different: expected directory doesn't have a node 'baz'."`
        );

        const options2 = {
            actual: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 11,
                            },
                        },
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        size: 1,
                    },
                    bar: {
                        files: {
                            baz: {
                                size: 11,
                            },
                            qux: {
                                size: 21,
                            },
                        },
                    },
                },
            },
        };
        expect(() => compareDirectoryTrees(options2)).toThrowErrorMatchingInlineSnapshot(
            `"Directories at ./bar are different: actual directory doesn't have node(s) 'qux'."`
        );
    });

    it('should return null if trees are the same', () => {
        const options1 = {
            actual: {
                files: {
                    foo: {
                        files: {
                            bar: {
                                size: 1,
                            },
                            baz: {
                                files: {
                                    qux: {
                                        size: 2,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            expected: {
                files: {
                    foo: {
                        files: {
                            bar: {size: 1},
                            baz: {
                                files: {
                                    qux: {
                                        size: 2,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        expect(compareDirectoryTrees(options1)).toBeNull();
    });
});

describe('getDirectoryTree()', () => {
    it('should read dir from `diff`', async () => {
        const fixturePath = getFixture('diff');
        const structure = getDirectoryTree(fixturePath);
        expect(structure).toMatchSnapshot();
    });

    it('should read dir from `encodings`', async () => {
        const fixturePath = getFixture('encodings');
        const structure = getDirectoryTree(fixturePath);
        expect(structure).toMatchSnapshot();
    });

    it('should read dir from `fixture-1`', async () => {
        const fixturePath = getFixture('fixture-1');
        const structure = getDirectoryTree(fixturePath);
        expect(structure).toMatchSnapshot();
    });
});
