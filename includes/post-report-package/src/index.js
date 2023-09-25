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
		<Fragment>
			<PluginSidebar name={PLUGIN_NAME} title="Report Package">
				<ProvidePostReportPackage {...{
					postType,
					postId: parentId,
					currentPostId: postId,
				}}>
					<ReportMaterials />
					<BackChapters />
				</ProvidePostReportPackage>
			</PluginSidebar>
			{!isChildPost && (
				<PluginPrePublishPanel>
					<ProvidePostReportPackage {...{
						postType,
						postId: parentId,
						currentPostId: postId,
					}}>
						<p>Please review the attached report materials:</p>
						<ReportMaterials />
						<p>Please review the attached back chapter posts. These post's status will be updated to match the parent post on publish.</p>
						<BackChapters />
					</ProvidePostReportPackage>
				</PluginPrePublishPanel>
			)}
		</Fragment>
	);
}

// Pre publish to confirm your chapters.

registerPlugin(PLUGIN_NAME, {
	render: ReportPackagePanel,
});
