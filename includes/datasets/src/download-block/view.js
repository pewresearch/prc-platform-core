/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('prc-platform/dataset-download', {
	actions: {
		downloadDataset: (datasetId, uid, token, NONCE) => {
			window?.wp
				?.apiFetch({
					path: `/prc-api/v3/datasets/get-download/?datasetId=${datasetId}`,
					method: 'POST',
					data: {
						uid,
						userToken: token,
						NONCE,
					},
				})
				.then((response) => {
					if (response?.file_url) {
						window.open(response.file_url, '_blank');
					}
				})
				.catch((error) => {
					console.error(error);
				});
		},
		async checkATP(uid, token, datasetId, NONCE) {
			const { ref } = getElement();

			const response = await window?.wp?.apiFetch({
				path: `/prc-api/v3/datasets/check-atp/`,
				method: 'POST',
				data: {
					uid,
					userToken: token,
					NONCE,
				},
			});

			if (true === response) {
				actions.downloadDataset(datasetId, uid, token, NONCE);
			}
			if (false === response) {
				const popupID =
					ref.parentElement.parentElement.parentElement.getAttribute(
						'id'
					);
				const { actions: popupActions, state: popupState } = store(
					'prc-block/popup-controller'
				);
				popupActions.open(null, popupID);
			}
		},
		onButtonClick: (event) => {
			event.preventDefault();
			const context = getContext();
			const { datasetId, isATP, NONCE } = context;

			const { state } = store('prc-user-accounts/content-gate');
			const { token, uid } = state;

			if (isATP) {
				actions.checkATP(uid, token, datasetId, NONCE);
			} else {
				actions.downloadDataset(datasetId, uid, token, NONCE);
			}
		},
	},
});
