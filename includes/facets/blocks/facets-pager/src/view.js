/* eslint-disable camelcase */
/**
 * WordPress Dependencies
 */
import { store, getElement } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';

const createPagerText = (pager) => {
	const { page, per_page, total_pages, total_rows } = pager;
	// return something like "Displaying 1 - 10 of 100"
	let start;
	let end;

	// if there is only one page, show all results, end is total_rows
	if (total_pages === 1) {
		start = 1;
		end = total_rows;
	} else {
		// otherwise, show the range of results on the current page
		// if page is less than or equal to 1, start is 1, else calculate start
		start = page <= 1 ? 1 : page * per_page + 1;
		// if page is less than or equal to 1, end is per_page (eg. 10),
		// else calculate end (eg. page on 2 -> 2 * 10 + 10 = 30)
		end = page <= 1 ? per_page : page * per_page + per_page;
	}
	const message = `Displaying ${start} - ${end} of ${total_rows} results`;
	return message;
};

const { state } = store('prc-platform/facets-pager', {
	state: {
		get targetStore() {
			const targetStore = store(targetNamespace);
			if (!targetStore.state) {
				return false;
			}
			return targetStore;
		},
		get pagerText() {
			const { targetStore } = state;
			const { pager } = targetStore.state.data;
			return createPagerText(pager);
		},
	},
});
