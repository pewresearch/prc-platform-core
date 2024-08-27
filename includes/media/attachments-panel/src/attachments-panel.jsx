/* eslint-disable max-len */
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
import { Fragment } from '@wordpress/element';
import { withFilters } from '@wordpress/components';
import { PluginSidebar, PluginPrePublishPanel } from '@wordpress/edit-post';

/**
 * Internal Dependencies
 */
import './style.scss';
import { ProvideAttachments } from './context';
import AttachmentsList from './attachments-list';

const HOOK_NAME = 'prc-platform.attachments-panel';
// With this hook other plugins can add their own panels to the attachments panel. For example, Chart Builder could potentially show it's chart exports. The entire idea of this plugin is to provide a central universe of all media assets for a post/page.

function AttachmentsPanelComponent() {
	return (
		<ProvideAttachments>
			<AttachmentsList />
		</ProvideAttachments>
	);
}

export default function AttachmentsPanel() {
	const AttachmentsPanelHook = withFilters(HOOK_NAME)(
		AttachmentsPanelComponent
	);
	return (
		<PluginSidebar
			name="prc-platform-attachments-panel"
			title="Attachments"
			icon="admin-media"
		>
			<AttachmentsPanelHook />
		</PluginSidebar>
	);
}
