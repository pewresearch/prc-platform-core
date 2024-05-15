/**
 * External Dependencies
 */
import { EntityCreateNewModal } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useState, Fragment } from 'react';
import { Button } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import createHomepage from './create-homepage';
import { DEFAULT_CONTENT } from './constants';

// get today's date in MM/DD/YYYY format
const today = new Date().toLocaleDateString('en-US', {
	month: '2-digit',
	day: '2-digit',
	year: '2-digit',
});

export default function CreateNewHomepageModal({
	previewedHomepageId,
	setPreviewedHomepageId,
	clientId,
}) {
	const [active, setActive] = useState(false);
	const toggleActive = () => setActive(!active);

	return (
		<Fragment>
			<Button variant="secondary" onClick={toggleActive}>
				Create New Draft
			</Button>
			{active && (
				<EntityCreateNewModal
					{...{
						entityType: 'homepage',
						defaultTitle: `Homepage ${today}`,
						defaultContent: DEFAULT_CONTENT,
						onClose: () => {
							toggleActive();
						},
						onSubmit: (newTitle, defaultContent) => {
							createHomepage(
								newTitle,
								defaultContent,
								'draft'
							).then((response) => {
								console.log('then...', response);
								setPreviewedHomepageId(response.id);
								toggleActive();
							});
						},
					}}
				/>
			)}
		</Fragment>
	);
}
