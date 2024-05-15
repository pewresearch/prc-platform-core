/**
 * WordPress Dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal Dependencies
 */
import './style.scss';
import AttachmentsPanel from './attachments-panel';

/**
 * A panel that displays all the attachments for this post and also provides a dropzone for bulk uploading new attachments.
 * For filtering info, see: https://github.com/WordPress/gutenberg/tree/d5915916abc45e6682f4bdb70888aa41e98aa395/packages/components/src/higher-order/with-filters
 */
registerPlugin('prc-platform-attachment-panel', {
	render: () => <AttachmentsPanel />,
	icon: 'admin-media',
});
