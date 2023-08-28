/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { withNotices } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useEntityBlockEditor, useEntityRecord } from '@wordpress/core-data';
import {
	useInnerBlocksProps,
	__experimentalRecursionProvider as RecursionProvider,
	__experimentalUseHasRecursion as useHasRecursion,
	InnerBlocks,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import Controls from './Controls';
import Placeholder from './Placeholder';
import { POST_TYPE, ALLOWED_BLOCKS } from './constants';

function SyncedEntityEdit({
	attributes,
	setAttributes,
	clientId,
	noticeOperations,
	noticeUI,
	context,
}) {
	const { ref } = attributes;
	const isNew = !ref;
	const hasAlreadyRendered = useHasRecursion(ref);

	const { query, queryId, postId } = context;


	// Using the wp rest api lets query the most recent post from POST_TYPE with the


	const { record, hasResolved } = useEntityRecord('postType', POST_TYPE, ref);
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !record && !isNew;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		POST_TYPE,
		{ id: ref }
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		value: blocks,
		onInput,
		onChange,
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: blocks?.length
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	if (hasAlreadyRendered) {
		return (
			<div {...blockProps}>
				<Warning>
					{__(`${POST_TYPE} cannot be rendered inside itself.`)}
				</Warning>
			</div>
		);
	}

	if (isMissing) {
		return (
			<div {...blockProps}>
				<Warning>
					{__(` ${POST_TYPE}as been deleted or is unavailable.`)}
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
}

export default withNotices(SyncedEntityEdit);
