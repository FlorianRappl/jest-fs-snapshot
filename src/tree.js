import path from 'path';
import fs from 'fs';

export function getDirectoryTree(src, options = {}) {
    const stats = fs.lstatSync(src);

    if (options.callback) {
        options.callback(path.resolve(src), stats);
    }

    if (stats.isDirectory()) {
        const files = fs.readdirSync(src).reduce((res, child) => {
            if (!(options.exclude && options.exclude.test(child))) {
                res[child] = getDirectoryTree(path.resolve(src, child), options);
            }
            return res;
        }, {});

        return {files};
    }

    if (stats.isFile()) {
        return {
            size: stats.size,
        };
    }

    return {};
}

function getNodeType(node, pathToNode) {
    if (typeof node === 'object') {
        if (typeof node.files === 'object') return 'directory';
        if (typeof node.size === 'number') return 'file';
        if (typeof node.link === 'string') return 'symlink';
    }
    throw new Error(`Unknown node type '${JSON.stringify(node)}' at ${pathToNode}.`);
}

const ROOT = './';

export function compareDirectoryTrees({actual, expected, pathToNode = ROOT, onFile}) {
    const actualType = getNodeType(actual, pathToNode);
    const expectedType = getNodeType(expected, pathToNode);

    if (pathToNode === ROOT && (actualType !== 'directory' || expectedType !== 'directory')) {
        throw new Error(`The roots must be directories but got a ${actualType} and a ${expectedType}.`);
    }

    if (actualType !== expectedType) {
        throw new Error(`Nodes at '${pathToNode}' have different types: a ${actualType} and a ${expectedType}.`);
    }

    if (actualType === 'file') {
        if (onFile) {
            onFile({actual, expected, pathToNode});
            return null;
        }

        if (actual.size !== expected.size) {
            throw new Error(`Files at '${pathToNode}' have different size: ${actual.size} and ${expected.size}.`);
        }
    }

    if (actualType === 'directory') {
        const actualKeys = Object.keys(actual.files);
        const expectedKeys = Object.keys(expected.files);

        for (let i = 0, l = actualKeys.length; i < l; i++) {
            const key = actualKeys[i];
            const bKeyIndex = expectedKeys.indexOf(key);
            if (bKeyIndex === -1) {
                throw new Error(
                    `Directories at ${pathToNode} are different: expected directory doesn't have a node '${key}'.`
                );
            }
            expectedKeys.splice(bKeyIndex, 1);
        }

        if (expectedKeys.length > 0) {
            throw new Error(
                `Directories at ${pathToNode} are different: actual directory doesn't have node(s) '${expectedKeys.join(
                    "', '"
                )}'.`
            );
        }

        actualKeys.forEach(key => {
            compareDirectoryTrees({
                actual: actual.files[key],
                expected: expected.files[key],
                pathToNode: pathToNode + (pathToNode !== ROOT ? '/' : '') + key,
                onFile,
            });
        });
    }

    return null;
}
