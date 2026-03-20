/**
 * External Dependencies
 */
const { join } = require('path');

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
		path: join(__dirname, 'build'),
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
		new DependencyExtractionWebpackPlugin({
			requestToExternalModule: () => null,
		}),
	],
	watchOptions: {
		ignored: ['**/node_modules'],
		aggregateTimeout: 500,
	},
};
