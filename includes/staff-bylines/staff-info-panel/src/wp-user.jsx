/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */

import { useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';

export default function WPUserPanel() {
	const { postType, postId } = useSelect(
		(select) => ({
			postType: select('core/editor').getCurrentPostType(),
			postId: select('core/editor').getCurrentPostId(),
		}),
		[]
	);
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta', postId);
	const { _wp_user } = meta;

	return (
		<PluginDocumentSettingPanel
			name="prc-staff-wp-user"
			title="WordPress User"
		>
			<p>WIP</p>
			<p>
				Control to tie a wp_user profile to a staff profile will go
				here. This will enable slack notifications and the like in the
				future.
			</p>
		</PluginDocumentSettingPanel>
	);
}
