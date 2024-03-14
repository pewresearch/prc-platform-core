/**
 * External Dependencies
 */
import { InnerBlocksAsContextTemplate } from '@prc/components';
import { getBlockGapSupportValue } from '@prc/block-utils';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
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
	const { facetName, facetType, facetLabel } = attributes;

	const blockProps = useBlockProps({
		className: `is-type-${facetType}`,
		style: {
			'--block-gap': getBlockGapSupportValue(attributes),
		},
	});

	const templateContexts = useMemo(() => {
		if (['dropdown', 'yearly', 'date_range'].includes(facetType)) {
			return [
				{
					label: 'Dropdown',
				},
			];
		}
		return [
			{
				label: 'Item 1',
			},
			{
				label: 'Item 2',
			},
			{
				label: 'Item 3',
			},
		];
	}, [facetType]);

	return (
		<Fragment>
			<Controls {...{ attributes, setAttributes, context, clientId }} />
			<div {...blockProps}>
				<RichText
					tagName="h5"
					placeholder={__('Facet Template', 'prc')}
					value={facetLabel}
					onChange={(value) => setAttributes({ facetLabel: value })}
					keepPlaceholderOnFocus
					className="wp-block-prc-platform-facet-template__label"
				/>
				<InnerBlocksAsContextTemplate
					{...{
						clientId,
						allowedBlocks: [
							'prc-block/form-input-checkbox',
							'prc-block/form-input-select',
						],
						blockContexts: templateContexts,
						isResolving: false,
						loadingLabel: 'Loading Facet...',
					}}
				/>
			</div>
		</Fragment>
	);
}
