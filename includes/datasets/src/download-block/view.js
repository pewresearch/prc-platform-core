/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

store('prc-platform/dataset-download', {
	actions: {
		onButtonClick: (event) => {
			const context = getContext();
			const { targetNamespace } = context;

			const targetContext = getContext(targetNamespace);
			const { uid } = targetContext;

			event.preventDefault();
			const { datasetTermId } = getContext();
			console.log('onButtonClick', datasetTermId, uid);
		},
	},
});
