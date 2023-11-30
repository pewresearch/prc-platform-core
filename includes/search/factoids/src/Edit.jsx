/* eslint-disable @wordpress/i18n-no-variables */
/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { withNotices, TextControl, Placeholder } from '@wordpress/components';
import { useMemo, useState, useEffect, Fragment } from '@wordpress/element';
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
import Controls from './Controls';

const POST_TYPE = 'factoid';
const POST_TYPE_LABEL = 'Factoid';

function SearchFactoidEdit({attributes, setAttributes, noticeUI, setNoticeUI, clientId, context}) {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const {
		queryId,
		query,
		queryContext,
		templateSlug,
		previewPostType,
	} = context;

	const queryArgs = useMemo(() => ({
		per_page: 1,
		context: 'view',
		orderby: 'date',
		order: 'desc',
		s: debouncedSearchTerm,
	}), [debouncedSearchTerm]);

	const { records, hasResolved } = useEntityRecords(
		'postType',
		POST_TYPE,
		queryArgs
	);

	const currentFactoidId = records?.[0]?.id;
	const isResolving = !hasResolved;
	const isMissing = hasResolved && !currentFactoidId;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		POST_TYPE,
		{ id: currentFactoidId }
	);

	const recursionKey = useMemo(() => {
		return JSON.stringify(currentFactoidId, POST_TYPE);
	}, [currentFactoidId]);

	const hasAlreadyRendered = useHasRecursion(recursionKey);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps({}, {
		value: blocks,
		onInput,
		onChange,
		renderAppender: blocks?.length
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<Fragment>
		<Controls {...{
			isMissing,
			searchTerm,
			setSearchTerm
		}}/>
		<div {...blockProps}>
			{hasAlreadyRendered && (
				<Warning>
					{__(`${POST_TYPE} cannot be rendered inside itself.`)}
				</Warning>
			)}

			{isMissing && (
				<Warning>
					{__(
						`A matching ${POST_TYPE_LABEL.toLocaleLowerCase()} could not be found. It may be unavailable at this time, or you have not published any factoids.`
					)}
				</Warning>
			)}

			{isResolving && (
				<Warning>
					{__(`Loading ${POST_TYPE_LABEL.toLocaleLowerCase()} …`)}
				</Warning>
			)}
			<RecursionProvider uniqueId={recursionKey}>
				{!isResolving && !isMissing && (
					<div {...innerBlocksProps} />
				)}
			</RecursionProvider>
		</div>
		</Fragment>
	);
}

export default withNotices(SearchFactoidEdit);
