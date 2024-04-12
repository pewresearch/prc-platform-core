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

const fetchImagesFromLegacyContent = (postId, postType = 'post') => {
	// using getEntityRecord from select('core') lets get the meta for this postId and then get the dt_original_post_id and dt_original_blog_id from that and set them as legacyPostId and legacyBlogId accordingly...
	let legacyPostId = 0;
	let legacyBlogId = 0;

	const post = select('core').getEntityRecord('postType', postType, postId);
	if (post) {
		console.log('post...', post.meta?.dt_original_post_id);
		legacyPostId = post.meta?.dt_original_post_id;
		legacyBlogId = post.meta?.dt_original_blog_id;
	}
	// Make a request to the WordPress REST API
	fetch(
		`https://prc-platform.vipdev.lndo.site/religion/wp-json/wp/v2/posts/${legacyPostId}?_fields=content`
	)
		.then((response) => response.json())
		.then((data) => {
			const imagesArray = [];
			const content = data.content.rendered;
			const parser = new DOMParser();
			const htmlDoc = parser.parseFromString(content, 'text/html');
			const figures = htmlDoc.querySelectorAll('figure');

			figures.forEach((figure) => {
				const img = figure.querySelector('img');
				if (img) {
					const src = img.getAttribute('src');
					const figureClass = figure.getAttribute('class');
					const aTag = figure.querySelector('a');

					let id;
					const regexClass = /wp-image-(\d+)/;
					const matchClass = figureClass.match(regexClass);
					if (matchClass) {
						id = matchClass[1];
					} else {
						const rel = aTag ? aTag.getAttribute('rel') : null;
						const regexRel = /wp-att-(\d+)/;
						const matchRel = rel ? rel.match(regexRel) : null;
						if (matchRel) {
							id = matchRel[1];
						}
					}

					if (id) {
						imagesArray.push({ src, id });
					}
				}
			});

			console.log('images inside content...', imagesArray);
			if (0 < imagesArray.length) {
				loadListOfImageUrlsIntoMediaLibrary(imagesArray, postId)
					.then((success) => console.log('success', success))
					.catch((error) => console.error('error', error));
			}
		})
		.catch((error) => console.error(error));
};

const loadListOfImageUrlsIntoMediaLibrary = (
	imagesArray,
	postId,
	whenDone = () => {}
) => {
	console.log(
		'imagesArray...',
		imagesArray.map((image) => image.src)
	);
	return new Promise((resolve, reject) => {
		apiFetch({
			path: '/prc-api/v3/migration-tools/migrate-attachments',
			method: 'POST',
			data: {
				urls: imagesArray.map((image) => image.src),
				postId,
			},
		})
			.then((data) => {
				resolve(data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

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
				<Button
					isDestructive
					onClick={() => {
						fetchImagesFromLegacyContent(postId);
					}}
				>
					Copy Attachments From Legacy
				</Button>
			</PanelBody>
		</Fragment>
	);
}

export default AttachmentsList;
