const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: {
    index: ['babel-polyfill', './src/index.js']
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../build/public/js")
  },

  resolve: {
    extensions: ['.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['env','react'],
            },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },

};
