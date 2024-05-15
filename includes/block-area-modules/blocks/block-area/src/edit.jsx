/* eslint-disable max-lines-per-function */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */
import { InnerBlocksAsSyncedContent } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useMemo, useState } from '@wordpress/element';
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

export default function Edit({ attributes, setAttributes, clientId, context }) {
	const {
		ref,
		blockAreaSlug,
		taxonomyName,
		taxonomyTermSlug,
		inheritTermFromTemplate,
	} = attributes;
	const { templateSlug } = context;

	const [postStatus, setPostStatus] = useState('publish');
	const { setPostIds } = useDispatch('prc-platform/block-area-context');

	// Theres a lot going on here so we want to optimize performance as much as possible. Below are a lot of useMemo calls to memoize the values these happen in the order they are used in the component, do not change the order.

	const isTaxonomyTemplate = useMemo(() => {
		return (
			undefined !== templateSlug &&
			templateSlug.includes(`${taxonomyName}-`)
		);
	}, [templateSlug]);

	// If we are inheriting the term from the template we need to set the term slug to the template slug.
	const taxTermSlug = useMemo(() => {
		if (
			true === inheritTermFromTemplate &&
			!taxonomyTermSlug &&
			isTaxonomyTemplate
		) {
			return templateSlug.replace(`${taxonomyName}-`, '');
		}
		return taxonomyTermSlug || false;
	}, [
		inheritTermFromTemplate,
		isTaxonomyTemplate,
		templateSlug,
		taxonomyTermSlug,
	]);

	const { blockAreaName, blockAreaId, taxonomyTermName, taxonomyTermId } =
		useTaxonomyInfo(blockAreaSlug, taxonomyName, taxTermSlug);

	const blockArea = useMemo(() => {
		return {
			id: blockAreaId,
			name: blockAreaName,
			slug: blockAreaSlug,
		};
	}, [blockAreaId, blockAreaName, blockAreaSlug]);

	const taxonomy = useMemo(() => {
		return {
			id: taxonomyTermId,
			name: taxonomyTermName,
			slug: taxonomyTermSlug,
		};
	}, [taxonomyTermId, taxonomyTermName, taxonomyTermSlug]);

	const { blockModules, hasResolved, isResolving } = useBlockModules({
		enabled: true,
		blockAreaId: blockArea?.id,
		taxonomyTermId: taxonomy?.id,
		taxonomyName,
		ref,
		args: { status: postStatus },
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
			const match = blockModules.find(
				(blockModule) => blockModule.id === blockModuleId
			);
			console.log('Matching block_module :', match, blockModules);
			return {
				id: blockModuleId,
				name: match?.title?.rendered,
				slug: match?.slug,
			};
		}
		return null;
	}, [blockModuleId, blockModules]);

	const blockProps = useBlockProps();

	const isInSetup = useMemo(() => {
		console.log(
			'isInSetup',
			blockModuleId,
			ref,
			blockAreaSlug,
			taxonomyName,
			taxonomyTermSlug,
			attributes
		);
		if (null !== blockModuleId && ref) {
			return false;
		}
		if (!blockAreaSlug) {
			return true;
		}
		return false;
	}, [hasResolved, blockModuleId, blockAreaSlug, taxonomyTermSlug, ref]);

	if (isInSetup) {
		return (
			<div {...blockProps}>
				<BlockAreaWizard
					{...{
						attributes,
						setAttributes,
						blockModules,
						isResolving,
						clientId,
						context,
						isTaxonomyTemplate,
					}}
				/>
			</div>
		);
	}

	return (
		<InnerBlocksAsSyncedContent
			{...{
				postId: blockModuleId,
				postType: POST_TYPE,
				postTypeLabel: POST_TYPE_LABEL,
				blockProps,
				clientId,
				allowDetach: true,
				isMissingChildren: () => (
					<BlockModuleCreate
						{...{
							blockAreaId,
							taxonomyName,
							taxonomyTermId,
							setAttributes,
						}}
					/>
				),
				collector: (newRecord) => {
					// The collector prop runs after all records have been fetched and can be used to pass data back up to the parent component or for this example post meta back up into the editor global data-store.
					if (newRecord) {
						const storyItemIds = newRecord?._story_item_ids;
						setPostIds(storyItemIds);
					}
				},
			}}
		>
			<InspectorControls
				{...{
					attributes,
					setAttributes,
					clientId,
					blockArea,
					taxonomy,
					blockModule,
					postStatus,
					setPostStatus,
				}}
			/>
		</InnerBlocksAsSyncedContent>
	);
}
