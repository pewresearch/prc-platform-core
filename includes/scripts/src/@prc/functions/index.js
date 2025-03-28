import {
	getTerms,
	getTermsByLetter,
	getTermsAsOptions,
	getTermsAsTree,
	ifMatchSetAttribute,
	randomId,
	arrayToCSV,
	tableToArray,
	wpRestApiTermsToTree,
	getPostByUrl,
	getContrastingColorFromHex,
} from './functions';
import writeInterstitialMessage from './interstitialMessageGenerator';

function loadScript(slug, script) {
	if (!window.prcFunctions[slug]) {
		window.prcFunctions[slug] = script;
	}
}

window.prcFunctions = {};

loadScript('getTerms', getTerms);
loadScript('getTermsByLetter', getTermsByLetter);
loadScript('getTermsAsOptions', getTermsAsOptions);
loadScript('getTermsAsTree', getTermsAsTree);
loadScript('ifMatchSetAttribute', ifMatchSetAttribute);
loadScript('randomId', randomId);
loadScript('arrayToCSV', arrayToCSV);
loadScript('tableToArray', tableToArray);
loadScript('wpRestApiTermsToTree', wpRestApiTermsToTree);
loadScript('getPostByUrl', getPostByUrl);
loadScript('writeInterstitialMessage', writeInterstitialMessage);
loadScript('getContrastingColorFromHex', getContrastingColorFromHex);

console.log('Loading @prc/functions...', window.prcFunctions);
