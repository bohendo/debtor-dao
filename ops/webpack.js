const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
const isDev = ENV === 'development';

const basePath = process.cwd();
console.log(`basePath: ${basePath} eg ${path.resolve(basePath, 'src/actions')}`);

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

module.exports = {

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      actions: path.resolve(basePath, 'src/actions'),
      components: path.resolve(basePath, 'src/components'),
      constants: path.resolve(basePath, 'src/constants'),
      layouts: path.resolve(basePath, 'src/layouts'),
      lib: path.resolve(basePath, 'src/lib'),
      reducers: path.resolve(basePath, 'src/reducers'),
      selectors: path.resolve(basePath, 'src/selectors'),
      schemas: path.resolve(basePath, 'src/schemas'),
      src: path.resolve(basePath, 'src')
    },
  },

  entry: [
    // the entry point of our app
    path.resolve(basePath, 'src/index.tsx'),
  ],

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'build'),
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [/node_modules/]
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: [ "awesome-typescript-loader" ],
        exclude: [/node_modules/]
      },

      // CSS handling
      {
        test: /\.css$/,
        include: /client/,
        use: [
          'style-loader',
          { // translates CSS into CommonJS (css-loader) and automatically generates TypeScript types
            loader: 'typings-for-css-modules-loader',
            options: {
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              minimize: isProd,
              modules: true,
              namedExport: true,
              sourceMap: true
            }
          },
        ],
      },

      // Images & fonts
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 10000 // For assets smaller than 10k inline them as data urls, otherwise use regular file loader
        }
      },

      {
        test: /\.scss$/,
        use: [
          { // creates style nodes from JS strings
            loader: "style-loader"
          },
          { // translates CSS into CommonJS (css-loader) and automatically generates TypeScript types
            loader: 'typings-for-css-modules-loader',
            options: {
              camelCase: true,
              modules: true,
              namedExport: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 2,
              sourceMap: true
            }
          },
          { // compiles Sass to CSS
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },
          { // Load global scss files in every other scss file without an @import needed
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/assets/styles/global-variables.scss']
            },
          },
        ]
      }

    ],
  },

  plugins: [
    // do not emit compiled assets that include errors
    // new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    // Prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'S3_BUCKET': JSON.stringify(process.env.S3_BUCKET || "daostack-alchemy"),
        'API_URL': JSON.stringify(process.env.API_URL || "http://127.0.0.1:3001"),
        'BASE_URL': JSON.stringify(process.env.BASE_URL || "http://localhost:3000")
      }
    })
  ],

};
