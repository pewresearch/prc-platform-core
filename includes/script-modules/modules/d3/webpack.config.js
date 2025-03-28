/**
 * External Dependencies
 */
const { join } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

/**
 * WordPress Dependencies
 */
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

/**
 * Internal Dependencies
 */
// @TODO Change out baseConfig and plugins to reference the package directly instead of copying the code over manually.
const webpackConfig = require('@wordpress/scripts/config/webpack.config');
const { baseConfig, plugins } = require('./webpack.shared');

module.exports = {
	...baseConfig,
	entry: {
		module: './src/index.js',
	},
	experiments: {
		outputModule: true,
	},
	output: {
		filename: (pathData) => {
			return './[name].min.js';
		},
		library: {
			type: 'module',
		},
		path: join(__dirname, '..', '..'),
		environment: { module: true },
		module: true,
		chunkFormat: 'module',
		asyncChunks: false,
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		mainFields: ['module'],
	},
	module: {
		rules: [
			{
				test: /\.(j|t)sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: require.resolve('babel-loader'),
						options: {
							cacheDirectory:
								process.env.BABEL_CACHE_DIRECTORY || true,
							babelrc: false,
							configFile: false,
							presets: [
								'@babel/preset-typescript',
								'@babel/preset-react',
							],
						},
					},
				],
			},
		],
	},
	plugins: [
		...plugins,
		// WordPress Interactivity API uses Preact, not React; so here we're providing
		// Preact instead of React through a preact/compat alias.
		new webpack.ProvidePlugin({
			React: 'preact/compat',
			react: 'preact/compat',
			'react-dom': 'preact/compat',
		}),
		// TODO: Move it to a different Webpack file.
		new CopyWebpackPlugin({
			patterns: [
				{
					from: './node_modules/es-module-shims/dist/es-module-shims.wasm.js',
					to: './importmap-polyfill.min.js',
				},
			],
		}),
		new DependencyExtractionWebpackPlugin({
			requestToExternalModule: (request) => {
				return null; // Do not externalize any dependencies, bundle them.
			},
		}),
	],
	watchOptions: {
		ignored: ['**/node_modules'],
		aggregateTimeout: 500,
	},
};
