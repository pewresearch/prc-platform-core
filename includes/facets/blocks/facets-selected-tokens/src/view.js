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
	const start = page <= 1 ? 1 : ( page * per_page ) + 1;
	const end = page <= 1 ? per_page : ( page * per_page ) + per_page;
	return `Displaying ${start} - ${end} of ${total_rows} results`;
};

const { state } = store('prc-platform/facets-selected-tokens', {
	state: {
		tokens: [],
	},
	actions: {
		onTokenClick: () => {
			const { ref, props } = getElement();
			console.log('onTokenClick', ref, props);
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}

			const facetSlug = ref.getAttribute('data-facet-slug');
			targetStore.actions.onClear(facetSlug);
		},
		onReset: () => {
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}
			targetStore.actions.onClear();
		},
	},
	callbacks: {
		hasTokens: () => {
			if (state.tokens.length) {
				return true;
			}
			return false;
		},
		updateTokens: () => {
			const targetStore = store(targetNamespace);
			if (!targetStore.state) {
				return;
			}
			const { pager } = targetStore.state.data;

			state.pagerText = createPagerText(pager);

			const selected = targetStore.state.getSelected;
			// map selected onto tokens...
			const tokens = Object.keys(selected).map((slug) => {
				const values = selected[slug];
				return {
					slug,
					label: values.join(', '),
				};
			});
			state.tokens = tokens;
		},
	},
});
