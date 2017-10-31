const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// UNCOMMENT TO RUN
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => ({
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: env.NODE_ENV === 'production' ? 'source-map' : 'cheap-eval-source-map',
  entry: './src/index.jsx',
  output: {
    filename: env.NODE_ENV === 'production' ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnWarning: true,
          failOnError: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    }),
    new UglifyJSPlugin({ sourceMap: true }),
    new ExtractTextPlugin('styles.[contenthash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new CleanWebpackPlugin(['build']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource !== undefined &&
        resource.indexOf('node_modules') !== -1
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      children: true,
      async: true,
      minChunks: ({ resource }) => (
        resource !== undefined &&
        resource.indexOf('node_modules') !== -1
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    // UNCOMMENT TO RUN
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin([
      { from: 'public/favicon.ico' },
    ]),
  ],
});