/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('prc-platform/dataset-download', {
	actions: {
		downloadDataset: (datasetId, uid, token) => {
			window?.wp
				?.apiFetch({
					path: `/prc-api/v3/datasets/get-download/?datasetId=${datasetId}`,
					method: 'POST',
					headers: {
						// 'X-WP-Nonce': window.wpApiSettings.nonce,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						uid,
						userToken: token,
					}),
				})
				.then((response) => {
					// If there's a file_url in the response, download it...
					// ooooo that felt... bad to type
					// should run a file check here? only pdfs and zips? not sure theres an attack vector here
					if (response?.file_url) {
						window.open(response.file_url, '_blank');
					}
				})
				.catch((error) => {
					console.error('Error fetching dataset download', error);
				});
		},
		onButtonClick: (event) => {
			event.preventDefault();
			const context = getContext();
			const { datasetId, isATP } = context;

			const { state } = store('prc-user-accounts/content-gate');
			const { token, uid } = state;

			console.log(
				'onButtonClick: "Hit the api with this information..." ->',
				state,
				token,
				uid,
				datasetId
			);

			if (isATP) {
				console.log('isATP');
				actions.checkATP(uid, token, datasetId);
			} else {
				actions.downloadDataset(datasetId, uid, token);
			}
		},
		async checkATP(userId, userToken, datasetId) {
			const { ref } = getElement();

			const response = await window?.wp?.apiFetch({
				path: `/prc-api/v3/datasets/check-atp/`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					uid: userId,
					userToken,
				}),
			});

			console.log('CHECK ATP', response);
			if (true === response) {
				actions.downloadDataset(datasetId, userId, userToken);
			}
			if (false === response) {
				const popupID =
					ref.parentElement.parentElement.parentElement.getAttribute(
						'id'
					);
				const { actions: popupActions, state: popupState } = store(
					'prc-block/popup-controller'
				);
				console.log('POP', popupState, popupID);
				popupActions.open(null, popupID);
			}
		},
	},
});
