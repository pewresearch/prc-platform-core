import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { registerPlugin } from '@wordpress/plugins';
import { select, withSelect } from '@wordpress/data';
import { PluginPrePublishPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';
import AlexaPreview from './Components/AlexaPreview';
// import PrePublishPlayer from './Components/PrePublishPlayer';

const AlexaWrapper = withSelect((select) => {
    const blocks = select('core/editor').getBlocks();
    return {
        blockContent: blocks
            .map((block) => _.unescape(block.attributes.content))
            .join(' '),
    };
})(AlexaPreview);

registerPlugin('alexa-preview', {
    icon: 'media-audio',
    render: AlexaWrapper,
});

// const PPPWraper = withSelect((select, ownProps) => {
//     console.log(ownProps);
//     return {
//         media: ownProps.value ? select('core').getMedia(ownProps.value) : null,
//     };
// })(PrePublishPlayer);
// registerPlugin('pre-publish-alexa-player', { render: PPPWraper });
