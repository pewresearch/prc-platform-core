/* eslint-disable @wordpress/i18n-no-variables */
/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { withNotices } from '@wordpress/components';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { useEntityBlockEditor, useEntityRecords } from '@wordpress/core-data';
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
import Controls from './controls';

const POST_TYPE = 'homepage';
const POST_TYPE_LABEL = 'Homepage';

function SyncedEntityEdit() {
	const [previewedHomepageId, setPreviewedHomepageId] = useState();
	const queryArgs = {
		per_page: 1,
		context: 'view',
		orderby: 'date',
		order: 'desc',
	};

	const { records, hasResolved } = useEntityRecords(
		'postType',
		POST_TYPE,
		queryArgs
	);

	const currentHomepageId = records?.[0]?.id;
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !currentHomepageId;

	useEffect(() => {
		if (!isMissing) {
			setPreviewedHomepageId(currentHomepageId);
		}
	}, [isMissing, currentHomepageId]);

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		POST_TYPE,
		{ id: previewedHomepageId }
	);

	const recursionKey = useMemo(() => {
		return JSON.stringify(previewedHomepageId, POST_TYPE);
	}, [previewedHomepageId]);

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
				<Controls
					{...{
						isMissing,
					}}
				/>
				<Warning>
					{__(
						`A matching ${POST_TYPE_LABEL.toLocaleLowerCase()} could not be found. It may be unavailable at this time, or you have not published any homepages. Please see the sidebar to create a new homepage.`
					)}
				</Warning>
			</div>
		);
	}

	if (isResolving) {
		return (
			<div {...blockProps}>
				<Warning>
					{__(`Loading ${POST_TYPE_LABEL.toLocaleLowerCase()} …`)}
				</Warning>
			</div>
		);
	}

	return (
		<RecursionProvider uniqueId={recursionKey}>
			<Controls
				{...{
					currentHomepageId,
					setPreviewedHomepageId,
					isMissing,
				}}
			/>
			<div {...innerBlocksProps} />
		</RecursionProvider>
	);
}

export default withNotices(SyncedEntityEdit);
