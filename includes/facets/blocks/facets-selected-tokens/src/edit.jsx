/**
 * External Dependencies
 */
import { Icon } from '@prc/icons';
/**
 * WordPress Dependencies
 */
import { Fragment, useMemo } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import Controls from './controls';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 * @param {Object}   props.context       Context object with the block's context values.
 * @param {string}   props.clientId      Unique ID of the block.
 * @param {boolean}  props.isSelected    Whether or not the block is currently selected.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({
	attributes,
	setAttributes,
	context,
	clientId,
	isSelected,
}) {
	const blockProps = useBlockProps();

	const MemoizedCloseIcon = useMemo(() => <Icon icon="circle-xmark" />, []);

	return (
		<Fragment>
			<Controls {...{ attributes, setAttributes, context: false }} />
			<ul {...blockProps}>
				<li className="wp-block-prc-platform-facets-selected-tokens__pager">
					Displaying 1-10 of 20 results
				</li>
				<li>Filtering by:</li>
				<li className="wp-block-prc-platform-facets-selected-tokens__token">
					<span>Topics: X, Y, Z</span>
					{MemoizedCloseIcon}
				</li>
				<li className="wp-block-prc-platform-facets-selected-tokens__token">
					<span>Formats: X, Y, Z</span>
					{MemoizedCloseIcon}
				</li>
				<li className="wp-block-prc-platform-facets-selected-tokens__token">
					<span>Year: 2021</span>
					{MemoizedCloseIcon}
				</li>
				<li>
					<span>Reset</span>
					{MemoizedCloseIcon}
				</li>
			</ul>
		</Fragment>
	);
}
