/**
 * External Dependencies
 */
import enquire from 'enquire.js';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('enquire', enquire);
