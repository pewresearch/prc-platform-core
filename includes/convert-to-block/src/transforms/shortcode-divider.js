/* eslint-disable max-len */
/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { rawHandler } from '@wordpress/blocks';

const BLOCKNAME = 'core/paragraph';
const BLOCKIDENTIFIER = 'prc-block/convert-to-block-tweetable';

function doTransform(shortcode) {
	const {content} = shortcode;
	return rawHandler({HTML: content});
}

export default function registerTransform() {
	/**
	 * Add support for left and right alignment, and add transform support from prc-block/callout to group.
	 *
	 * @param {Object} settings Settings for the block.
	 *
	 * @return {Object} settings Modified settings.
	 */
	addFilter('blocks.registerBlockType', BLOCKIDENTIFIER, (settings) => {
		if (BLOCKNAME !== settings.name) {
			return settings;
		}
		if ('undefined' !== typeof settings.transforms) {
			if ('undefined' !== typeof settings.transforms.from) {
				const newTransform = {
					type: 'shortcode',
					tag: 'divider',
					transform({}, {shortcode}) {
						return doTransform(shortcode)[0];
					}
				};
				settings.transforms.from.push(newTransform);
				settings.transforms.from.push({...newTransform, tag: 'line_divider'});
			}
		}

		return settings;
	});
}
