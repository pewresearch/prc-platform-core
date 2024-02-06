/**
 * WordPress Dependencies
 */
import {
	store,
	navigate,
	prefetch,
	getElement,
	getContext,
} from '@wordpress/interactivity';

// @TODO: Faking the wordpress/url package import for now, until the new Gutenberg Module Loader is completed.
const { addQueryArgs } = window.wp.url;

function getWpKeyFromRef(ref) {
	let wpKey;
	while (wpKey === undefined) {
		ref = ref.parentElement;
		wpKey = ref.dataset?.wpKey;
	}
	return wpKey;
}

function getInputAttrs(ref) {
	console.log('getInputAttrs', ref);

	let { id } = ref;
	if (ref.tagName === 'LABEL') {
		id = ref.parentElement.getAttribute('aria-labelledby');
	}
	if (ref.classList.contains('wp-block-prc-block-form-field')) {
		id = ref.querySelector('input').id;
	}
	let { value } = ref;
	if (ref.tagName === 'LABEL') {
		value = ref.parentElement.querySelector('input').value;
	}
	if (ref.classList.contains('wp-block-prc-block-form-field')) {
		value = ref.querySelector('input').value;
	}
	const wpKey = getWpKeyFromRef(ref);

	console.log('getInputAttrs', id, wpKey, value);

	return {
		id,
		value,
		wpKey,
	};
}

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
				console.log('onSelectChange', value, ref);
				const id = ref.getAttribute('aria-controls');
				const facetSlug = document.getElementById(id).dataset.wpKey;
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
			onCheckboxMouseEnter: () => {
				console.log(
					'prc-platform/facets-context-provider',
					'onCheckboxMouseEnter'
				);
			},
			onButtonMouseEnter: () => {
				console.log(
					'prc-platform/facets-context-provider',
					'onButtonMouseEnter'
				);
			},
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
			onInit: async () => {
				console.log(
					'facetsContextProvider Initializing...',
					'state:',
					state,
					'context:',
					context
				);
			},
			onSelection: async () => {
				const selected = state.getSelected;
				console.log('onSelection', selected);
				if (undefined === selected) {
					return;
				}
				// Only if the selection has some values.
				if (Object.keys(selected).length > 0) {
					const newUrl = state.getUpdatedUrl;

					const timeout = setTimeout(() => {
						state.isProcessing = true;
						console.log(
							'rendering diff results...',
							context,
							state,
							newUrl
						);
					}, state.navigateTimer);

					await navigate(newUrl);

					clearTimeout(timeout);

					state.isProcessing = false;
				} else {
					// If there are no selections, then we need to navigate to the base url.
					const newUrl = window.location.href.split('?')[0];
					await navigate(newUrl);
				}
			},
		},
	}
);
