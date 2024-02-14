/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

store('prc-platform/dataset-download', {
	actions: {
		onButtonClick: (event) => {
			event.preventDefault();
			const context = getContext();
			const { datasetId } = context;

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
			// Hit the api with this information...
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
		},
	},
});
