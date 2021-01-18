import path from 'path';
import fs from 'fs';
import isValidUTF8 from 'utf-8-validate';
import iconv from 'iconv-lite';
import diff from 'jest-diff';
import {NO_DIFF_MESSAGE} from 'jest-diff/build/constants';
import {EXPECTED_COLOR, RECEIVED_COLOR} from 'jest-matcher-utils';
import asarDisk from 'asar/lib/disk';
import {getDirectoryTree, compareDirectoryTrees} from './tree';
import {getAsarTree} from './asar';

export function getBufferEncoding(buffer) {
    const size = buffer.length;
    if (size === 0) {
        return 'utf8';
    }

    // UTF-8 BOM
    if (size >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
        return 'utf8';
    }

    // UTF-16 BE BOM
    if (size >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
        return 'utf16-be';
    }

    // UTF-16 LE BOM
    if (size >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
        return 'utf16';
    }

    if (isValidUTF8(buffer)) {
        return 'utf8';
    }

    return 'binary';
}

export function compareBuffers(actualBuf, expectedBuf) {
    const actualEncoding = getBufferEncoding(actualBuf);
    const expectedEncoding = getBufferEncoding(expectedBuf);

    if (actualEncoding !== expectedEncoding) {
        return (
            ` Comparing files with different encodings. Expected ${EXPECTED_COLOR(expectedEncoding)}` +
            ` but received ${RECEIVED_COLOR(actualEncoding)}.`
        );
    }

    if (actualEncoding === 'binary') {
        return Buffer.compare(actualBuf, expectedBuf) === 0 ? NO_DIFF_MESSAGE : 'Comparing different binary files.';
    }

    const actualText = iconv.decode(actualBuf, actualEncoding);
    const expectedText = iconv.decode(expectedBuf, expectedEncoding);

    return diff(actualText, expectedText);
}

export function compareDirectoryToAsar(actualPath, expectedPath, options) {
    try {
        const actualTree = getDirectoryTree(actualPath, options);
        const expectedTree = getAsarTree(expectedPath);

        const asarFilesystem = asarDisk.readFilesystemSync(expectedPath);

        compareDirectoryTrees({
            actual: actualTree,
            expected: expectedTree,
            onFile({pathToNode}) {
                if (path.sep === '\\') {
                    // eslint-disable-next-line no-param-reassign
                    pathToNode = pathToNode.replace(/[/]/g, '\\');
                }

                const thisPath = path.resolve(actualPath, pathToNode);
                const actual = fs.readFileSync(thisPath);
                const expected = asarDisk.readFileSync(asarFilesystem, pathToNode, asarFilesystem.getFile(pathToNode));

                let compareFunc = compareBuffers;

                if (options.customCompare) {
                    const match = options.customCompare.filter(({check}) => check(thisPath))[0];
                    if (match) compareFunc = match.compare || compareFunc;
                }

                const res = compareFunc(actual, expected);

                if (res !== NO_DIFF_MESSAGE) {
                    const error = new Error(res);
                    error.pathToNode = pathToNode;
                    throw error;
                }
            },
        });
    } catch (error) {
        return error;
    }

    return null;
}

export {NO_DIFF_MESSAGE};
