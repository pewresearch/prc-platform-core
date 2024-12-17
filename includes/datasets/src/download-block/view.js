/**
 * WordPress Dependencies
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store('prc-platform/dataset-download', {
	actions: {
		downloadDataset: (datasetId, uid, token, NONCE, context) => {
			window?.wp
				?.apiFetch({
					path: `/prc-api/v3/datasets/get-download/?dataset_id=${datasetId}`,
					method: 'POST',
					data: {
						uid,
						userToken: token,
						NONCE,
					},
				})
				.then((response) => {
					if (response?.file_url) {
						context.isProcessing = false;
						context.isSuccess = true;
						window.open(response.file_url, '_blank');
					}
				})
				.catch((error) => {
					context.isProcessing = false;
					context.isError = true;
					console.error(error);
				});
		},
		async checkATP(uid, token, datasetId, NONCE) {
			const { ref } = getElement();
			const context = getContext();

			const response = await window?.wp?.apiFetch({
				path: `/prc-api/v3/datasets/check-atp/`,
				method: 'POST',
				data: {
					uid,
					userToken: token,
					NONCE,
				},
			});

			console.log("User has accepted ATP legal agreement: ", response);

			if (true === response) {
				actions.downloadDataset(datasetId, uid, token, NONCE, context);

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
			const { datasetId, isProcessing, isATP, NONCE } = context;

			context.isProcessing = true;

			const { state } = store('prc-user-accounts/content-gate');
			const { token, uid } = state;

			if (isATP) {
				actions.checkATP(uid, token, datasetId, NONCE);
			} else {
				actions.downloadDataset(datasetId, uid, token, NONCE, context);

			}
		},
	},
	callbacks: {
		isProcessing: () => {
			const context = getContext();
			const { ref } = getElement();
			const { isProcessing } = context;
			// get the id from .wp-block-button inside the ref element
			const buttonId = ref.querySelector('.wp-element-button').id;
			state[buttonId].isProcessing = isProcessing;
		},
		isError: () => {
			const context = getContext();
			const { ref } = getElement();
			const { isError } = context;
			// get the id from .wp-block-button inside the ref element
			const buttonId = ref.querySelector('.wp-element-button').id;
			state[buttonId].isError = isError;
		},
		isSuccess: () => {
			const context = getContext();
			const { ref } = getElement();
			const { isSuccess } = context;
			// get the id from .wp-block-button inside the ref element
			const buttonId = ref.querySelector('.wp-element-button').id;
			state[buttonId].isSuccess = isSuccess;
		}
	}
});
