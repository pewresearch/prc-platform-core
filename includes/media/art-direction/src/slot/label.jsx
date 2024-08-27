/* eslint-disable max-lines-per-function */
/**
 * CSS Classes and Styling Forked from Gutenberg featured image component:
 * https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/editor/src/components/post-featured-image/index.js
 */

/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	FlexItem,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useArtDirection } from '../context';

export default function Label({ label, size }) {
	const { isImageSlotBordered, toggleImageSlotBordered, capitalize } =
		useArtDirection();
	const isChartArt = isImageSlotBordered(size);
	const labelText = useMemo(() => {
		return label || capitalize(size);
	}, [label, size, capitalize]);
	return (
		<Flex
			style={{
				alignItems: 'center',
				borderTop: '1px solid #eaeaea',
				height: '45px',
			}}
		>
			<FlexBlock>
				<strong>{labelText}</strong>
			</FlexBlock>

			<FlexItem>
				{('A2' === size || 'A3' === size || 'A4' === size) && (
					<ToggleControl
						__nextHasNoMarginBottom
						label="Border"
						onChange={() => toggleImageSlotBordered(size)}
						checked={isChartArt}
					/>
				)}
			</FlexItem>
		</Flex>
	);
}
