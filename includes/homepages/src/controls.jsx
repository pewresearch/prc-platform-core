/**
 * WordPress Dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import CreateNewHomepageModal from './create-new-homepage-modal';
import PreviewSelectionModal from './preview-selection-modal';

export default function Controls({
	previewedHomepageId,
	setPreviewedHomepageId,
	clientId,
}) {
	return (
		<InspectorControls>
			<PanelBody title="Homepage Options">
				<PanelRow>
					<PreviewSelectionModal
						{...{
							previewedHomepageId,
							setPreviewedHomepageId,
							clientId,
						}}
					/>
				</PanelRow>
				<PanelRow>
					<CreateNewHomepageModal
						{...{
							previewedHomepageId,
							setPreviewedHomepageId,
							clientId,
						}}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
}
