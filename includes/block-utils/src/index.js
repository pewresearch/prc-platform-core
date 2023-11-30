/**
 * Internal Dependencies
 */
import {
	getBlockGapSupportValue,
	findBlock,
} from './utils.js';

function loadScript(slug, script) {
	if (!window.prcBlockUtils[slug]) {
		window.prcBlockUtils[slug] = script;
	}
}

window.prcBlockUtils = {};
loadScript('getBlockGapSupportValue', getBlockGapSupportValue);
loadScript('findBlock', findBlock);
