/**
 * Public API for @prc/functions.
 * Re-exports all functions from their modules for a single entry point.
 */

export { ifMatchSetAttribute } from './attributes';
export { randomId } from './id';
export {
	getTerms,
	getTermsByLetter,
	getTermsAsOptions,
	getTermsAsTree,
	wpRestApiTermsToTree,
} from './terms';
export { tableToArray, arrayToCSV } from './table-csv';
export { getPostByUrl } from './post';
export { hexToRgb, getContrastingColorFromHex } from './color';
export { default as writeInterstitialMessage } from './interstitialMessageGenerator';
