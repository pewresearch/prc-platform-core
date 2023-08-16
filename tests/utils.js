/* eslint-disable import/prefer-default-export */

/**
 * Select block in editor by clicking on it.
 *
 * @param {string} className Class name to select by.
 */
export async function selectBlockByClassName(className) {
	// We have to select the page first and then the block inside.
	const pageSelector = '.amp-page-active';
	await page.waitForSelector(pageSelector);
	await page.click(pageSelector);

	const blockSelector = `.${className}`;
	await page.waitForSelector(blockSelector);
	await page.click(blockSelector);
}
