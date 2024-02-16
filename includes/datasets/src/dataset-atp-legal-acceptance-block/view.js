/**
 * WordPress Dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { apiFetch } = window.wp;

const { actions } = store('prc-platform/dataset-download', {
	actions: {
		*closeModal() {
			const popupController = yield store('prc-block/popup-controller');
			const { actions: popupActions } = popupController;
			popupActions.closeAll();
		},
		*atpModalAgree() {
			const { ref } = getElement();
			const popupId =
				ref.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute(
					'id'
				);
			console.log('test', popupId);
			const context = getContext();
			const { datasetId } = context;

			const contentGateContext = getContext(
				'prc-user-accounts/content-gate'
			);
			const { userToken, userId } = contentGateContext;
			console.log('atpModalAgree', datasetId, userToken, userId);
			yield apiFetch({
				path: `/prc-api/v3/datasets/accept-atp`,
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
					actions.downloadDataset(datasetId, userId, userToken);
					console.log('ATP ACCEPT', response, actions);
					actions.closeModal();
				})
				.catch((error) => {
					console.error('Error fetching ATP check', error);
					actions.closeModal();
				});
		},
		*atpModalDisagree() {
			actions.closeModal();
		},
	},
});
