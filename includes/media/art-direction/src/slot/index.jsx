/* eslint-disable max-lines-per-function */
/**
 * CSS Classes and Styling Forked from Gutenberg featured image component:
 * https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/editor/src/components/post-featured-image/index.js
 */

/**
 * External Dependencies
 */
import { MediaImageSlot } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useArtDirection } from '../context';
import Label from './label';

export default function Slot({
	size,
	labels,
	onClick,
	overlayActive,
	enableLabel = true,
}) {
	const { getImageSlot, setImageSlot, capitalize } = useArtDirection();

	const image = useMemo(() => {
		return getImageSlot(size);
	}, [size, getImageSlot]);

	const id = useMemo(() => {
		return image ? image.id : null;
	}, [image]);

	const capitalizeSize = capitalize(size);

	return (
		<div className="prc-platform-art-direction__slot">
			{enableLabel && (
				<Label
					label={labels?.label || `${capitalizeSize}`}
					size={size}
				/>
			)}
			<MediaImageSlot
				{...{
					id,
					size,
					labels: labels || {
						label: `Edit ${capitalizeSize} Image Slot`,
						title: `Select ${capitalizeSize} Image`,
						update: `Update ${capitalizeSize} Image Slot`,
						dropzone: `Drop ${capitalizeSize}`,
					},
					onUpdate: (img) => {
						setImageSlot(img, size);
					},
					onClick,
					overlayActive,
				}}
			/>
		</div>
	);
}
