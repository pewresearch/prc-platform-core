
/**
 * WordPress Dependencies
 */
import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { Fragment } from 'react';
import { useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import AlexaPreview from './alexa-preview';
import PrePublishPlayer from './pre-publish-player';

function FlashBriefingPreview() {
	const blocks = useSelect((select) => select('core/editor').getBlocks());
	const blockContent = blocks
		.map((block) => _.unescape(block.attributes.content))
		.join(' ');

	return (
		<Fragment>
			 <PluginSidebarMoreMenuItem target="flash-briefing-preview-audio">
                {__('Flash Briefing Preview Audio', 'flash-briefing-preview-audio')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="flash-briefing-preview-audio"
                title={__('Flash Briefing Preview Audio', 'flash-briefing')}
            >
				<AlexaPreview blockContent={blockContent} />
				{/* <PanelBody title="Siri">Siri Goes Here</PanelBody>
				<PanelBody title="Google">Google Goes Here</PanelBody> */}
            </PluginSidebar>
		</Fragment>
	);
}

registerPlugin('flash-briefing-preview', {
    icon: 'media-audio',
    render: FlashBriefingPreview,
});

// const PPPWraper = withSelect((select, ownProps) => {
//     console.log(ownProps);
//     return {
//         media: ownProps.value ? select('core').getMedia(ownProps.value) : null,
//     };
// })(PrePublishPlayer);

// registerPlugin('pre-publish-alexa-player', { render: PPPWraper });
