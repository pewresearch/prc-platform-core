/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export default function regenerateToc(postId) {
	const path = addQueryArgs('/prc-api/v3/report-package/regenerate-toc', {
		postId,
	});
	return new Promise((resolve, reject) => {
		apiFetch({
			path,
			method: 'POST',
		})
			.then((response) => {
				console.log('Regenerate TOC response', response);
				resolve(response);
			})
			.catch((error) => {
				console.error('Regenerate TOC error', error);
				reject(error);
			});
	});
}
