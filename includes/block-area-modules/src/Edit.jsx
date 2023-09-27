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
import { Button } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import Controls from './Controls';
import PlaceholderWizard from './PlaceholderWizard';
import BlockModuleCreate from './BlockModuleCreate';
import LoadingIndicator from './LoadingIndicator';
import { useLatestBlockModule, useTaxonomyInfo } from './hooks';
import { POST_TYPE, POST_TYPE_LABEL } from './constants';

function BlockAreaEdit({
	attributes,
	setAttributes,
	clientId,
	noticeOperations,
	noticeUI,
	context,
}) {
	const { blockAreaSlug, categorySlug, inheritCategory } = attributes;

	const catSlug = useMemo(() => {
		if (true === inheritCategory && !categorySlug) {
			const { templateSlug } = context;
			if ( templateSlug.includes('category-') ) {
				return templateSlug.replace('category-', '');
			}
			// If we're just on a general template then use the uncategorized category.
			if ( templateSlug.includes('category') ) {
				return 'uncategorized';
			}
		}
		return undefined !== categorySlug ? categorySlug : false;
	}, [inheritCategory, categorySlug, context]);

	const { blockAreaName, blockAreaId, categoryName, categoryId } = useTaxonomyInfo(
		blockAreaSlug,
		catSlug
	);
	const {blockModuleId, hasResolved} = useLatestBlockModule(blockAreaId, categoryId, {
		enabled: undefined !== (blockAreaSlug && blockAreaId && categoryId)
	});

	const isResolving = useMemo(() => !hasResolved && undefined !== (blockAreaId && categoryId), [hasResolved, blockAreaId, categoryId]);
	const isMissing = useMemo(() => hasResolved && categoryId && blockAreaId && !blockModuleId, [hasResolved, categoryId, blockAreaId, blockModuleId]);
	const isLoading = useMemo(() => (isResolving && blockAreaId && categoryId) || (blockAreaId && categoryId && !blockModuleId), [isResolving, blockAreaId, categoryId, blockModuleId]);
	const isInSetup = useMemo(() => (!blockModuleId && !blockAreaSlug) || !catSlug, [blockModuleId, blockAreaSlug, catSlug]);

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

	useEffect(() => {
		console.log("INFO:", {
			isResolving,
			isMissing,
			isLoading,
			isInSetup: {
				isResolving,
				blockModuleId,
				blockAreaSlug,
				catSlug,
				test: (!blockModuleId && !blockAreaSlug) || !catSlug,
			},
		});
	}, [isResolving, isMissing, isLoading, isInSetup, blockModuleId, blockAreaSlug, catSlug]);

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
					<p>{__(`A matching ${POST_TYPE_LABEL.toLowerCase()} could not be found. It may have been deleted or is unavailable at this time.`)}</p>
					<BlockModuleCreate
						{...{
							blockAreaId,
							categoryId,
						}}
					/>
				</Warning>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div {...blockProps}>
				<Warning>
					<LoadingIndicator loading={true} label={__(`Loading ${blockAreaName} Block Area`, 'prc-platform-core')}/>
				</Warning>
			</div>
		);
	}

	if (isInSetup) {
		return(
			<div {...blockProps}>
				<PlaceholderWizard
					{...{
						attributes,
						setAttributes,
						clientId,
						isResolving,
						context,
						blockModuleId,
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
					setAttributes,
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

export default withNotices(BlockAreaEdit);
