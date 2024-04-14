/**
 * External Dependencies
 */
import { imgSrcToBlob } from 'blob-util';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	BaseControl,
	PanelBody,
	Spinner,
	TextControl,
	CardDivider,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, select } from '@wordpress/data';
import { uploadMedia } from '@wordpress/media-utils';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';
import DragAndDropZone from './drag-and-drop-zone';
import Image from './image';
import File from './file';

function resetAttachmentsMigration(postId) {
	console.log(`resetAttachmentsMigration(${postId}):`);
	apiFetch({
		path: '/prc-api/v3/migration-tools/migrate-attachments/',
		method: 'POST',
		data: {
			postId,
		},
	})
		.then((data) => {
			console.log(data);
			if (data.success) {
				window.location.reload();
			}
		})
		.catch((error) => {
			console.error(error);
		});
}

function Images() {
	const { attachments, loading, debouncedSearchTerm } = useAttachments();

	const images = attachments.filter((attachment) =>
		attachment.type.startsWith('image/')
	);
	// Sort attachments by title
	const sortedAttachments = images.sort((a, b) => {
		if (a.title.toLowerCase() < b.title.toLowerCase()) {
			return -1;
		}
		if (a.title.toLowerCase() > b.title.toLowerCase()) {
			return 1;
		}
		return 0;
	});

	const filteredAttachments = sortedAttachments.filter(
		(attachment) =>
			'' === debouncedSearchTerm ||
			attachment.title
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase())
	);

	return (
		<div>
			{loading ? (
				<Spinner />
			) : (
				filteredAttachments.map((image) => <Image {...image} />)
			)}
		</div>
	);
}

function Files() {
	const { attachments, loading, debouncedSearchTerm } = useAttachments();

	const files = attachments.filter((attachment) =>
		attachment.type.startsWith('application/')
	);
	// Sort attachments by title
	const sortedAttachments = files.sort((a, b) => {
		if (a.title.toLowerCase() < b.title.toLowerCase()) {
			return -1;
		}
		if (a.title.toLowerCase() > b.title.toLowerCase()) {
			return 1;
		}
		return 0;
	});

	// Filter attachments by title and filename.
	const filteredAttachments = sortedAttachments.filter(
		(attachment) =>
			'' === debouncedSearchTerm ||
			attachment.title
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase()) ||
			attachment.name
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase())
	);

	return (
		<div>
			{loading ? (
				<Spinner />
			) : (
				filteredAttachments.map((file) => <File {...file} />)
			)}
		</div>
	);
}

function AttachmentsList() {
	const { attachments, searchTerm, setSearchTerm, mediaEditor } =
		useAttachments();
	const postId = useSelect((select) =>
		select('core/editor').getCurrentPostId()
	);

	return (
		<Fragment>
			<PanelBody
				title={__('Attachments')}
				initialOpen
				className="prc-attachments-list"
			>
				<BaseControl
					id="prc-media-zone"
					label={__(
						'Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.',
						'prc-block-plugins'
					)}
				>
					{0 < attachments.length && (
						<Fragment>
							<Button
								variant="secondary"
								onClick={() => mediaEditor.open()}
							>
								Edit Attachments
							</Button>
							<CardDivider />
						</Fragment>
					)}
					<TextControl
						label={__('Filter Attachments')}
						value={searchTerm}
						onChange={(value) => setSearchTerm(value)}
					/>
					<DragAndDropZone />
				</BaseControl>
			</PanelBody>
			<PanelBody
				title={__('Images')}
				initialOpen={attachments.length > 0}
				className="prc-attachments-list__images"
			>
				<Images />
			</PanelBody>
			<PanelBody
				title={__('Files')}
				className="prc-attachments-list__files"
				initialOpen={false}
			>
				<Files />
			</PanelBody>
			<PanelBody
				title={__('Danger Zone')}
				className="prc-attachments-list__danger-zone"
				initialOpen={false}
			>
				<BaseControl
					label="Reset Attachments"
					help="If there are attachments present on this post we will only add new attachments. Otherwise, all attachments from the legacy post will be copied to this post."
					id="prc-reset-attachments"
				>
					<Button
						isDestructive
						onClick={() => {
							resetAttachmentsMigration(postId);
						}}
					>
						Copy Attachments From Legacy
					</Button>
				</BaseControl>
			</PanelBody>
		</Fragment>
	);
}

export default AttachmentsList;
