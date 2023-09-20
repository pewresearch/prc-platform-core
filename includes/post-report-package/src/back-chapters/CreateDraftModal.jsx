/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { store as coreDataStore } from '@wordpress/core-data';
import { Modal, ButtonGroup, Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

export default function CreateDraftModal({toggleCreateDraftModal, parentTitle, onDeny, onConfirm}) {
	const { saveEntityRecord } = useDispatch( coreDataStore );
	const [postTitle, setPostTitle] = useState('');

	const createPost = async () => {
		const newDraftPost = await saveEntityRecord(
			'postType',
			'page',
			{
				title: postTitle,
				status: 'draft',
			}
		);
		if ( newDraftPost ) {
			console.log('newDraftPost', newDraftPost);
			// onConfirm(newDraftPost?.id);
		}
	}

	return(
		<Modal
			title={__('Create New Draft Back Chapter', 'prc-platform-post-report-package')}
			onRequestClose={()=>{toggleCreateDraftModal(false)}}
		>
			<p>Create a new draft back chapter for <strong>{decodeEntities(parentTitle)}</strong>?</p>
			<TextControl
				label={__('Back Chapter Title', 'prc-platform-post-report-package')}
				value={postTitle}
				onChange={setPostTitle}
			/>
			<Button variant="primary" onClick={createPost}>Create Draft</Button>

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
