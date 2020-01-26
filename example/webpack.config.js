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
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        compress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Moore',
            template: resolve(__dirname, './template.html'),
        }),
    ],
};
