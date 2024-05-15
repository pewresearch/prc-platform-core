/**
 * WordPress Dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */

store('prc-platform/block-area', {
	callbacks: {
		onHidden: () => {
			const context = getContext();
			const { blockAreaSlug, isPaged } = context;
			if (isPaged && !blockAreaSlug.includes('menu')) {
				return true;
			}
			return false;
		},
	},
});
