/**
 * WordPress Dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './style.scss';
import { ProvideBylines } from './context';
import Acknowledgements from './Acknowledgements';
import Bylines from './Bylines';

// @TODO lets cosntruct  a new panel in place of the official bylines taxonomy panel
// see: https://github.com/WordPress/gutenberg/tree/9580b45e6e18dd06076af9f7e1ea66babee22bf5/packages/editor/src/components/post-taxonomies#custom-taxonomy-selector

function BylinesAndAcknowledgementsPanel() {
	return (
		<PluginDocumentSettingPanel name="prc-bylines" title={__('Bylines')}>
			<ProvideBylines>
				<Bylines />
				<Acknowledgements />
			</ProvideBylines>
		</PluginDocumentSettingPanel>
	);
}

dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-bylines');

registerPlugin('prc-bylines', {
	render: BylinesAndAcknowledgementsPanel,
	icon: null,
});
