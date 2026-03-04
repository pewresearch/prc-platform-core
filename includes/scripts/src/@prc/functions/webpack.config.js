const defaultConfig = require('../../../../../../../packages');

module.exports = {
	...defaultConfig,
	context: __dirname,
	entry: { index: './exports.js' },
	output: {
		...defaultConfig.output,
		path: __dirname + '/../../../build/@prc/functions',
		library: { name: 'prcFunctions', type: 'window' },
	},
};
