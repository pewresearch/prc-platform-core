/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import KickerTemplatePartControl from './control-template-part-kicker';

const PLUGIN_NAME = 'prc-platform--collections';

export default function CollectionPanel() {
	const { postType, parentId } = useSelect((select) => {
		const postParentId =
			select(editorStore).getEditedPostAttribute('post_parent');
		const currentPostType = select(editorStore).getCurrentPostType();
		const currentPostId = select(editorStore).getCurrentPostId();
		const currentParentId =
			0 !== postParentId ? postParentId : currentPostId;
		return {
			postType: currentPostType,
			postId: currentPostId,
			parentId: currentParentId,
			isChildPost: 0 !== postParentId,
		};
	}, []);
	const [meta, setMeta] = useEntityProp(
		'postType',
		postType,
		'meta',
		parentId
	);
	const kickerSlug = useMemo(() => {
		return meta.kicker_pattern_slug;
	}, [meta]);
	const updateKickerSlug = (newSlug) =>
		setMeta({
			...meta,
			kicker_pattern_slug: newSlug,
		});
	return (
		<PluginDocumentSettingPanel
			name={PLUGIN_NAME}
			title="Collection Kicker"
		>
			<KickerTemplatePartControl
				kickerSlug={kickerSlug}
				onChange={(value) => updateKickerSlug(value)}
			/>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: CollectionPanel,
});
