/**
 * External Dependencies
 */
import md5 from 'md5';

/**
 * WordPress Dependencies
 */
import {
	memo,
	useMemo,
	useState,
	useEffect,
	Fragment,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useInnerBlocksProps,
	store as blockEditorStore,
	Warning,
} from '@wordpress/block-editor';
import { Spinner, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

function InnerBlocksTemplateBlocks({
	allowedBlocks = [
		'core/post-title',
		'core/post-date',
		'core/post-excerpt',
		'core/group',
		'core/paragraph',
	],
	template,
}) {
	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks,
			template,
		}
	);
	return <div {...innerBlocksProps} />;
}

function InnerBlocksAsContextTemplatePreview({
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
}) {
	const blockPreviewProps = useBlockPreview({ blocks });

	// When clicking into the preview, set the active block context as whichever block you click on.
	const handleOnClick = () => {
		setActiveBlockContextId(blockContextId);
	};

	// Hide the preview when it is not the active block context.
	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<div
			{...blockPreviewProps}
			tabIndex={0}
			role="button"
			onClick={handleOnClick} // When clicking into a block preview this keeps the block active.
			onKeyDown={handleOnClick} // Ensures any keyboard event will keep this block active.
			style={style}
		/>
	);
}

const MemoziedInnerBlocksTemplatePreview = memo(
	InnerBlocksAsContextTemplatePreview
);

export function getInnerBlocksContextAsQuery(postType, perPage = 10) {
	const { records, isResolving } = useEntityRecords('postType', postType, {
		per_page: perPage,
		post_parent: 0, // exclude child posts
		context: 'view',
	});

	/**
	 * Constructs a context of blocks for each post.
	 */
	const blockContexts = useMemo(() => {
		if (!records || isResolving) {
			return [];
		}
		return records?.map((post) => {
			console.log('POST?', post);
			return {
				queryId: 0,
				postId: post.id,
				postType: post.type,
				props: post.props,
			};
		});
	}, [records, isResolving]);

	return { blockContexts, isResolving };
}

export function InnerBlocksAsContextTemplate({
	clientId,
	allowedBlocks,
	template,
	blockContexts,
	isResolving = true,
	loadingLabel = 'Loading...',
}) {
	const [activeBlockContextId, setActiveBlockContextId] = useState(null);

	const { blocks } = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore);
			return {
				blocks: getBlocks(clientId),
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (blockContexts.length > 0) {
			// Set the first block as active by default.
			const firstBlockContext = blockContexts[0];
			setActiveBlockContextId(md5(JSON.stringify(firstBlockContext)));
		}
	}, [blockContexts]);

	if (isResolving) {
		return (
			<Warning>
				<Flex align="center" gap="10px">
					<FlexBlock>{`${loadingLabel}`}</FlexBlock>
					<FlexItem>
						<Spinner />
					</FlexItem>
				</Flex>
			</Warning>
		);
	}

	// To avoid flicker when switching active block contexts, a preview is rendered
	// for each block context, but the preview for the active block context is hidden.
	// This ensures that when it is displayed again, the cached rendering of the
	// block preview is used, instead of having to re-render the preview from scratch.
	return (
		blockContexts &&
		blockContexts.map((blockContext, index) => {
			const contextId = md5(JSON.stringify(blockContext));
			const isVisible =
				contextId ===
				(activeBlockContextId || md5(JSON.stringify(blockContexts[0])));

			return (
				<BlockContextProvider
					key={`context-key--${index}`}
					value={blockContext}
				>
					{activeBlockContextId === null || isVisible ? (
						<InnerBlocksTemplateBlocks
							{...{
								allowedBlocks,
								template,
							}}
						/>
					) : null}
					<MemoziedInnerBlocksTemplatePreview
						blocks={blocks}
						blockContextId={contextId}
						setActiveBlockContextId={setActiveBlockContextId}
						isHidden={isVisible}
					/>
				</BlockContextProvider>
			);
		})
	);
}
