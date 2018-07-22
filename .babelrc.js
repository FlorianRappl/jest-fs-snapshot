const env = process.env.BABEL_ENV || process.env.NODE_ENV;

const presets = [];
const plugins = [];

if (env === 'test') {
    presets.unshift([
        '@babel/preset-env',
        {
            targets: {node: 'current'},
        },
    ]);
}

if (env === 'production') {
    presets.unshift([
        '@babel/preset-env',
        {
            targets: {node: '6.6'},
            modules: false,
            loose: true,
        },
    ]);
}

module.exports = {presets, plugins};
