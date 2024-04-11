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
	TabPanel,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';
import DragAndDropZone from './drag-and-drop-zone';
import Image from './image';
import File from './file';

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
				filteredAttachments.map((file) => <File {...file} />)
			)}
		</div>
	);
}

function AttachmentsList() {
	const { attachments, searchTerm, setSearchTerm, mediaEditor } =
		useAttachments();

	return (
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
				<CardDivider />
				<DragAndDropZone />
				<TabPanel
					className="prc-attachments-tabs"
					activeClass="active-tab"
					onSelect={(tabName) => {
						console.log('Selecting tab', tabName);
					}}
					tabs={[
						{
							name: 'images',
							title: 'Images',
							className: 'tab-images',
						},
						{
							name: 'files',
							title: 'Files',
							className: 'tab-files',
						},
					]}
				>
					{(tab) => {
						switch (tab.name) {
							case 'images':
								return <Images />;
							case 'files':
								return <Files />;
						}
					}}
				</TabPanel>
			</BaseControl>
		</PanelBody>
	);
}

export default AttachmentsList;
