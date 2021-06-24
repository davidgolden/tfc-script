const path = require('path');

module.exports = {
    entry: "./src/App.js",
    output: {
        publicPath: './dist/',
        filename: "tfc-signup.js",
        path: path.resolve(__dirname, 'dist')
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                loader: "babel-loader",
            },
        ]
    },
};
