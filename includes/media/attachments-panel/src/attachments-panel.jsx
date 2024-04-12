// A panel that uses filters to allow adding additional panels.
// https://github.com/WordPress/gutenberg/tree/d5915916abc45e6682f4bdb70888aa41e98aa395/packages/components/src/higher-order/with-filters

// A panel that displays all the attachments for this post, and also provides a dropzone for bulk uploading new attachments.
// React query for data management.

// @TODO
// - Searchable list, order by date or filename
// - Edit button for each image that will let you edit alt and title
// - Secondary stage before isnertion, click on image, it will show a modal asking which size, you select it and voila.

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { withFilters } from '@wordpress/components';
import { PluginSidebar, PluginPrePublishPanel } from '@wordpress/edit-post';

/**
 * Internal Dependencies
 */
import './style.scss';
import { ProvideAttachments } from './context';
import AttachmentsList from './AttachmentsList';

const HOOK_NAME = 'prc-block-plugins/media-assets-panel';

const MediaAssetsPanel = withFilters(HOOK_NAME)(() => (
	// const { flashPrePublishWarning } = useAttachments();
	<Fragment>
		<PluginSidebar
			name="prc-media-assets-panel"
			title="Media Assets"
			icon="admin-media"
		>
			<ProvideAttachments>
				<AttachmentsList />
			</ProvideAttachments>
			{
				// Filter Should Hook Here
			}
		</PluginSidebar>
		{/* {true === flashPrePublishWarning && (
				<PluginPrePublishPanel
					name="prc-media-assets-panel-warning"
					title="Media Assets"
					icon="admin-media"
					className="prc-media-assets-panel"
					initialOpen
				>
					<p>
						{__(
							'You have un-used images. Please keep the media library tidy by removing any images you no longer need.',
							'prc-block-plugins',
						)}
					</p>
				</PluginPrePublishPanel>
			)} */}
	</Fragment>
));

export default MediaAssetsPanel;
