/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */

// Doesnt do much, the real magic is the block area context store.
export default function Edit({ clientId, context }) {
	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {});

	return <div {...innerBlockProps} />;
}
