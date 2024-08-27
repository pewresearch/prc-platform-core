/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */
import { InspectorPopoutPanel } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { postFeaturedImage } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import { ProvideArtDirection, useArtDirection } from './context';
import ArtDirectionList from './art-direction-list';
import Slot from './slot';

function InspectorSidebar() {
	const { hasA1Image, allSlotsTheSame } = useArtDirection();

	return (
		<InspectorPopoutPanel
			title={__('Art Direction')}
			className="prc-platform-art-direction-panel"
			renderToggle={({ isOpen, onToggle }) => (
				<Slot
					{...{
						size: 'A1',
						labels: {
							label: 'Setup Art Direction',
							title: 'Select Art Direction Image',
							update: !allSlotsTheSame
								? 'Update Art Direction (Some Slots Differ)'
								: 'Update Art Direction',
							dropzone: 'Drop A1 Image',
							icon: postFeaturedImage,
						},
						onClick: hasA1Image ? onToggle : undefined, // If the A1 image already exists open the panel, otherwise allow the slot to do it's default action which is to open the media library.
						enableLabel: false,
						overlayActive: isOpen,
					}}
				/>
			)}
		>
			<ArtDirectionList />
		</InspectorPopoutPanel>
	);
}

export default function ProvideInspectorSidebar() {
	return (
		<ProvideArtDirection>
			<InspectorSidebar />
		</ProvideArtDirection>
	);
}
