/**
 * External Dependencies
 */
import classnames from 'classnames';
import { Icon } from '@prc/icons';
/**
 * WordPress Dependencies
 */
import { Fragment, useMemo } from 'react';
import {
	useBlockProps,
	withColors,
	getColorClassName,
} from '@wordpress/block-editor';

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
 * @param {Object}   props                         Properties passed to the function.
 * @param {Object}   props.attributes              Available block attributes.
 * @param {Function} props.setAttributes           Function that updates individual attributes.
 * @param {Object}   props.context                 Context object with the block's context values.
 * @param {string}   props.clientId                Unique ID of the block.
 * @param            props.borderColor
 * @param            props.backgroundColor
 * @param            props.setBorderColor
 * @param            props.setBackgroundColor
 * @param            props.tokenBorderColor
 * @param            props.tokenBackgroundColor
 * @param            props.setTOkenBorderColor
 * @param            props.setTokenBackgroundColor
 * @param            props.setTokenBorderColor
 * @param {boolean}  props.isSelected              Whether or not the block is currently selected.
 *
 * @return {WPElement} Element to render.
 */
function Edit({
	attributes,
	setAttributes,
	context,
	clientId,
	isSelected,
	tokenBorderColor,
	tokenBackgroundColor,
	setTokenBorderColor,
	setTokenBackgroundColor,
}) {
	const blockProps = useBlockProps();

	const MemoizedCloseIcon = useMemo(() => <Icon icon="circle-xmark" />, []);
	const tokenClasses = classnames(
		'wp-block-prc-platform-facets-selected-tokens__token',
		`has-border-${tokenBorderColor.slug}-color`,
		`has-${tokenBackgroundColor.slug}-background-color`,
		{
			'has-border-color': tokenBorderColor.slug,
			'has-background-color': tokenBackgroundColor.slug,
		}
	);

	return (
		<Fragment>
			<Controls
				{...{
					attributes,
					setAttributes,
					context: false,
					clientId,
					colors: {
						tokenBorderColor,
						tokenBackgroundColor,
						setTokenBorderColor,
						setTokenBackgroundColor,
					},
				}}
			/>
			<ul {...blockProps}>
				<li>Filtering by:</li>
				<li className={tokenClasses}>
					<span>Topics: X, Y, Z</span>
					{MemoizedCloseIcon}
				</li>
				<li className={tokenClasses}>
					<span>Formats: X, Y, Z</span>
					{MemoizedCloseIcon}
				</li>
				<li className={tokenClasses}>
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

export default withColors({
	tokenBorderColor: 'color',
	tokenBackgroundColor: 'color',
})(Edit);
