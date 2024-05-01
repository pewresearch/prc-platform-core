/**
 * External Dependencies
 */
import classNames from 'classnames';
import { useKeyPress } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	BaseControl,
	Tooltip,
	SelectControl,
	Modal,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';

const IMAGE_SIZES = [
	{ label: '200 Wide', value: '200-wide' },
	{ label: '200 Wide', value: '200-wide' },
	{ label: '260 Wide', value: '260-wide' },
	{ label: '310 Wide', value: '310-wide' },
	{ label: '420 Wide', value: '420-wide' },
	{ label: '640 Wide', value: '640-wide' },
	{ label: '740 Wide', value: '740-wide' },
	{ label: '1400 Wide', value: '1400-wide' },
];

function Image({
	id,
	url,
	title,
	type,
	filename,
	alt,
	caption,
	editLink,
	attachmentLink,
}) {
	const { insertedImageIds, handleImageInsertion, handleImageReplacement } =
		useAttachments();
	const { selectBlock } = useDispatch(blockEditorStore);

	const isActive = Object.keys(insertedImageIds).includes(id.toString());
	const [modalActive, toggleModal] = useState(false);
	const leftShiftKeyPressed = useKeyPress('Shift');
	const leftOptKeyPressed = useKeyPress('Alt');
	const leftCommandKeyPressed = useKeyPress('metaKey');

	// const ref = useRef(null);

	// const handleRightClick = (ev) => {
	// 	ev.preventDefault();
	// 	alert('success!');
	// 	// Open image editor...
	// 	return false;
	// };

	// useEffect(() => {
	// 	const img = ref.current;
	// 	// subscribe event
	// 	img.addEventListener('contextmenu', handleRightClick, false);
	// 	return () => {
	// 		// unsubscribe event
	// 		img.removeEventListener('contextmenu', handleRightClick);
	// 	};
	// }, []);

	return (
		<BaseControl>
			<button
				type="button"
				key={id}
				className={classNames('prc-attachments-list__image', {
					'prc-attachments-list__image--in-use': isActive,
				})}
				onClick={() => {
					if (isActive) {
						selectBlock(insertedImageIds[id].clientId);
					} else if (leftShiftKeyPressed) {
						handleImageInsertion(id, url, '640-wide', alt, caption);
					} else if (leftOptKeyPressed) {
						handleImageReplacement(id, url, attachmentLink);
					} else if (leftCommandKeyPressed) {
						window.open(editLink, '_blank');
					} else {
						toggleModal(true);
					}
				}}
			>
				<img src={url} alt="A attachment in the editor" />
				<div>{title}</div>
			</button>
			{modalActive && (
				<Modal
					title={__('Insert Image Into Editor', 'prc-block-plugins')}
					onRequestClose={() => toggleModal(false)}
				>
					<SelectControl
						label="Select Image Size"
						value={null}
						options={IMAGE_SIZES}
						onChange={(newSize) =>
							handleImageInsertion(id, url, newSize, alt, caption)
						}
					/>
				</Modal>
			)}
		</BaseControl>
	);
}

export default Image;
