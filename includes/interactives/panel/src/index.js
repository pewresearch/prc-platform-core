/**
 * External Dependencies
 */
import { Icon, blockMeta as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { Fragment, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { Panel, PanelBody, PanelRow, TextareaControl } from '@wordpress/components';
import { PluginSidebar, PluginPrePublishPanel } from '@wordpress/edit-post';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import DevNotes from './dev-notes';
import RewritesPanel from './rewrites';
const PLUGIN_NAME = 'prc-platform-interactive-options';

function InteractiveOptionsPanel() {
	const { postType, postId, postSlug } = useSelect(
		(select) => {
			const currentPostType = select(editorStore).getCurrentPostType();
			const currentPostId = select(editorStore).getCurrentPostId();
			const currentPostSlug = select(editorStore).getEditedPostAttribute('slug');
			return {
				postType: currentPostType,
				postId: currentPostId,
				postSlug: currentPostSlug,
			}
		},
		[]
	);

	return (
		<Fragment>
			<PluginSidebar name={PLUGIN_NAME} title="Interactive Options" icon="analytics">
				<PanelBody title="Rewrites">
					<RewritesPanel {...{
						postType,
						postId,
						postSlug,
					}}/>
				</PanelBody>
				<PanelBody title="Developer Notes">
					<DevNotes {...{
						postType,
						postId,
						postSlug,
					}}/>
				</PanelBody>
			</PluginSidebar>
			<PluginPrePublishPanel>
				<p>Dont forget to double check your interactive rewrites...</p>
			</PluginPrePublishPanel>
		</Fragment>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: InteractiveOptionsPanel,
});
