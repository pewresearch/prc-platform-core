const defaultConfig = require('../../../../../../../packages');

module.exports = {
	...defaultConfig,
	context: __dirname,
	entry: { index: './exports.js' },
	output: {
		...defaultConfig.output,
		path: __dirname + '/../../../build/@prc/components',
		library: { name: 'prcComponents', type: 'window' },
	},
};
