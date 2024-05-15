/**
 * External Dependencies
 */
import { MediaDropZone } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal Dependencies
 */

export default function DataDropZone({id, setNewId, disabled = false, children}) {
	return(
		<Fragment>
			<MediaDropZone {...{
				attachmentId: id,
				disabled,
				onUpdate: (attachment) => {
					if (typeof setNewId === 'function') {
						setNewId(attachment.id);
					}
				},
				onClear: () => {
					if (typeof setNewId === 'function') {
						setNewId(null);
					}
				},
				mediaType: ['text/csv', 'application/json'], // Machine readable formats only
				label: __('Drop or Select a Data File (CSV or JSON)'),
				singularLabel: __('Data File'),
			}}>
				<Button variant="primary">Modify Data File</Button>
			</MediaDropZone>
			{id && children}
		</Fragment>
	);
}
