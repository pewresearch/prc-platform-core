/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Fetches a post by its URL (resolves post ID and type via API, then fetches post).
 *
 * @param {string} url Post URL.
 * @return {Promise<Object>} Post object from REST API.
 */
async function getPostByUrl(url) {
	const resp = await apiFetch({
		path: addQueryArgs('/prc-api/v3/utils/postid-by-url', {
			url,
		}),
		method: 'GET',
	});
	const type = 'post' === resp?.postType ? 'posts' : resp?.postType;
	const postSearchPath = addQueryArgs(`/wp/v2/${type}/${resp?.postId}`, {
		context: 'view',
	});
	const post = await apiFetch({
		path: postSearchPath,
		method: 'GET',
	});
	return post;
}

export { getPostByUrl };
