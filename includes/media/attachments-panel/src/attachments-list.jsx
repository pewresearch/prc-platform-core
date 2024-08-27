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
				// alert the user that we will refresh in 3 minutes...
				alert(
					'Attachments have been reset. This page will refresh in 3 minutes. Do not navigate away from this page after clicking "OK".'
				);

				const confirmReload = confirm(
					'Click "OK" to set the refresh timer, we will refresh when the migration is complete. Do not navigate away from this page after clicking "OK".'
				);

				if (confirmReload) {
					setTimeout(() => {
						location.reload();
					}, 180000);
				}
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
	console.log({ filteredAttachments });

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

	return (
		<Fragment>
			<div
				style={{
					position: 'relative',
					padding: '1em',
				}}
			>
				<BaseControl
					id="prc-media-zone"
					label={__(
						'Drag and drop files to attach them to this post or manage existing attachments.',
						'prc-block-plugins'
					)}
					help={__(
						'Click on an image to select the desired size to insert into the editor. Alternatively, press "Shift + Click" an image to insert it at 640 pixels wide. To replace your selected image block, press "Opt + Click" on the desired image.'
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
			</div>
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
		</Fragment>
	);
}

export default AttachmentsList;
