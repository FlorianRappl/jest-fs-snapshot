import path from 'path';
import fs from 'fs-extra';
import {createAsarPackage, getAsarTree} from '../src/asar';
import {getDirectoryTree, compareDirectoryTrees} from '../src/tree';
import {getFixture} from '../__test-helpers__/util';

const tmpPath = path.resolve(__dirname, '.temp');

beforeAll(async () => {
    await fs.ensureDir(tmpPath);
});

afterAll(async () => {
    await fs.remove(tmpPath);
});

describe('createAsarPackage()', () => {
    it('should pack files from `fixture-1`', async () => {
        const fixturePath = getFixture('fixture-1');
        const pathToAsar = path.join(tmpPath, './fixture-1.asar');

        await createAsarPackage(fixturePath, pathToAsar);

        const expected = getAsarTree(pathToAsar);
        expect(expected).toMatchSnapshot();

        const actual = getDirectoryTree(fixturePath);
        expect(compareDirectoryTrees({actual, expected})).toBeNull();
    });

    it('should exclude files from `fixture-1`', async () => {
        const fixturePath = getFixture('fixture-1');
        const pathToAsar = path.join(tmpPath, './fixture-1.asar');

        await createAsarPackage(fixturePath, pathToAsar, {exclude: /tmp/});

        const expected = getAsarTree(pathToAsar);
        expect(expected).toMatchSnapshot();

        const actual = getDirectoryTree(fixturePath, {exclude: /tmp/});
        expect(compareDirectoryTrees({actual, expected})).toBeNull();
    });
});
