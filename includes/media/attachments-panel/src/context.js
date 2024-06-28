/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress dependencies
 */
import {
	useState,
	useContext,
	createContext,
	useEffect,
	useMemo,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { store as editorStore } from '@wordpress/editor';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { uploadMedia } from '@wordpress/media-utils';

const attachmentsContext = createContext();

// eslint-disable-next-line no-undef
const { media } = window.wp;

function useProvideAttachments() {
	const {
		postId,
		postType,
		imageBlocks = [],
		coverBlocks = [],
		chartBlocks = [],
		videoBlocks = [],
		getBlockInsertionPoint,
		selectedBlockClientId,
		selectedBlockIsImageBlock,
		selectedBlockAttrs,
	} = useSelect(
		(select) => ({
			postType: select(editorStore).getCurrentPostType(),
			postId: select(editorStore).getCurrentPostId(),
			imageBlocks: select(blockEditorStore)
				.getBlocks()
				.filter((block) => 'core/image' === block.name),
			coverBlocks: select(blockEditorStore)
				.getBlocks()
				.filter(
					(block) =>
						'core/cover' === block.name &&
						'image' === block.attributes.backgroundType
				),
			getBlockInsertionPoint:
				select(blockEditorStore).getBlockInsertionPoint,
			selectedBlockClientId:
				select(blockEditorStore).getSelectedBlockClientId(),
			selectedBlockIsImageBlock:
				select(blockEditorStore).getSelectedBlock()?.name ===
				'core/image',
			selectedBlockAttrs:
				select(blockEditorStore).getSelectedBlock()?.attributes,
		}),
		[]
	);
	const { insertBlock, replaceBlock } = useDispatch(blockEditorStore);

	const [selected, setSelected] = useState(null);
	const [attachments, setAttachments] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [processing, toggleProcessing] = useState(false);
	const [loading, toggleLoading] = useState(true);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	const updateAttachments = () => {
		if ('number' === typeof postId && false === processing) {
			toggleProcessing(true);
			apiFetch({
				path: `/prc-api/v3/attachments-panel/get/${postId}`,
			}).then((data) => {
				console.log(
					'Objects found in attachments rest request...',
					data
				);
				setAttachments([...data]);
				toggleProcessing(false);
			});
		}
	};

	const onDropImage = (filesList) => {
		console.log('onDropImage', filesList, postId);
		// We need to ensure that the parent is set before or after uploading...
		uploadMedia({
			allowedTypes: ['image'],
			filesList,
			additionalData: {
				post: postId,
			},
			onFileChange(a) {
				console.log('onFileChange', a);
				updateAttachments();
			},
			onError(message) {
				console.error(message);
			},
			wpAllowedMimeTypes: {
				png: 'image/png',
				'jpg|jpeg|jpe': 'image/jpeg',
				webp: 'image/webp',
			},
		});
	};

	const handleImageInsertion = (id, url, size, alt, caption) => {
		const insertionIndex = getBlockInsertionPoint().index;
		const newImageBlock = createBlock('core/image', {
			id,
			url,
			sizeSlug: size,
			alt,
			caption,
		});
		insertBlock(newImageBlock, insertionIndex);
	};

	const handleImageReplacement = (id, url, attachmentLink, alt, caption) => {
		// Check that what we're replacing is actually an image.
		if (selectedBlockIsImageBlock) {
			// get the attachment page
			// get the sizeSlug from the existing block if it exists..., otherwise default to 640-wide
			const sizeSlug = selectedBlockAttrs.sizeSlug || '310-wide';
			const attrs = selectedBlockAttrs;
			attrs.id = id;
			attrs.url = url;
			attrs.sizeSlug = sizeSlug;
			attrs.alt = alt;
			attrs.caption = caption;
			if (attachmentLink) {
				attrs.href = attachmentLink;
			}
			const newImageBlock = createBlock('core/image', { ...attrs });
			replaceBlock(selectedBlockClientId, newImageBlock);
		}
	};

	const mediaEditor = useMemo(() => {
		return media({
			title: 'Edit Attachments',
			button: {
				text: 'Update',
			},
			library: {
				uploadedTo: postId,
				selected: [selected],
			},
		});
	}, [postId, selected]);

	// When the media library closes, refresh the attachments.
	mediaEditor.on('close', () => {
		updateAttachments();
	});

	const openMediaLibrary = (attachmentId = null) => {
		// set the selected to...
		setSelected(attachmentId);
		mediaEditor.open();
		mediaEditor.on('close', () => {
			setSelected(null);
		});
	};

	const insertedImageIds = useMemo(() => {
		console.log(
			'mergeBlocksAndReturnIdClientPairs for insertedImageIds...',
			coverBlocks,
			imageBlocks
		);
		const imageBlockIds = {};
		if (0 !== imageBlocks.length) {
			imageBlocks.forEach((block) => {
				imageBlockIds[block.attributes.id] = {
					clientId: block.clientId,
				};
			});
		}
		const coverBlockIds = {};
		if (0 !== coverBlocks.length) {
			coverBlocks.forEach((block) => {
				coverBlockIds[block.attributes.id] = {
					clientId: block.clientId,
				};
			});
		}

		// merge the imageBlockIds and coverBlockIds objects into one object
		return { ...imageBlockIds, ...coverBlockIds };
	}, [coverBlocks, imageBlocks]);

	/**
	 * Checks for unused images attached to the post but not present in the editor.
	 * This is just to let the user know that they have unused images.
	 */
	const flashPrePublishWarning = useMemo(() => {
		console.log('insertedImageIds has changed');
		if (0 < attachments.length) {
			const aIds = attachments.map((d) => d.id);
			const iIds = Object.keys(insertedImageIds);

			// If there are any values from aIds that are not in iIds, then we have an unused image so return true.
			if (0 < aIds.filter((a) => !iIds.includes(a.toString())).length) {
				return true;
			}
			return false;
		}
		return false;
	}, [attachments, insertedImageIds]);

	/**
	 * When imageids change or on init update attachments.
	 */
	useEffect(() => {
		console.log("attachments' effect...");
		updateAttachments();
	}, [postId]);

	/**
	 * Handle toggling the loading state.
	 */
	useEffect(() => {
		if (0 < attachments.length) {
			toggleLoading(false);
		} else {
			toggleLoading(true);
		}
	}, [attachments]);

	return {
		postId,
		postType,
		insertedImageIds,
		attachments,
		loading,
		flashPrePublishWarning,
		searchTerm,
		debouncedSearchTerm,
		setSearchTerm,
		onDropImage,
		handleImageInsertion,
		handleImageReplacement,
		mediaEditor,
		openMediaLibrary,
	};
}

// Hook for child components to get the context object ...
// ... and re-render when it changes.
const useAttachments = () => useContext(attachmentsContext);

// Available to any child component that calls useAttachments()
function ProvideAttachments({ children }) {
	const provider = useProvideAttachments();
	return (
		<attachmentsContext.Provider value={provider}>
			{children}
		</attachmentsContext.Provider>
	);
}

export { ProvideAttachments, useAttachments };
export default ProvideAttachments;
