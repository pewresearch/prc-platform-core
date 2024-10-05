/* eslint-disable camelcase */
/**
 * WordPress Dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';

const { state, actions } = store(targetNamespace, {
	state: {
		get tokens() {
			const { getSelected, facets } = state;
			if (!getSelected) {
				return [];
			}

			const selectedKeys = Object.keys(getSelected);

			const selectedChoices = selectedKeys.map((key, index) => {
				return facets[key].choices.filter((choice) => {
					return getSelected[key]
						? getSelected[key].includes(choice.value)
						: false;
				});
			});

			return [...selectedChoices].flat();
		},
	},
	actions: {
		onTokenClick: () => {
			const context = getContext();
			console.log('onTokenClick', context);
			const { facetSlug, value } = context.token;
			actions.onClear(facetSlug, value);
		},
		resetAllTokens: () => {
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
