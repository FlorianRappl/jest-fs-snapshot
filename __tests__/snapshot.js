import {toMatchFilesystemSnapshot} from '../src/index';
import {getFixture} from '../__test-helpers__/util';

expect.extend({toMatchFilesystemSnapshot});

describe('matchFilesystemSnapshot()', () => {
    it('should match `fixture-1` snapshot', async () => {
        const fixturePath = getFixture('fixture-1');
        expect(fixturePath).toMatchFilesystemSnapshot();
    });

    it('should match `diff` snapshot', async () => {
        const fixturePath = getFixture('diff');
        expect(fixturePath).toMatchFilesystemSnapshot();
    });

    it('should match `encodings` snapshot', async () => {
        const fixturePath = getFixture('encodings');
        expect(fixturePath).toMatchFilesystemSnapshot();
    });
});
