/**
 * WordPress Dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

const { addQueryArgs } = window.wp.url;

const { context, state, actions } = store(
	'prc-platform/facets-context-provider',
	{
		state: {
			inputIds: {}, // {facetSlug: inputId}, used to store the inputId for each facetSlug.
			mouseEnterPreFetchTimer: 500,
			navigateTimer: 1000,
			get getSelected() {
				return state.selected;
			},
			get getUpdatedUrl() {
				const tmp = {};
				console.log('...', state);
				if (undefined === state.selected) {
					return;
				}
				// Construct a comma separated string for each selected facet.
				Object.keys(state.selected).forEach((key) => {
					if (Array.isArray(state.selected[key])) {
						tmp[key] = state.selected[key].join(',');
					} else {
						tmp[key] = state.selected[key];
					}
				});
				// Double check tmp, if it has a key with empty value, remove it.
				Object.keys(tmp).forEach((key) => {
					console.log(tmp[key]);
					// Check if tmp[key] is an empty string or an empty array.
					if (tmp[key] === '') {
						delete tmp[key];
					}
				});
				// const stableUrl should be window.location.href without any query args.
				const stableUrl = window.location.href.split('?')[0];
				// if stableUrl has /page/x/ in it, we need to remove that.
				const stableUrlClean = stableUrl.replace(/\/page\/\d+\//, '/');
				const newUrl = addQueryArgs(stableUrlClean, tmp);
				console.log('getUpdatedUrl', stableUrlClean, tmp, newUrl);
				return newUrl;
			},
		},
		actions: {
			updateResults: () => {
				const selected = state.getSelected;
				console.log('updateResults', selected);
				if (undefined === selected) {
					return;
				}
				if (Object.keys(selected).length > 0) {
					const newUrl = state.getUpdatedUrl;

					window.location.href = newUrl;

					// const timeout = setTimeout(() => {
					// 	state.isProcessing = true;
					// 	console.log(
					// 		'rendering diff results...',
					// 		context,
					// 		state,
					// 		newUrl
					// 	);
					// }, state.navigateTimer);

					// yield router.actions.navigate(newUrl);

					// clearTimeout(timeout);

					// state.isProcessing = false;
				} else {
					// If there are no selections, then we need to navigate to the base url.
					const newUrl = window.location.href.split('?')[0];
					window.location.href = newUrl;
				}
			},
			onButtonClick: () => {
				actions.updateResults();
			},
			onCheckboxClick: (event) => {
				if (event.target.tagName === 'LABEL') {
					event.preventDefault();
				}
				const context = getContext();
				const { ref } = getElement();
				const input = ref.querySelector('input');
				const { id } = input;
				const { checked, value, type } = state[id];

				state[id].checked = !checked;
				// The wpKey of the parent parent element, the facet-template block, contains the facet slug.
				const facetSlug = ref.parentElement.parentElement.dataset.wpKey;

				if (!state.selected[facetSlug]) {
					state.selected[facetSlug] = [];
				}
				if (state.selected[facetSlug].includes(value)) {
					state.selected[facetSlug] = state.selected[
						facetSlug
					].filter((item) => item !== value);
				} else if ('radio' === type) {
					state.selected[facetSlug] = [value];
				} else {
					state.selected[facetSlug] = [
						...state.selected[facetSlug],
						value,
					];
				}

				console.log('onCheckboxClick', ref, state, id, context);
			},
			onSelectChange: (value, ref) => {
				const facetSlug = ref.parentElement.dataset.wpKey;
				console.log('onSelectChange', facetSlug, value, ref);
				if (!state.selected[facetSlug]) {
					state.selected[facetSlug] = [];
				}
				if (state.selected[facetSlug].includes(value)) {
					state.selected[facetSlug] = state.selected[
						facetSlug
					].filter((item) => item !== value);
				} else {
					state.selected[facetSlug] = [value];
				}
			},
			// *onCheckboxMouseEnter() {
			// 	console.log(
			// 		'prc-platform/facets-context-provider',
			// 		'onCheckboxMouseEnter'
			// 	);
			// 	const router = yield import('@wordpress/interactivity-router');
			// 	const newUrl = state.getUpdatedUrl;
			// 	console.log('onCheckboxMouseEnter', newUrl);
			// 	yield router.actions.prefetch(newUrl);
			// },
			// *onButtonMouseEnter() {
			// 	console.log(
			// 		'prc-platform/facets-context-provider',
			// 		'onButtonMouseEnter'
			// 	);
			// 	const router = yield import('@wordpress/interactivity-router');
			// 	const newUrl = state.getUpdatedUrl;
			// 	console.log('onButtonMouseEnter', newUrl);
			// 	yield router.actions.prefetch(newUrl);
			// },
			onClear: (facetSlug) => {
				console.log('onClear', facetSlug, state);
				const tmp = state.selected;
				// Clear all inputs that have the value of the facetSlug.
				Object.keys(state).find((key) => {
					if (
						typeof state[key] === 'object' &&
						tmp[facetSlug].includes(state[key]?.value)
					) {
						state[key].checked = false;
					}
				});
				delete tmp[facetSlug];
				state.selected = { ...tmp };
			},
			onFacetTokenClick: () => {
				const { ref, props } = getElement();
				const facetSlug = `_${props['data-wp-key']}`;
				actions.onClear(facetSlug);
			},
		},
		callbacks: {
			onInit() {

			},
			*onSelection() {
				//
			},
		},
	}
);
