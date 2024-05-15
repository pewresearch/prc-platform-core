/**
 * WordPress Dependencies
 */
import { FormToggle } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/edit-post';

function PRCPostVisibility() {
	// Detect if this is the site editor and if so then return early...
	const postVisibility = useSelect((select) => {
		const meta = select('core/editor').getEditedPostAttribute('meta');
		const { _postVisibility } = meta;
		return _postVisibility;
	});

	const { editPost } = useDispatch('core/editor');

	// If postVisibility is null or undefined, set it to 'public'.
	// This ensures that the postVisibility meta is always set properly for the rest api, even on older posts.
	useEffect(() => {
		if (postVisibility === null || postVisibility === undefined) {
			editPost({
				meta: { _postVisibility: 'public' },
			});
		}
	}, [postVisibility]);

	return (
		<Fragment>
			<PluginPostStatusInfo>
				<label>Hide On Publications (Index)</label>
				<FormToggle
					checked={'hidden_from_index' === postVisibility}
					onChange={() => {
						if ('hidden_from_index' === postVisibility) {
							editPost({
								meta: { _postVisibility: '' },
							});
						} else {
							editPost({
								meta: {
									_postVisibility: 'hidden_from_index',
								},
							});
						}
					}}
				/>
			</PluginPostStatusInfo>
			<PluginPostStatusInfo>
				<label>Hide On Search</label>
				<FormToggle
					checked={'hidden_from_search' === postVisibility}
					onChange={() => {
						if ('hidden_from_search' === postVisibility) {
							editPost({
								meta: { _postVisibility: '' },
							});
						} else {
							editPost({
								meta: {
									_postVisibility: 'hidden_from_search',
								},
							});
						}
					}}
				/>
			</PluginPostStatusInfo>
		</Fragment>
	);
}

registerPlugin('prc-post-visibility', { render: PRCPostVisibility });
