/**
 * WordPress Dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

const { addQueryArgs } = window.wp.url;

function constructNewUrl(selected = false) {
	const tmp = {};
	if (false === selected) {
		return;
	}
	// Construct a comma separated string for each selected facet.
	Object.keys(selected).forEach((key) => {
		if (Array.isArray(selected[key])) {
			tmp[`_${key}`] = selected[key].join(',');
		} else {
			tmp[`_${key}`] = selected[key];
		}
	});
	// Double check tmp, if it has a key with empty value, remove it.
	Object.keys(tmp).forEach((key) => {
		// Check if tmp[key] is an empty string or an empty array.
		if (tmp[key] === '') {
			delete tmp[key];
		}
	});
	// Remove any query args on the current url.
	const stableUrl = window.location.href.split('?')[0];
	// If our url has /page/x/ in it, we need to remove that, we're sending the user back to the first page.
	const stableUrlClean = stableUrl.replace(/\/page\/\d+\//, '/');
	const newUrl = addQueryArgs(stableUrlClean, tmp);
	console.log(
		'facets-context-provider::constructNewUrl = :::::',
		stableUrlClean,
		tmp,
		newUrl
	);
	return newUrl;
}

const { state, actions } = store('prc-platform/facets-context-provider', {
	state: {
		mouseEnterPreFetchTimer: 500,
		navigateTimer: 1000,
		get getSelected() {
			return state.selected;
		},
		get getUpdatedUrl() {
			if (undefined === state.selected) {
				return;
			}
			return constructNewUrl(state.selected);
		},
	},
	actions: {
		*updateResults() {
			const selected = state.getSelected;
			const currentUrl = window.location.href;
			const newUrl = state.getUpdatedUrl;

			if (newUrl === currentUrl) {
				console.log(
					'facets-context-provider::updateResults (NO CHANGE)',
					'No change...'
				);
				return;
			}

			state.isProcessing = true;

			console.log(
				'facets-context-provider::updateResults (CHANGE DETECTED)',
				Object.keys(selected),
				newUrl,
				currentUrl
			);

			const router = yield import('@wordpress/interactivity-router');
			yield router.actions.navigate(newUrl);

			state.isProcessing = false;
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
				state.selected[facetSlug] = state.selected[facetSlug].filter(
					(item) => item !== value
				);
			} else if ('radio' === type) {
				state.selected[facetSlug] = [value];
			} else {
				state.selected[facetSlug] = [
					...state.selected[facetSlug],
					value,
				];
			}
			console.log(
				'facets-context-provider::onCheckboxClick',
				ref,
				state,
				id,
				context
			);
		},
		onSelectChange: (value, ref) => {
			const facetSlug =
				ref.parentElement.parentElement.parentElement.dataset.wpKey;
			const currentSelected = state.getSelected;
			const newSelected = currentSelected;
			if (!currentSelected[facetSlug]) {
				newSelected[facetSlug] = [value];
			} else if (currentSelected[facetSlug].includes(value)) {
				newSelected[facetSlug] = newSelected[facetSlug].filter(
					(item) => item !== value
				);
			} else {
				newSelected[facetSlug] = [value];
			}

			state.selected = newSelected;
		},
		*prefetch(newUrl) {
			const router = yield import('@wordpress/interactivity-router');

			// check if newUrl is in state.prefetched and if not then
			// 1. add it to the state.prefetched
			// 2. prefetch it. otherwise return.
			if (state.prefetched.includes(newUrl)) {
				return;
			}

			state.prefetched.push(newUrl);

			console.log(
				'facets-context-provider::prefetch',
				newUrl,
				state.prefetched
			);
			yield router.actions.prefetch(newUrl);
		},
		*onCheckboxMouseEnter(event) {
			if (event.target.tagName === 'LABEL') {
				event.preventDefault();
			}
			const context = getContext();
			const { ref } = getElement();
			const input = ref.querySelector('input');
			const { id } = input;
			const { value } = state[id];
			// The wpKey of the parent parent element, the facet-template block, contains the facet slug.
			const facetSlug = ref.parentElement.parentElement.dataset.wpKey;

			const currentlySelected = state.selected;
			const nextSelected = { ...currentlySelected, [facetSlug]: value };
			const nextUrl = constructNewUrl(nextSelected);
			yield actions.prefetch(nextUrl);
		},
		onClear: (facetSlug, facetValue = null) => {
			const tmp = state.selected;
			// if there is no facetSlug then clear all...
			if (!facetSlug) {
				state.selected = {};
				// lets also re-run the updateResults.
				actions.updateResults();
				return;
			}
			// If there is a facet value then lets remove it for the facetSlug but keep the rest.
			if (facetValue) {
				tmp[facetSlug] = tmp[facetSlug].filter(
					(item) => item !== facetValue
				);
				state.selected = { ...tmp };
				return;
			}

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
	},
	callbacks: {
		onSelection() {
			const selected = state.getSelected;
			const keysLength = Object.keys(selected).length;
			console.log(
				'facets-context-provider::onSelection()',
				selected,
				Object.keys(selected),
				keysLength
			);
			// No selections? Disable the update button.
			if (keysLength <= 0) {
				state.isDisabled = true;
			} else {
				// Once we have some selections, lets run a refresh.
				actions.updateResults();
				state.isDisabled = false;
			}
		},
	},
});
