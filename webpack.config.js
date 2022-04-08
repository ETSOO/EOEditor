const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'eoeditor.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    devServer: {
        watchFiles: ['src/**/*', 'public/**/*'],
        static: {
            directory: path.join(__dirname, 'public')
        },
        hot: true,
        compress: true,
        open: {
            target: ['index.html']
        },
        port: 9000
    }
};
