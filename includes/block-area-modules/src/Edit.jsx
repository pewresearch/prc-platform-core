/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { withNotices } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
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
import useLatestBlockModule from './hooks/use-latest-block-module';
import { POST_TYPE, ALLOWED_BLOCKS } from './constants';

function SyncedEntityEdit({
	attributes,
	setAttributes,
	clientId,
	noticeOperations,
	noticeUI,
	context,
}) {
	const { query, queryId, postId, templateSlug } = context;
	const { blockAreaSlug, categorySlug } = attributes;
	const isNew = !blockAreaSlug;

	const hasAlreadyRendered = useHasRecursion(blockAreaSlug);

	const {records, hasResolved} = useLatestBlockModule(blockAreaSlug, categorySlug, {
		enabled: !isNew,
	});
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !records && !isNew;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		POST_TYPE,
		{ id: records?.[0]?.id }
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		value: blocks,
		onInput,
		onChange,
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
		return(
			<div {...blockProps}>
				<Placeholder
					{...{
						attributes,
						setAttributes,
						clientId,
						isResolving,
						isNew,
						context,
						noticeOperations,
					}}
				/>
			</div>
		);
	}

	return (
		<RecursionProvider uniqueId={blockAreaSlug}>
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
