import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
    input: './src/index.js',
    plugins: [babel()],
    external: Object.keys(pkg.dependencies).concat('fs', 'path', 'asar/lib/disk', 'jest-diff/build/constants'),
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
    ],
};
