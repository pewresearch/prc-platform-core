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

const { state } = store('prc-platform/facets-selected-tokens', {
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
		get tokens() {
			const targetStore = store(targetNamespace);
			if (!targetStore.state) {
				return;
			}
			const selected = targetStore.state.getSelected;
			if (!selected) {
				return [];
			}
			const tokens = Object.keys(selected).flatMap((slug) => {
				const values = selected[slug];
				return values.map((value) => ({
					slug,
					value,
					label: value
						.replace(/-/g, ' ')
						.replace(/\b\w/g, (char) => char.toUpperCase()),
				}));
			});
			console.log('get tokens:::', tokens);
			return tokens;
		},
	},
	actions: {
		getSelectedTokens: () => {
			return state.getSelectedFacets;
		},
		onTokenClick: () => {
			const { ref, props } = getElement();
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}
			console.log('onTokenClick', ref, props, targetStore);
			const facetSlug = ref.getAttribute('data-facet-slug');
			const facetValue = ref.getAttribute('data-facet-value');
			targetStore.actions.onClear(facetSlug, facetValue);
		},
		onReset: () => {
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}
			console.log('onReset', targetStore);
			// redirect back to this page but with no query args and if /page/x/ is in the url, remove it.
			window.location = window.location.href
				.split('?')[0]
				.replace(/\/page\/\d+\//, '/');
		},
	},
	callbacks: {
		hasTokens: () => {
			if (state.tokens.length) {
				return true;
			}
			return false;
		},
	},
});
