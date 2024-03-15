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
		}
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
