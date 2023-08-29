/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { withNotices } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { useEntityBlockEditor } from '@wordpress/core-data';
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
import { useLatestBlockModule, useTaxonomyInfo } from './hooks';
import { LoadingIndicator } from './utils';
import { POST_TYPE } from './constants';

function SyncedEntityEdit({
	attributes,
	setAttributes,
	clientId,
	noticeOperations,
	noticeUI,
	context,
}) {
	const { query, queryId, postId, templateSlug } = context;
	const { blockAreaSlug, categorySlug, inheritCategory } = attributes;
	const isNew = !blockAreaSlug;
	let catSlug = categorySlug;

	if (inheritCategory && !categorySlug) {
		const { templateSlug } = context;
		if ( templateSlug.includes('category') ) {
			catSlug = templateSlug.replace('category-', '');
		}
	}

	const { blockAreaName, blockAreaId, categoryName, categoryId } = useTaxonomyInfo(
		blockAreaSlug,
		catSlug
	);

	console.log("tax info...", {blockAreaName, blockAreaId, categoryName, categoryId});

	const {blockModuleId, hasResolved } = useLatestBlockModule(blockAreaId, categoryId, {
		enabled: !isNew,
	});
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !blockModuleId && !isNew;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		POST_TYPE,
		{ id: blockModuleId }
	);

	const recursionKey = useMemo(() => {
		return JSON.stringify({blockModuleId, blockAreaSlug});
	}, [blockModuleId, blockAreaSlug]);

	const hasAlreadyRendered = useHasRecursion(recursionKey);

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
					{__(` ${POST_TYPE} been deleted or is unavailable.`)}
				</Warning>
			</div>
		);
	}

	if (isResolving && !isNew) {
		return (
			<div {...blockProps}>
				<Warning>
					<LoadingIndicator loading={true} label={__(`Loading ${blockAreaName} Block Area`, 'prc-platform-core')}/>
				</Warning>
			</div>
		);
	}

	if (isResolving && isNew) {
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
		<RecursionProvider uniqueId={recursionKey}>
			<Controls
				{...{
					attributes,
					clientId,
					blocks,
					blockAreaId,
					blockModuleId,
				}}
			/>
			<div {...innerBlocksProps} />
		</RecursionProvider>
	);
}

export default withNotices(SyncedEntityEdit);
