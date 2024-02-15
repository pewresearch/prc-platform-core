/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

function downloadDataset(datasetId, userId, userToken) {
	window?.wp
		?.apiFetch({
			path: `/prc-api/v3/datasets/get-download/?datasetId=${datasetId}`,
			method: 'POST',
			headers: {
				// 'X-WP-Nonce': window.wpApiSettings.nonce,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				uid: userId,
				userToken,
			}),
		})
		.then((response) => {
			if (response?.file_url) {
				// Download the file.
				window.open(response.file_url, '_blank');
			}
		})
		.catch((error) => {
			console.error('Error fetching dataset download', error);
		});
}

store('prc-platform/dataset-download', {
	actions: {
		onButtonClick: (event) => {
			event.preventDefault();
			const context = getContext();
			const { datasetId, isATP } = context;

			const contentGateContext = getContext(
				'prc-user-accounts/content-gate'
			);
			const { userToken, userId } = contentGateContext;

			console.log(
				'onButtonClick: "Hit the api with this information..." ->',
				contentGateContext,
				userToken,
				userId,
				datasetId
			);

			if (isATP) {
				const { actions } = store('prc-block/popup-controller');
				window?.wp
					?.apiFetch({
						path: `/prc-api/v3/datasets/check-atp/`,
						method: 'POST',
						headers: {
							// 'X-WP-Nonce': window.wpApiSettings.nonce,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							uid: userId,
							userToken,
						}),
					})
					.then((response) => {
						console.log('ATP CHECK', response);
						if (true === response) {
							actions.open();
							// downloadDataset(datasetId, userId, userToken);
						} else {
							// Activate modal...
							actions.open();
						}
					});
			} else {
				downloadDataset(datasetId, userId, userToken);
			}

			// Hit the api with this information...
		},
	},
});
