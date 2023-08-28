/**
 * External Dependencies
 */
import { ungroup } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

/**
 * Internal Dependencies
 */
import { POST_TYPE } from './constants';

export default function DetachEntityMenuControl({ blocks, clientId }) {
	const { insertBlock, removeBlock } = useDispatch(blockEditorStore);

	const { canRemove, innerBlockCount } = useSelect(
		(select) => {
			const { canRemoveBlock, getBlockCount } = select(blockEditorStore);
			return {
				canRemove: canRemoveBlock(clientId),
				innerBlockCount: getBlockCount(clientId),
			};
		},
		[clientId]
	);

	return (
		<BlockControls>
			{canRemove && (
				<ToolbarGroup>
					<ToolbarButton
						onClick={() => {
							blocks.forEach((block) => {
								const newBlock = cloneBlock(block);
								insertBlock(newBlock);
							});
							removeBlock(clientId);
						}}
						label={`Detach ${innerBlockCount} blocks from synced ${POST_TYPE}`}
						icon={ungroup}
						showTooltip
					/>
				</ToolbarGroup>
			)}
		</BlockControls>
	);
}
