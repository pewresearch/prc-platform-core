/* eslint-disable camelcase */
/**
 * WordPress Dependencies
 */
import { store, getElement } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';

const { state } = store('prc-platform/facets-selected-tokens', {
	state: {
		get targetStore() {
			const targetStore = store(targetNamespace);
			if (!targetStore.state) {
				return false;
			}
			return targetStore;
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

			const facetSlug = ref.getAttribute('data-facet-slug');
			const facetValue = ref.getAttribute('data-facet-value');
			targetStore.actions.onClear(facetSlug, facetValue);
		},
		onReset: () => {
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}

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
