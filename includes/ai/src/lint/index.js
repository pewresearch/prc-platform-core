/**
 * Block stripping utility for AI document analysis.
 *
 * Produces a minimal representation of blocks for the analyze-document ability.
 * Strips non-content attributes to reduce token usage.
 *
 * @package PRC\Platform
 */

/**
 * Content attribute keys to preserve (in order of preference).
 */
const CONTENT_ATTRS = ['content', 'value', 'values', 'text', 'caption'];

/**
 * Extract a minimal attributes object with only content-bearing fields.
 *
 * @param {Object} attrs Block attributes.
 * @return {Object} Stripped attributes.
 */
function stripAttributes(attrs) {
	if (!attrs || typeof attrs !== 'object') return {};

	const stripped = {};
	for (const key of CONTENT_ATTRS) {
		if (attrs[key] !== undefined && attrs[key] !== null) {
			if (typeof attrs[key] === 'string') {
				stripped[key] = attrs[key];
			} else if (
				typeof attrs[key] === 'object' &&
				attrs[key] !== null &&
				attrs[key].originalHTML
			) {
				stripped[key] = attrs[key];
			} else if (Array.isArray(attrs[key])) {
				stripped[key] = attrs[key];
			}
		}
	}
	return stripped;
}

/**
 * Check if a block has any text content.
 *
 * @param {Object} block Block object.
 * @return {boolean} True if block has content.
 */
function hasContent(block) {
	const attrs = block?.attributes;
	if (!attrs) return false;

	const content = attrs.content;
	if (typeof content === 'string' && content.trim()) return true;
	if (typeof content === 'object' && content?.originalHTML?.trim())
		return true;
	if (typeof attrs.value === 'string' && attrs.value.trim()) return true;
	if (
		Array.isArray(attrs.values) &&
		attrs.values.some((v) => v?.content?.trim())
	)
		return true;
	if (typeof attrs.text === 'string' && attrs.text.trim()) return true;
	if (typeof attrs.caption === 'string' && attrs.caption.trim()) return true;

	return false;
}

/**
 * Strip a single block to minimal representation.
 *
 * @param {Object} block Block object.
 * @return {Object|null} Stripped block or null if empty and no inner blocks.
 */
function stripBlock(block) {
	if (!block?.clientId) return null;

	const strippedAttrs = stripAttributes(block.attributes);
	const inner = stripBlocks(block.innerBlocks ?? []);

	// Filter out blocks with no content and no inner blocks.
	if (Object.keys(strippedAttrs).length === 0 && inner.length === 0) {
		return null;
	}

	if (inner.length === 0 && !hasContent(block)) {
		return null;
	}

	return {
		clientId: block.clientId,
		name: block.name ?? 'core/unknown',
		attributes: strippedAttrs,
		innerBlocks: inner,
	};
}

/**
 * Recursively strip blocks to minimal JSON for AI analysis.
 *
 * @param {Object[]} blocks Block array from getBlocks().
 * @return {Object[]} Stripped blocks with clientId, name, attributes, innerBlocks.
 */
export function stripBlocks(blocks) {
	if (!Array.isArray(blocks)) return [];

	const result = [];
	for (const block of blocks) {
		const stripped = stripBlock(block);
		if (stripped) {
			result.push(stripped);
		}
	}
	return result;
}
