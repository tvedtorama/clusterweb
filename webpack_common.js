var path = require('path');
var webpack = require('webpack');

// Note: webpack has its own common / merge system.  This is not used here.

module.exports = {
	vendorLibList: ['react', 'react-dom', 'react-redux', 'redux', 'redux-saga', 'redux-observable', 'lodash', 'react-router'],
	output: {
		library: "app",
		path: path.join(__dirname, 'dist'),
		filename: '[name]_bundle.js',
		publicPath: '/static/'
	},	
	resolve: {
		modules: [path.resolve(__dirname, "app"), "node_modules"],
		extensions: ['.jsx', '.js', '.tsx', '.ts']
	  },	
	splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all'
            }
        }
    },
	rules: [{
		test: /\.tsx?$/,
		use: 'awesome-typescript-loader?configFileName=tsconfig_webpack.json&silent=true',
	  },
	  {
		// It would be nice to extract the styles (using the extract text plugin), but that would loose hot module replacement
		test: /\.s?css$/,
		use: ["style-loader", "css-loader", "sass-loader"]
	  },
	]
}