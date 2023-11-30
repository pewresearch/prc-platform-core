/**
 * External Dependencies
 */
const { join } = require('path');

module.exports = {
	defaultValues: {
		namespace: 'prc-platform',
		author: 'Pew Research Center',
		pluginURI: `https://github.com/pewresearch/pewresearch-org/blob/main/plugins/prc-platform-core/includes/facets/`,
		attributes: {
			allowedBlocks: {
				type: 'array',
			},
			orientation: {
				type: 'string',
				default: 'vertical',
			}
		},
		supports: {
			anchor: true,
			html: false,
			spacing: {
				blockGap: true,
				margin: ['top', 'bottom'],
				padding: true,
				__experimentalDefaultControls: {
					padding: true,
				},
			},
			typography: {
				fontSize: true,
				__experimentalFontFamily: true,
				__experimentalDefaultControls: {
					fontSize: true,
					__experimentalFontFamily: true,
				},
			},
			interactivity: true,
		},
		render: 'file:./render.php',
		viewScript: 'file:./view.js',
	},
	pluginTemplatesPath: join(__dirname, 'plugin-templates'),
	blockTemplatesPath: join(__dirname, 'block-templates'),
	assetsPath: join(__dirname, 'assets'),
};
