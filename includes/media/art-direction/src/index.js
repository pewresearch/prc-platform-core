/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';
import InspectorSidebar from './inspector-sidebar';
import PrePublishPanel from './pre-publish-panel';
import renderAttachmentsPanelHook from './attachments-panel-hook';

function renderArtDirectionPlugin() {
	return () => (
		<Fragment>
			<InspectorSidebar />
			<PrePublishPanel />
		</Fragment>
	);
}

// Replace the "Featured Image" area with our "Art Direction" panel.
addFilter(
	'editor.PostFeaturedImage',
	'prc-platform/art-direction',
	renderArtDirectionPlugin
);

addFilter(
	'prc-platform.attachments-panel',
	'prc-platform/art-direction',
	renderAttachmentsPanelHook
);
