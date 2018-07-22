const {toMatchFilesystemSnapshot} = require('../dist/jest-fs-snapshot.cjs');

describe('import-bundle-cjs', () => {
    it('should export properly', () => {
        expect(typeof toMatchFilesystemSnapshot).toBe('function');
    });
});
