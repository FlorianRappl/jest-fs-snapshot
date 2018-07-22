import fs from 'fs';
import path from 'path';
import filenamify from 'filenamify';
import {matcherHint, EXPECTED_COLOR, RECEIVED_COLOR} from 'jest-matcher-utils';
import {createAsarPackage} from './asar';
import {compareDirectoryToAsar} from './diff';

// eslint-disable-next-line import/prefer-default-export
export function matchFilesystemSnapshot({received, expected, context, name}) {
    const {testPath, currentTestName, isNot, snapshotState} = context;

    if (isNot) {
        throw new Error('Jest: `.not` cannot be used with `.toMatchFilesystemSnapshot()`.');
    }

    if (!snapshotState) {
        throw new Error('Jest: snapshot state must be initialized.');
    }

    const typeOfReceived = typeof received;
    if (typeOfReceived !== 'string') {
        throw new Error(`Jest: expected to receive a path to a directory but got ${typeOfReceived}.`);
    }

    const count = Number(snapshotState._counters.get(currentTestName) || 0);
    const testKey = `${path.basename(testPath)} ${currentTestName} ${count}`;
    const snapshotFilename = `${filenamify(testKey)}.snap.asar`;
    const snapshotsDir = path.resolve(testPath, '..', '__fs_snapshots__');

    const typeOfExpected = typeof expected;
    let expectedFullPath = expected;
    if (typeOfExpected === 'undefined') {
        expectedFullPath = path.resolve(snapshotsDir, snapshotFilename);
    } else if (typeOfExpected !== 'string') {
        throw new Error(`Jest: a matcher expected a path to a snapshot but got ${typeOfExpected}.`);
    }

    const receivedFullPath = path.resolve(received);
    if (!fs.existsSync(receivedFullPath)) {
        throw new Error(`Jest: expected path \`${received}\` doesn't exists.`);
    }

    const hasSnapshot = fs.existsSync(expectedFullPath);

    if (!hasSnapshot) {
        if (snapshotState._updateSnapshot === 'none') {
            return {
                name,
                pass: false,
                report: () =>
                    `New snapshot was ${RECEIVED_COLOR('not written')}. The update flag ` +
                    `must be explicitly passed to write a new snapshot.\n\n` +
                    `This is likely because this test is run in a continuous integration ` +
                    `(CI) environment in which snapshots are not written by default.`,
            };
        }

        createAsarPackage(receivedFullPath, expectedFullPath, {exclude: /node_modules/});

        snapshotState.added += 1;

        return {
            name,
            pass: true,
            message: () => '',
        };
    }

    const diffMessage = compareDirectoryToAsar(receivedFullPath, expectedFullPath, {
        exclude: /node_modules/,
        aAnnotation: 'Snapshot',
        bAnnotation: 'Received',
        expand: snapshotState.expand,
    });

    if (!diffMessage) {
        snapshotState.matched += 1;
        snapshotState._uncheckedKeys.delete(snapshotFilename);

        return {
            name,
            pass: true,
            message: () => '',
        };
    }

    if (snapshotState._updateSnapshot === 'all') {
        createAsarPackage(receivedFullPath, expectedFullPath, {exclude: /node_modules/});

        snapshotState.updated += 1;
        snapshotState._uncheckedKeys.delete(snapshotFilename);

        return {
            name,
            pass: true,
            message: () => '',
        };
    }

    snapshotState.unmatched += 1;
    snapshotState._uncheckedKeys.delete(snapshotFilename);

    const report = () =>
        `${RECEIVED_COLOR('Received value')} does not match ${EXPECTED_COLOR(
            `stored snapshot${diffMessage.pathToNode ? ` at ${diffMessage.pathToNode}` : ''}`
        )}.\n\n ${diffMessage.message}`;

    return {
        name,
        pass: false,
        message: () => `${matcherHint(`.${name}`, 'value', '')}\n\n${report()}`,
        report,
    };
}
