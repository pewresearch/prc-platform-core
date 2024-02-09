/**
 * External Dependencies
 */
import { EntityPatternModal } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useState, Fragment } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

export default function PreviewSelectionModal({
	previewedHomepageId,
	setPreviewedHomepageId,
	clientId,
}) {
	const [active, setActive] = useState(false);
	const toggleActive = () => setActive(!active);

	return (
		<Fragment>
			<Button variant="secondary" onClick={toggleActive}>
				Preview Different Homepage
			</Button>
			{active && (
				<EntityPatternModal
					{...{
						title: __(
							'Preview an existing homepage',
							'prc-platform-homepages'
						),
						instructions: __(
							'Select a homepage to preview',
							'prc-platform-homepages'
						),
						entityType: 'homepage',
						entityTypeLabel: __(
							'Homepage',
							'prc-platform-homepages'
						),
						onSelect: (homepage) => {
							console.log("On select", homepage);
							setPreviewedHomepageId(homepage?.id);
						},
						onClose: () => {
							toggleActive();
						},
						status: 'draft',
						selectedId: previewedHomepageId,
						clientId,
					}}
				/>
			)}
		</Fragment>
	);
}
