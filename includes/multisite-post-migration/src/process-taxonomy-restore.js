/* eslint-disable camelcase */
/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';

export default function processTaxonomyRestore(taxonomy, postId) {
	// legacy.pewresearch.org/wp-json/wp/v2/stub/453443/?_fields=title,id,_legacy_info
	const url = addQueryArgs(
		`https://legacy.pewresearch.org/wp-json/wp/v2/stub/${postId}/`,
		{
			_fields: 'title,id,_legacy_info',
		}
	);
	const auth = `Basic ${btoa(
		'username' + ':' + 'GccJ qvLA nelL m6nr Vsg7 FqTt'
	)}`;

	fetch(url, {
		headers: {
			Authorization: auth,
			'Access-Control-Allow-Origin': '*',
		},
	})
		.then((response) => {
			console.log('TAXONOMY RESTORE:::', response);
			const { title, id, _legacy_info } = response;
			const oldTermSlugs = _legacy_info?.[taxonomy]?.terms;
			const primary_term_slug = _legacy_info?.[taxonomy]?.primary_term;

			console.log('OLD TERM SLUGS:::', oldTermSlugs);
			console.log('PRIMARY TERM SLUG:::', primary_term_slug);

			if (oldTermSlugs) {
				// We will do a rest request here to get the new term ids...
				// We need to take these glus
				// get array of term ids from bylines and acknowledgements
				// const termIds = [...newTerms].map(
				// 	(b) => b.term_id
				// );
				// dispatch('core/editor').editPost({ taxonomy: termIds });
			}
		})
		.catch((error) => {
			console.error(error);
		});
}
