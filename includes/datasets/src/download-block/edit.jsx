/**
 * External Dependencies
 */
import classNames from 'classnames';
import { icons, Icon } from '@prc/icons';
import { getBlockGapSupportValue } from '@prc/block-utils';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
const ALLOWED_BLOCKS = [
	'core/button',
	'core/group',
];

const TEMPLATE = [['core/button', {}]];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { id, className, allowedBlocks } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: allowedBlocks || ALLOWED_BLOCKS,
			templateLock: false,
			template: TEMPLATE,
		},
	);

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
