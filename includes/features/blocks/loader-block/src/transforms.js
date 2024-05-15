/**
 * WordPress Dependencies
 */
import { createBlock } from '@wordpress/blocks';

const BLOCKNAME = 'prc-platform/feature-loader';

function convertLegacyLoader({ id, appName, path, deps, version }) {
	return createBlock(BLOCKNAME, {
		slug: id,
		legacyWpackIo: {
			appName,
			path,
			deps,
		},
	});
}

function convertAssetsS3Interactive({ id, path, react, libraries, styles }) {
	return createBlock(BLOCKNAME, {
		slug: id,
		legacyAssetsS3: {
			path,
			react,
			libraries,
			styles,
		},
	});
}

function converTextRaw(text) {
	console.log('converTextRaw()', text);
	const isLoadInteractive = null !== text.match(/\[load_interactive/);
	const isJsInteractive = null !== text.match(/\[js_interactive/);

	const id = text.match(/id="([^"]+)"/);
	const appName = text.match(/appName="([^"]+)"/);
	const path = text.match(/path="([^"]+)"/);
	const deps = text.match(/deps="([^"]+)"/);
	const version = text.match(/version="([^"]+)"/);
	const react = text.match(/react="([^"]+)"/);
	const libraries = text.match(/libraries="([^"]+)"/);
	const styles = text.match(/styles="([^"]+)"/);

	console.log('isLoadInteractive', isLoadInteractive);
	console.log('isJsInteractive', isJsInteractive);
	console.log(text);

	if (isLoadInteractive) {
		return convertLegacyLoader({
			id: null !== id ? id[1] : null,
			appName: null !== appName ? appName[1] : null,
			path: null !== path ? path[1] : null,
			deps: null !== deps ? deps[1] : '',
			version: null !== version ? version[1] : null,
		});
	}

	if (isJsInteractive) {
		return convertAssetsS3Interactive({
			id: null !== id ? id[1] : null,
			path: null !== path ? path[1] : null,
			react: null !== react ? react[1] : null,
			libraries: null !== libraries ? libraries[1] : null,
			styles: null !== styles ? styles[1] : null,
		});
	}
}

const transforms = {
	from: [
		{
			type: 'shortcode',
			tag: 'load_interactive',
			transform({ named: { id, appName, path, deps, version } }) {
				console.log('name', named);
				return convertLegacyLoader({
					id,
					appName,
					path,
					deps,
					version,
				});
			},
			isMatch({ named: { id, appName, path } }) {
				return !!id && !!appName && !!path;
			},
		},
		{
			type: 'shortcode',
			tag: 'js_interactive',
			transform({ named: { id, path, libraries, styles, react } }) {
				console.log('name', named);
				return convertAssetsS3Interactive({
					id,
					path,
					react,
					libraries,
					styles,
				});
			},
			isMatch({ named: { path, react } }) {
				return path, react;
			},
		},
		{
			type: 'block',
			blocks: ['core/shortcode'],
			transform: ({ text }) => {
				return converTextRaw(text);
			},
		},
		{
			type: 'block',
			blocks: ['core/html'],
			transform: ({ content }) => {
				return converTextRaw(content);
			},
		},
	],
};

export default transforms;
