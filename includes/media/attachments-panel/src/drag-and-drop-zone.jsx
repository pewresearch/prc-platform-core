/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { DropZone } from '@wordpress/components';
import { MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';

function DragAndDropZone() {
	const { onDropImage } = useAttachments();
	return (
		<MediaUploadCheck
			fallback={__(
				`Drag and drop your files here and they will be attached to this post.`
			)}
		>
			<DropZone
				onFilesDrop={(a) => onDropImage(a)}
				onHTMLDrop={(b) => console.log('onHTMLDrop...', b)}
				onDrop={(c) => console.log('onDrop...', c)}
			/>
		</MediaUploadCheck>
	);
}

export default DragAndDropZone;
