/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */
import { InnerBlocksAsSyncedContent } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { useBlockModules, useTaxonomyInfo } from './hooks';
import { POST_TYPE, POST_TYPE_LABEL } from './constants';

import InspectorControls from './inspector-controls';
import BlockAreaWizard from './block-area-wizard';
import BlockModuleCreate from './block-module-create';

export default function Edit({
	attributes,
	setAttributes,
	clientId,
	context,
}) {
	const { ref, blockAreaSlug, categorySlug: categorySlugRaw, inheritCategory } = attributes;
	const {templateSlug} = context;

	const [postStatus, setPostStatus] = useState('publish');
	const {setPostIds} = useDispatch('prc-platform/block-area-context');

	// Theres a lot going on here so we want to optimize performance as much as possible. Below are a lot of useMemo calls to memoize the values these happen in the order they are used in the component, do not change the order.

	const isCategoryTemplate = useMemo(() => {
		return undefined !== templateSlug && templateSlug.includes('category-');
	}, [templateSlug]);

	// Get the category, either from the category slug from the attributes or from the current template via site editor context.
	const categorySlug = useMemo(() => {
		if (true === inheritCategory && !categorySlugRaw && isCategoryTemplate) {
			return templateSlug.replace('category-', '');
		}
		return categorySlugRaw || false;
	}, [inheritCategory, categorySlugRaw, isCategoryTemplate, templateSlug]);

	const { blockAreaName, blockAreaId, categoryName, categoryId } = useTaxonomyInfo(
		blockAreaSlug,
		categorySlug
	);

	const blockArea = useMemo(() => {
		return {
			id: blockAreaId,
			name: blockAreaName,
			slug: blockAreaSlug,
		}
	}, [blockAreaId, blockAreaName, blockAreaSlug]);

	const category = useMemo(() => {
		return {
			id: categoryId,
			name: categoryName,
			slug: categorySlug,
		}
	}, [categoryId, categoryName, categorySlug]);

	const {blockModules, hasResolved, isResolving} = useBlockModules({
		enabled: true,
		blockAreaId: blockArea?.id,
		categoryId: category?.id,
		ref,
		args: { status: postStatus }
	});

	/**
	 * This gets the first id from the blockModules array and sets it as the blockModuleId.
	 */
	const blockModuleId = useMemo(() => {
		if (blockModules && blockModules.length) {
			return blockModules[0].id;
		}
		return null;
	}, [blockModules]);

	const blockModule = useMemo(() => {
		if (blockModuleId) {
			const match = blockModules.find((blockModule) => blockModule.id === blockModuleId);
			console.log("Matching block_module :", match, blockModules);
			return {
				id: blockModuleId,
				name: match?.title?.rendered,
				slug: match?.slug,
			}
		}
		return null;
	}, [blockModuleId, blockModules]);

	const blockProps = useBlockProps();

	const isInSetup = useMemo(() => {
		console.log("isInSetup", blockModuleId, ref, blockAreaSlug, categorySlug, attributes);
		if (null !== blockModuleId && ref) {
			return false;
		}
		if (!blockAreaSlug) {
			return true;
		}
		return false;
	}, [hasResolved, blockModuleId, blockAreaSlug, categorySlug, ref]);

	if (isInSetup) {
		return(
			<div {...blockProps}>
				<BlockAreaWizard
					{...{
						attributes,
						setAttributes,
						blockModules,
						isResolving,
						clientId,
						context,
						isCategoryTemplate,
					}}
				/>
			</div>
		);
	}

	return (
		<InnerBlocksAsSyncedContent {...{
			postId: blockModuleId,
			postType: POST_TYPE,
			postTypeLabel: POST_TYPE_LABEL,
			blockProps,
			clientId,
			allowDetach: true,
			isMissingChildren: () => {
				return(
					<BlockModuleCreate
						{...{
							blockAreaId,
							categoryId,
							setAttributes,
						}}
					/>
				);
			},
			collector: (newRecord) => {
				// The collector prop runs after all records have been fetched and can be used to pass data back up to the parent component or for this example post meta back up into the editor global data-store.
				if (newRecord) {
					const storyItemIds = newRecord?._story_item_ids;
					setPostIds(storyItemIds);
				}
			}
		}}>
			<InspectorControls
				{...{
					attributes,
					setAttributes,
					clientId,
					blockArea,
					category,
					blockModule,
					postStatus,
					setPostStatus,
				}}
			/>
		</InnerBlocksAsSyncedContent>
	);
}
