import {matchFilesystemSnapshot} from './snapshot';

// eslint-disable-next-line import/prefer-default-export
export function toMatchFilesystemSnapshot(received, expected, options = {}) {
    return matchFilesystemSnapshot({received, expected, context: this, name: 'toMatchFilesystemSnapshot', options});
}
