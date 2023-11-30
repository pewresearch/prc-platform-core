/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { useBlockProps, useInnerBlocksProps, BlockContextProvider } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */

// Doesnt do much, the real magic is the block area context store.
export default function Edit({
	clientId,
	context,
}) {
	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {});
	
	return <div {...innerBlockProps}/>
}