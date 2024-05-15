/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { Modal, ButtonGroup, Button } from '@wordpress/components';

export default function AddChildModal({
	toggleAddChildModal,
	parentTitle,
	childTitle,
	onDeny,
	onConfirm,
}) {
	return (
		<Modal
			title={__(
				'Confirm Linking Child Post',
				'prc-platform-post-report-package'
			)}
			onRequestClose={() => {
				toggleAddChildModal(false);
			}}
		>
			<p>
				Link <strong>{decodeEntities(childTitle)}</strong> post to{' '}
				<strong>{decodeEntities(parentTitle)}</strong>?
			</p>
			<ButtonGroup>
				<Button variant="secondary" onClick={onDeny}>
					No
				</Button>
				<Button variant="primary" onClick={onConfirm}>
					Yes
				</Button>
			</ButtonGroup>
		</Modal>
	);
}
