import {matchFilesystemSnapshot} from './snapshot';

// eslint-disable-next-line import/prefer-default-export
export function toMatchFilesystemSnapshot(received, expected) {
    return matchFilesystemSnapshot({received, expected, context: this, name: 'toMatchFilesystemSnapshot'});
}
