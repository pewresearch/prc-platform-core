/*
 * WordPress Dependencies
 */

import { useState, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * This react hook converts a list of post ids into an array of options suitable for select controls
 * @param {*} postIds
 * @param {*} postType
 * @return {Array} An array of options with the values as
 * the post id and the label as the post title.
 */
export default function usePostIdsAsOptions(postIds = [], postType = 'post') {
	const [options, setOptions] = useState([]);

	useEffect(() => {
		if (postIds.length) {
			const posts = postIds.map((postId) => {
				const post = select('core').getEntityRecord(
					'postType',
					postType,
					postId
				);
				if (!post) {
					// Don't return anything... the post is not loaded yet
					return null;
				}
				return {
					value: postId,
					label: decodeEntities(post.title.rendered),
				};
			});
			setOptions(posts);
		}
	}, [postIds, postType]);

	return options.filter((option) => option !== null);
}
