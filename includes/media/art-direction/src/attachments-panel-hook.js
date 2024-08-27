/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { ProvideArtDirection } from './context';
import ArtDirectionList from './art-direction-list';

export default function renderAttachmentsPanelHook(AttachmentsPanel) {
	return () => (
		<Fragment>
			<AttachmentsPanel />
			<ProvideArtDirection>
				<PanelBody title="Art Direction" initialOpen={false}>
					<ArtDirectionList />
				</PanelBody>
			</ProvideArtDirection>
		</Fragment>
	);
}
