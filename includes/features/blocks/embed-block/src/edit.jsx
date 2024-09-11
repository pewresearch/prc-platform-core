//  WordPress Dependencies
import { __ } from '@wordpress/i18n';
import { withNotices } from '@wordpress/components';
import { useEntityBlockEditor, useEntityRecord } from '@wordpress/core-data';
import {
	useInnerBlocksProps,
	RecursionProvider,
	useHasRecursion,
	InnerBlocks,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';

// Internal Dependencies
import Placeholder from './placeholder';
import Controls from './controls';

const Edit = ({ attributes, setAttributes, clientId }) => {
	const { ref } = attributes;
	const isNew = !ref;
	const hasAlreadyRendered = useHasRecursion(ref);
	const { record, hasResolved } = useEntityRecord('postType', 'feature', ref);
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !record && !isNew;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'feature',
		{ id: ref }
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		value: blocks,
		onInput,
		onChange,
		allowedBlocks: ['prc-platform/feature-loader', 'core/group'],
		renderAppender: blocks?.length
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	if (hasAlreadyRendered) {
		return (
			<div {...blockProps}>
				<Warning>
					{__('Feature cannot be rendered inside itself.')}
				</Warning>
			</div>
		);
	}

	if (isMissing) {
		return (
			<div {...blockProps}>
				<Warning>
					{__('Feature has been deleted or is unavailable.')}
				</Warning>
			</div>
		);
	}

	if (isResolving || isNew) {
		return (
			<div {...blockProps}>
				<Placeholder
					{...{
						attributes,
						setAttributes,
						clientId,
						isResolving,
						isNew,
					}}
				/>
			</div>
		);
	}

	return (
		<RecursionProvider uniqueId={ref}>
			<Controls
				{...{
					attributes,
					clientId,
					blocks,
				}}
			/>
			<div {...innerBlocksProps} />
		</RecursionProvider>
	);
};

export default withNotices(Edit);
