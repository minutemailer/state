module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: 'cjs',
                useBuiltIns: "usage",
                corejs: 3,
                targets: {
                    browsers: ['> 2%, IE 11, not dead'],
                },
            },
        ],
    ],
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ],
};
