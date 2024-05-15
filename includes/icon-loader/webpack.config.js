/**
 * EXAMPLE EXTERNAL DEPENDENCY FILES
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
	...defaultConfig,
	devtool: 'source-map',
	plugins: [
		...defaultConfig.plugins.filter(
			(plugin) =>
				'DependencyExtractionWebpackPlugin' !== plugin.constructor.name,
		),
		new DependencyExtractionWebpackPlugin({
			injectPolyfill: true,
			// eslint-disable-next-line consistent-return
			requestToExternal(request) {
				/* My externals */
				if (request.includes('@prc/icons')) {
					return 'prcIcons';
				}
			},
			// eslint-disable-next-line consistent-return
			requestToHandle(request) {
				// Handle imports like `import myModule from 'my-module'`
				if ('@prc/icons' === request) {
					// `my-module` depends on the script with the 'my-module-script-handle' handle.
					return 'prc-icons';
				}
			},
		}),
	],
};
