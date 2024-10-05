/**
 * WordPress Dependencies
 */
import { store, getElement, getServerState } from '@wordpress/interactivity';

const { addQueryArgs } = window.wp.url;

const { state, actions } = store('prc-platform/facets-context-provider', {
	state: {
		mouseEnterPreFetchTimer: 500,
		navigateTimer: 1000,
		epSortByDate: false,
		get getSelected() {
			return state.selected;
		},
		get getServerSelected() {
			return getServerState().selected;
		},
		get getUpdatedUrl() {
			if (undefined === state.selected) {
				return;
			}
			return actions.constructNewUrl(state.selected);
		},
	},
	actions: {
		/**
		 * Construct the new url to route to by adding the selected facets to the query args.
		 * @param {boolean|object} selected
		 * @return
		 */
		constructNewUrl(selected = false) {
			const tmp = {};
			if (false === selected) {
				return;
			}
			// Construct a comma separated string for each selected facet.
			Object.keys(selected).forEach((key) => {
				// If the key already has ep_ prefixed then add it directly
				if (key.startsWith(state.urlKey)) {
					tmp[key] = selected[key];
				} else if (Array.isArray(selected[key])) {
					tmp[`${state.urlKey}${key}`] = selected[key].join(',');
				} else {
					tmp[`${state.urlKey}${key}`] = selected[key];
				}
			});
			// Double check tmp, if it has a key with empty value, remove it.
			Object.keys(tmp).forEach((key) => {
				// Check if tmp[key] is an empty string or an empty array.
				// CHeck if tmp[key] is equal to an object...
				if (tmp[key] === '' || typeof tmp[key] === 'object') {
					delete tmp[key];
				}
			});
			// Remove any existing query args from the url.
			const stableUrl = window.location.href.split('?')[0];
			// Remove any references to /page/1/ or /page/2/ etc,
			// we need to send the user back to the first page.
			const stableUrlClean = stableUrl.replace(/\/page\/\d+\//, '/');
			return addQueryArgs(stableUrlClean, tmp);
		},
		/**
		 * Update the results by using the router to navigate to the new url.
		 * Scroll's the user to the top of the page, gracefully.
		 */
		*updateResults() {
			const currentUrl = window.location.href;
			const newUrl = state.getUpdatedUrl;

			if (newUrl === currentUrl) {
				console.log(
					'Facets_Context_Provider -> updateResults::',
					'no change in url'
				);
				return;
			}

			console.log(
				'Facets_Context_Provider -> updateResults::',
				state,
				currentUrl,
				newUrl
			);

			state.isProcessing = true;

			// Process the new url. This will hit the server and return the new state.
			const router = yield import('@wordpress/interactivity-router');
			yield router.actions.navigate(newUrl);

			console.log(
				'YIELD: Facets_Context_Provider <- updateResults::',
				getServerState(),
				currentUrl,
				newUrl
			);

			// Scroll to the top of the page.
			const { ref } = getElement();
			if (ref) {
				ref.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			}

			state.isProcessing = false;
		},
		/**
		 * Check if the newUrl is already in the prefetched array, if not add
		 * it and then prefetch the newUrl.
		 * @param {string} newUrl
		 * @return
		 */
		*prefetch(newUrl) {
			const router = yield import('@wordpress/interactivity-router');
			if (state.prefetched.includes(newUrl)) {
				return;
			}
			state.prefetched.push(newUrl);
			yield router.actions.prefetch(newUrl);
		},
		/**
		 * Clear a facet or a facet value from the selected state.
		 * @param {string}     facetSlug
		 * @param {string|int} facetValue
		 * @return
		 */
		onClear: (facetSlug, facetValue = null) => {
			// Because onClear actions occur after routing
			// has occured we need to get the selected from the server state.
			const currentlySelected = state.selected;
			console.log('parent onClear', {
				facetSlug,
				facetValue,
				currentlySelected,
			});

			// If there is no facetSlug then clear all selected facets and run updateResults.
			if (!facetSlug) {
				state.selected = {};
				actions.updateResults();
				return;
			}

			// If there is a facet value remove it from the given
			// facetSlug but keep the other selected facets.
			if (facetValue) {
				currentlySelected[facetSlug] = currentlySelected[
					facetSlug
				].filter((item) => item !== facetValue);
				state.selected = { ...currentlySelected };
				return;
			}

			// // Clear all inputs that have the value of the facetSlug.
			// Object.keys(state).find((key) => {
			// 	if (
			// 		typeof state[key] === 'object' &&
			// 		tmp[facetSlug].includes(state[key]?.value)
			// 	) {
			// 		state[key].checked = false;
			// 	}
			// });
			console.log('pre check:', { currentlySelected, facetSlug });

			currentlySelected[facetSlug] = [];
			state.selected = { ...currentlySelected };
			return state.selected;
		},
	},
	callbacks: {
		/**
		 * When a facet is selected, we need to update the results.
		 */
		onSelection() {
			const selected = state.getSelected;
			const keysLength = Object.keys(selected).length;
			// No selections? Disable updates.
			if (keysLength <= 0) {
				console.log(
					'Facets_Context_Provider -> onSelection:: FALSE NO SELECTIONS'
				);
				state.isDisabled = true;
			} else {
				// Once we have some selections, lets run a refresh.
				console.log('Facets_Context_Provider -> onSelection::', state);
				actions.updateResults();
				state.isDisabled = false;
			}
		},
		/**
		 * When the epSortByDate flag is toggled on add ep_sort__by_date
		 * to selected and run updateResults. This will hit the server
		 * and return the new post list sorted by date.
		 */
		onEpSortByUpdate() {
			// if epSortByDate is true then add to selected 'ep_sort__by_date' and run updateResults
			if (state.epSortByDate) {
				state.selected.ep_sort__by_date = true;
			} else {
				delete state.selected.ep_sort__by_date;
			}
		},
	},
});
