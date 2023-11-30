/**
 * WordPress Dependencies
 */

/**
 * Finds a block in an array of blocks by its blockName attribute. Recursively searches innerBlocks 5 levels deep.
 * @param {Array} blocks
 * @param {string} wildcard
 * @param {number} depth
 * @return {Object|null}
 */
function findBlock(blocks, wildcard, depth = 0) {
	if (depth > 5) {
		return null;
	}

	for (let block of blocks) {
		if (block.blockName && new RegExp(wildcard.replace('*', '.*')).test(block.blockName)) {
		return block;
		}

		if (block.innerBlocks && block.innerBlocks.length > 0) {
		let innerBlock = findBlock(block.innerBlocks, wildcard, depth + 1);
		if (innerBlock !== null) {
			return innerBlock;
		}
		}
	}

	return null;
}

/**
 * Returns the proper css value for a block's gap attribute.
 * Remember to define styles.supports.spacing.blockGap in the block.json file AND
 * define styles.spacing.blockGap in the block's attributes (along with margin and padding if enabled) AND
 * lastly you'll also need to output the value manually like `style={{ 'gap': getBlockGapSupportValue(attributes) }}` in the block edit function.
 * @param {*} attributes
 * @returns string
 */
function getBlockGapSupportValue(attributes, dimensionToReturn = false) {
	let blockGap = attributes?.style?.spacing?.blockGap;
	if (typeof blockGap === 'object' && false !== dimensionToReturn) {
		let key = 'horizontal' === dimensionToReturn ? 'left' : 'top';
		blockGap = blockGap[key];
	}
	if (typeof blockGap !== 'string') {
		return '';
	}
	return blockGap?.startsWith('var:preset|spacing|') ? `var(--wp--preset--${blockGap.replace('var:preset|', '').replace('|', '--')})` : blockGap;
}

export {
	getBlockGapSupportValue,
	findBlock
}

