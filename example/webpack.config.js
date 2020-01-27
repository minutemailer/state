const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: resolve(__dirname),
    devtool: 'source-map',
    output: {
        path: join(__dirname, 'dist'),
        filename: 'index.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
    },
    devServer: {
        compress: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                        svgoConfig: {
                            plugins: {
                                convertColors: {
                                    currentColor: true,
                                },
                                addAttributesToSVGElement: {
                                    attributes: {
                                        fill: 'currentColor',
                                    },
                                },
                            },
                        },
                    },
                }],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Moore',
            template: resolve(__dirname, './template.html'),
        }),
    ],
};
