/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginPrePublishPanel } from '@wordpress/edit-post';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { ProvidePostReportPackage } from './context';
import BackChapters from './back-chapters';
import ReportMaterials from './materials';
import Icon from './Icon';

const PLUGIN_NAME = 'prc-platform-post-report-package';

function ReportPackagePanel() {
	const { postType, postId, parentId, isChildPost } = useSelect(
		(select) => {
			const post_parent = select(editorStore).getEditedPostAttribute('post_parent');
			const currentPostType = select(editorStore).getCurrentPostType();
			const currentPostId = select(editorStore).getCurrentPostId();
			const currentParentId = 0 !== post_parent ? post_parent : currentPostId;
			return {
				postType: currentPostType,
				postId: currentPostId,
				parentId: currentParentId,
				isChildPost: 0 !== post_parent,
			}
		},
		[]
	);
	return (
			<PluginSidebar name={PLUGIN_NAME} title="Report Package" icon={Icon}>
				<ProvidePostReportPackage {...{
					postType,
					postId: parentId,
				}}>
					<ReportMaterials />
					<BackChapters />
				</ProvidePostReportPackage>
			</PluginSidebar>
	);
}


{/* <PluginPrePublishPanel>
	<p>Hi There!</p>
	<p>IN theory... this should share context and state in the same memory object as the sidebar panel.</p>
</PluginPrePublishPanel> */}

// Pre publish to confirm your chapters.

registerPlugin(PLUGIN_NAME, {
	render: ReportPackagePanel,
});
