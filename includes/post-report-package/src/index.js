/**
 * External Dependencies
 */
import { Icon, blockMeta as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import {
	store as editorStore,
	PluginSidebar,
	PluginPrePublishPanel,
} from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { Notice } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { ProvidePostReportPackage } from './context';
import ChaptersPanel from './chapters';
import MaterialsPanel from './materials';

const PLUGIN_NAME = 'prc-platform-post-report-package';

function ReportPackagePanel() {
	const { postType, postId, parentId, isChildPost } = useSelect((select) => {
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
	return (
		<Fragment>
			{isChildPost && (
				<Notice status="warning">
					<p>This is a child post.</p>
				</Notice>
			)}
			<PluginSidebar
				name={PLUGIN_NAME}
				title="Report Package"
				icon={<Icon icon={icon} size={16} />}
			>
				<ProvidePostReportPackage
					{...{
						postType,
						parentId,
						postId,
					}}
				>
					<MaterialsPanel />
					<ChaptersPanel />
				</ProvidePostReportPackage>
			</PluginSidebar>
			{!isChildPost && (
				<PluginPrePublishPanel title="Review Report Package">
					<ProvidePostReportPackage
						{...{
							postType,
							postId: parentId,
							currentPostId: postId,
						}}
					>
						<MaterialsPanel />
						<ChaptersPanel />
					</ProvidePostReportPackage>
				</PluginPrePublishPanel>
			)}
		</Fragment>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: ReportPackagePanel,
});
