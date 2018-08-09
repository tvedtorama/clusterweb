const path = require('path');
const webpack = require('webpack');

const commons = require("./webpack_common")

module.exports = env => ({
  devtool: false,
  entry: {
    index: [
      './app/index.tsx'
    ],
    vendor: commons.vendorLibList,
  },
  mode: "production",
  output: commons.output,
  optimization: {
    splitChunks: commons.splitChunks,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|nb)$/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
  resolve: commons.resolve,
  module: {
    rules: commons.rules,
  },
});
