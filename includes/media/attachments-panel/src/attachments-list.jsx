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

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';
import DragAndDropZone from './DragAndDropZone';
import Image from './Image';

function AttachmentsList() {
	const {
		attachments,
		loading,
		searchTerm,
		debouncedSearchTerm,
		setSearchTerm,
		mediaEditor,
	} = useAttachments();

	// Sort attachments by title
	const sortedAttachments = attachments.sort((a, b) => {
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
				.includes(debouncedSearchTerm.toLowerCase()),
	);

	return (
		<PanelBody
			title={__('Attached Images')}
			initialOpen
			className="prc-media-assets-panel"
		>
			<BaseControl
				label={__(
					'Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.',
					'prc-block-plugins',
				)}
			>
				{0 < attachments.length && (
					<Fragment>
						<Button variant="secondary" onClick={() => mediaEditor.open()}>
							Edit Attachments
						</Button>
						<CardDivider />
					</Fragment>
				)}
				<TextControl
					label={__('Search')}
					value={searchTerm}
					onChange={(value) => setSearchTerm(value)}
				/>
				<CardDivider />
				<DragAndDropZone />
				{loading ? (
					<Spinner />
				) : (
					filteredAttachments.map((image) => <Image {...image} />)
				)}
			</BaseControl>
		</PanelBody>
	);
}

export default AttachmentsList;
