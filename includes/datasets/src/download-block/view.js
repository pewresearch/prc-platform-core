/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

store('prc-platform/dataset-download', {
	actions: {
		onButtonClick: (event) => {
			event.preventDefault();
			const { datasetTermId } = getContext();
			console.log('onButtonClick', datasetTermId);
		},
	},
});
