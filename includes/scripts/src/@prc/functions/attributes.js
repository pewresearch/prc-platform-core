/**
 * Sets a block attribute when needle matches haystack.
 *
 * @param {*}        needle        Value to compare.
 * @param {*}        haystack      Value to compare against.
 * @param {string}   attrKey       Attribute key to set.
 * @param {*}        attrValue     Value to set.
 * @param {Function} setAttributes Block setAttributes callback.
 */
function ifMatchSetAttribute(
	needle,
	haystack,
	attrKey,
	attrValue,
	setAttributes
) {
	if (needle === haystack) {
		setAttributes({ [attrKey]: attrValue });
	}
}

export { ifMatchSetAttribute };
