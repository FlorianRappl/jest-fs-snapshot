import path from 'path';
import fs from 'fs-extra';
import {getBufferEncoding, compareBuffers, NO_DIFF_MESSAGE} from '../src/diff';
import {getFixture} from '../__test-helpers__/util';

describe('getBufferEncoding()', () => {
    const encodingsFixtures = getFixture('encodings');

    it('should decode utf8.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf8.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf8');
    });

    it('should decode utf8_bom.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf8_bom.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf8');
    });

    it('should decode utf8_emojis.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf8_emojis.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf8');
    });

    it('should decode utf8_shishi.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf8_shishi.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf8');
    });

    it('should decode utf8_not-cp949.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf8_not-cp949.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf8');
    });

    it('should decode utf16-be.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf16-be.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf16-be');
    });

    it('should decode utf16-be_bom.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf16-be_bom.txt'));

        expect(getBufferEncoding(buf)).toEqual('utf16-be');
    });

    it('should decode utf16-le_bom.txt', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'utf16-le_bom.txt'));
        expect(getBufferEncoding(buf)).toEqual('utf16');
    });

    it('should detect ansi.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'ansi.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect big5.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'big5.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect big5_B.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'big5_B.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect cp936_with-bad-chars.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'cp936_with-bad-chars.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect euc_jp.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'euc_jp.txt'));

        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect euc_tw.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'euc_tw.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect euc_tw_B.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'euc_tw_B.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect gb.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'gb.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect gb2.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'gb2.txt'));

        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect kr.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'kr.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect latin.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'latin.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });

    it('should detect sjis.txt as binary', async () => {
        const buf = await fs.readFile(path.join(encodingsFixtures, 'sjis.txt'));
        expect(getBufferEncoding(buf)).toEqual('binary');
    });
});

describe('compareBuffers()', () => {
    const encodingsFixtures = getFixture('encodings');
    const diffFixtures = getFixture('diff');

    it('should return an error if binary files are different', async () => {
        const buf1 = await fs.readFile(path.join(encodingsFixtures, 'ansi.txt'));
        const buf2 = await fs.readFile(path.join(encodingsFixtures, 'big5.txt'));
        expect(compareBuffers(buf1, buf2)).toMatchInlineSnapshot(`"Comparing different binary files."`);
    });

    it('should return ok if binary files are the same', async () => {
        const buf1 = await fs.readFile(path.join(encodingsFixtures, 'ansi.txt'));
        const buf2 = await fs.readFile(path.join(encodingsFixtures, 'ansi.txt'));
        expect(compareBuffers(buf1, buf2)).toBe(NO_DIFF_MESSAGE);
    });

    it('should return an error if encodings are different', async () => {
        const buf1 = await fs.readFile(path.join(encodingsFixtures, 'ansi.txt'));
        const buf2 = await fs.readFile(path.join(encodingsFixtures, 'utf8.txt'));
        expect(compareBuffers(buf1, buf2)).toMatchInlineSnapshot(
            `" Comparing files with different encodings. Expected [32mutf8[39m but received [31mbinary[39m."`
        );

        const buf3 = await fs.readFile(path.join(encodingsFixtures, 'utf8.txt'));
        const buf4 = await fs.readFile(path.join(encodingsFixtures, 'utf16-be.txt'));
        expect(compareBuffers(buf3, buf4)).toMatchInlineSnapshot(
            `" Comparing files with different encodings. Expected [32mutf16-be[39m but received [31mutf8[39m."`
        );
    });

    it('should return no changes for the same file', async () => {
        const buf1 = await fs.readFile(path.join(diffFixtures, 'lorem-ipsum-1.txt'));
        const buf2 = await fs.readFile(path.join(diffFixtures, 'lorem-ipsum-1.txt'));
        expect(compareBuffers(buf1, buf2)).toBe(NO_DIFF_MESSAGE);
    });

    it('should return a diff for lorem-ipsum files', async () => {
        const buf1 = await fs.readFile(path.join(diffFixtures, 'lorem-ipsum-1.txt'));
        const buf2 = await fs.readFile(path.join(diffFixtures, 'lorem-ipsum-2.txt'));
        expect(compareBuffers(buf1, buf2)).toMatchSnapshot();
    });

    it('should return a diff for emoji files', async () => {
        const buf1 = await fs.readFile(path.join(diffFixtures, 'emoji-1.txt'));
        const buf2 = await fs.readFile(path.join(diffFixtures, 'emoji-2.txt'));
        expect(compareBuffers(buf1, buf2)).toMatchSnapshot();
    });
});
