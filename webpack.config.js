module.exports = {
    cache: true,
    entry: './static/src/app.js',
    output: {
        filename: './static/build/main.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        },
        ]
    }
};
