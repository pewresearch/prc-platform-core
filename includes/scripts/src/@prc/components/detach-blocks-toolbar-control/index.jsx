/**
 * External Dependencies
 */
import { ungroup } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { useMemo } from 'react';
import { sprintf } from '@wordpress/i18n';
import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

export default function DetachBlocksToolbarControl({
	blocks,
	clientId,
	label = 'Detach %s blocks',
}) {
	const { replaceBlock } = useDispatch(blockEditorStore);

	const { canRemove, innerBlockCount, clientBlocks } = useSelect(
		(select) => {
			const { canRemoveBlock, getBlockCount, getBlocks } = select(blockEditorStore);
			return {
				canRemove: canRemoveBlock(clientId),
				innerBlockCount: getBlockCount(clientId),
				clientBlocks: blocks || getBlocks(clientId),
			};
		},
		[clientId]
	);

	const workingBlocks = useMemo(() => {
		const blocksToUse = blocks || clientBlocks;
		return blocksToUse.map((block) => cloneBlock(block));
	}, [blocks, clientBlocks]);

	return (
		<BlockControls>
			{canRemove && (
				<ToolbarGroup>
					<ToolbarButton
						onClick={() => replaceBlock(clientId, workingBlocks)}
						label={sprintf(label, innerBlockCount)}
						icon={ungroup}
						showTooltip
					/>
				</ToolbarGroup>
			)}
		</BlockControls>
	);
}
