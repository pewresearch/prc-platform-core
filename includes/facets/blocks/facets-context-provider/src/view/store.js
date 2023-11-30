/**
 * WordPress Dependencies
 */
import { store, navigate, prefetch } from '@wordpress/interactivity';
import { addQueryArgs } from '@wordpress/url';

export default function registerStore() {
	// Get the Facet WP API??
	store( {
		state: {
			facetsContextProvider: {
				mouseEnterPreFetchTimer: 500,
				navigateTimer: 100,
			}
		},
		actions: {
			facetsContextProvider: {
				onCheckboxMouseEnter: ({context, state, selectors, ref}) => {
					let timeoutId = null;

					timeoutId = setTimeout(() => {
						// convert an array to a comma separated string
						const newUrl = selectors.facetsContextProvider.getUpdatedUrl({context, state});
						console.log('onCheckboxMouseEnter', newUrl, ref);
						prefetch(newUrl);
					}, state.facetsContextProvider.mouseEnterPreFetchTimer);

					ref.addEventListener('mouseleave', () => {
						clearTimeout(timeoutId);
					}, { once: true });
				},
				onRadioMouseEnter: ({context, state, selectors, ref}) => {
					let timeoutId = null;

					timeoutId = setTimeout(() => {
						// convert an array to a comma separated string
						const newUrl = selectors.facetsContextProvider.getUpdatedUrl({context, state});
						console.log('onRadioMouseEnter', newUrl, ref);
						prefetch(newUrl);
					}, state.facetsContextProvider.mouseEnterPreFetchTimer);

					ref.addEventListener('mouseleave', () => {
						clearTimeout(timeoutId);
					}, { once: true });
				},
				onCheckboxChange: ({context, state, ref, selectors}) => {
					const {id, value} = selectors.facetsContextProvider.getInputAttrs({ref});
					const facetSlug = selectors.facetsContextProvider.getFacetSlug({context});

					if ( !state.facetsContextProvider.selected[facetSlug] ) {
						state.facetsContextProvider.selected[facetSlug] = [];
					}
					if ( state.facetsContextProvider.selected[facetSlug].includes(value) ) {
						state.facetsContextProvider.selected[facetSlug] = state.facetsContextProvider.selected[facetSlug].filter( item => item !== value );
					} else {
						state.facetsContextProvider.selected[facetSlug] = [...state.facetsContextProvider.selected[facetSlug], value];
					}

					// Mark the checkbox as checked on the context of the input checkbox block.
					context[id].isChecked = !context[id].isChecked;
				},
				onRadioChange: ({context, state, ref, selectors}) => {
					const {id, value} = selectors.facetsContextProvider.getInputAttrs({ref});
					const facetSlug = selectors.facetsContextProvider.getFacetSlug({context});

					if ( !state.facetsContextProvider.selected[facetSlug] ) {
						state.facetsContextProvider.selected[facetSlug] = [];
					}
					// Because this is a radio we can only have one value selected at a time. So we can just set the value to the new value.
					// check if the value is already selected, if it is, then we need to remove it.
					if ( state.facetsContextProvider.selected[facetSlug].includes(value) ) {
						state.facetsContextProvider.selected[facetSlug] = state.facetsContextProvider.selected[facetSlug].filter( item => item !== value );
					} else {
						state.facetsContextProvider.selected[facetSlug] = [value];
					}

					// Mark the radio as checked on the context of the input radio block.
					context[id].isChecked = !context[id].isChecked;
				}
			}
		},
		selectors: {
			facetsContextProvider: {
				getInputAttrs: ({ref}) => {
					let id = ref.id;
					if ( ref.tagName === 'LABEL' ) {
						id = ref.parentElement.getAttribute('aria-labelledby');
					}
					let value = ref.value;
					if ( ref.tagName === 'LABEL' ) {
						value = ref.parentElement.querySelector('input').value;
					}
					return {
						id,
						value
					};
				},
				getSelected: ({state}) => {
					return state.facetsContextProvider.selected;
				},
				getFacetSlug: ({context}) => {
					return `_${context.facetTemplate?.facetSlug}`;
				},
				getUpdatedUrl: ({context, state}) => {
					const tmp = {};
					Object.keys(state.facetsContextProvider.selected).forEach( key => {
						if ( Array.isArray(state.facetsContextProvider.selected[key]) ) {
							tmp[key] = state.facetsContextProvider.selected[key].join(',');
						} else {
							tmp[key] = state.facetsContextProvider.selected[key];
						}
					});
					// Double check tmp, if it has a key with empty value, remove it.
					Object.keys(tmp).forEach( key => {
						console.log(tmp[key]);
						// Check if tmp[key] is an empty string or an empty array.
						if ( tmp[key] === '' ) {
							delete tmp[key];
						}
					});
					// const stableUrl should be window.location.href without any query args.
					const stableUrl = window.location.href.split('?')[0];
					// if stableUrl has /page/x/ in it, we need to remove that.
					const stableUrlClean = stableUrl.replace(/\/page\/\d+\//, '/');
					const newUrl = addQueryArgs( stableUrlClean, tmp );
					console.log("getUpdatedUrl", stableUrlClean, tmp, newUrl);
					return newUrl;
				}
			}
		},
		effects: {
			facetsContextProvider: {
				onInit: async ({state, context, selectors}) => {
					console.log('facetsContextProvider Initializing...', 'state:', state, 'context:', context);
				},
				onSelection: async ({state, context, selectors}) => {
					const selected = selectors.facetsContextProvider.getSelected({state});
					// Only if the selection has some values.
					if ( Object.keys(selected).length > 0 ) {
						const newUrl = selectors.facetsContextProvider.getUpdatedUrl({context, state});

						const timeout = setTimeout(()=> {
							state.facetsContextProvider.isProcessing = true;
							console.log("Waiting here, we could do an animation...");
							console.log("rendering diff results...",  context, state, selectors, newUrl);
						}, state.facetsContextProvider.navigateTimer);

						await navigate(newUrl);

						clearTimeout(timeout);

						state.facetsContextProvider.isProcessing = false;
					}
				}
			}
		},
	});
}
