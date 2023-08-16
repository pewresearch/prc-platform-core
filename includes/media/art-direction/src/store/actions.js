/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import shapeImg from './helpers';

const actions = {
	initStore(items) {
		return {
			type: 'INIT_STORE',
			items,
		};
	},
	resetStore() {
		const { editPost } = dispatch('core/editor');
		// Reset the featured image if we're resetting the art store.
		editPost({ featured_media: 0 });
		return {
			type: 'RESET_STORE',
		};
	},
	/**
	 * Adds a new image into the art data store.
	 *
	 * @param {*} imgData
	 * @param {*} size
	 * @return
	 */
	storeImage(imgData, size) {
		// If this is the A1 size then also set the featured image for fallback data
		if ('A1' === size) {
			const { editPost } = dispatch('core/editor');
			editPost({ featured_media: shapeImg(imgData, size).id });
		}
		return {
			type: 'STORE_IMAGE',
			imgData,
			size,
		};
	},
	toggleChartArt(size) {
		return {
			type: 'TOGGLE_CHART_ART',
			size,
		};
	},
};

export default actions;
