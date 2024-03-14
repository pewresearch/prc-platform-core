/**
 * WordPress Dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

const { addQueryArgs } = window.wp.url;

const { state, actions } = store('prc-platform/facets-context-provider', {
	state: {
		processing: false,
		mouseEnterPreFetchTimer: 500,
		navigateTimer: 1000,
		get getSelected() {
			return state.selected;
		},
		get getUpdatedUrl() {
			console.log('facets-context-provider::getUpdatedUrl...', state);
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
			console.log(
				'facets-context-provider::getUpdatedUrl = :::::',
				stableUrlClean,
				tmp,
				newUrl
			);
			return newUrl;
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

			console.log(
				'facets-context-provider::updateResults (CHANGE DETECTED)',
				Object.keys(selected),
				newUrl,
				currentUrl
			);

			const router = yield import('@wordpress/interactivity-router');

			// yield router.actions.navigate(newUrl);
			state.isProcessing = false;
		},
		*onButtonClick() {
			// Refresh the page, go render the next page of results...
			window.location.href = window.location.href;
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
			const facetSlug = ref.parentElement.dataset.wpKey;
			console.log(
				'facets-context-provider::onSelectChange',
				facetSlug,
				value
			);
			if (!state.selected[facetSlug]) {
				state.selected[facetSlug] = [value];
			}
			if (state.selected[facetSlug].includes(value)) {
				state.selected[facetSlug] = state.selected[facetSlug].filter(
					(item) => item !== value
				);
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
			console.log('facets-context-provider::onClear', facetSlug, state);
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
			// set the button to disabled to start...
			state['update-results-button'].isDisabled = true;
			console.log('facets-context-provider::onInit', state);
		},
		*onSelection() {
			const selected = state.getSelected;
			console.log(
				'facets-context-provider::onSelection',
				selected,
				Object.keys(selected)
			);
			if (Object.keys(selected).length <= 0) {
				console.log(
					"If there are no selected facets, don't enable the button and dont run the query..."
				);
				state['update-results-button'].isDisabled = false;
			} else {
				// let's run a quick router to refresh the components...
				// with the caching layer on the backend we have now (if this is the first such query) cached
				// the results for the next user. this will last an hour.
				setTimeout(() => {
					console.log(
						'Looks like we do have some selectiosn...',
						Object.keys(selected)
					);
					actions.updateResults();
				}, 500);
			}
		},
	},
});
