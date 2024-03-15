/**
 * WordPress Dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';

const { actions, state } = store('prc-platform/facets-update-button', {
	state: {
		// update-results is the id of our button, we can use it to target the button disabled state but also hide the "clear all" button.
		'update-results': {
			isDisabled: true, // Lets start off assuming we're disabled.
		},
	},
	actions: {
		onClear: () => {
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}
			targetStore.actions.onClear();
		},
		onButtonClick() {
			// Refresh the page, go render the next page of results...
			window.location.href = window.location.href;
		},
	},
	callbacks: {
		watchDisabledState() {
			const targetStore = store(targetNamespace);
			if (!targetStore.state) {
				return;
			}
			state['update-results'].isDisabled = targetStore.state?.isDisabled;
		},
	},
});
