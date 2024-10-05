/**
 * WordPress Dependencies
 */
import { store } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */

const { state } = store('prc-platform/facets-search-relevancy', {
	state: {
		get status() {
			const targetStore = store('prc-platform/facets-context-provider');
			if (targetStore.state.epSortByDate !== undefined) {
				return targetStore.state.epSortByDate;
			}
			return false;
		},
		get label() {
			return state.status ? 'Sort By Date' : 'Sort By Date';
		},
		get isSelected() {
			return state.status;
		},
		get checked() {
			return state.status;
		},
		get value() {
			return state.status;
		},
		get name() {
			return 'toggle__sort-relevancy';
		},
		get id() {
			return 'toggle__sort-relevancy';
		},
	},
	actions: {
		onCheckboxClick: () => {
			const targetStore = store('prc-platform/facets-context-provider');
			if (targetStore.state.epSortByDate !== undefined) {
				targetStore.state.epSortByDate =
					!targetStore.state.epSortByDate;
			}
		},
	},
	callbacks: {
		// On init we're going to hoist the epSortByDate value from the server
		// into the facets context provider.
		onInit: () => {
			const targetStore = store('prc-platform/facets-context-provider');
			if (targetStore.state.epSortByDate !== undefined) {
				targetStore.state.epSortByDate = state.epSortByDate;
			}
		},
	},
});
