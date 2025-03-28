/**
 * External Dependencies
 */
import * as d3v7 from 'd3';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('d3v7', d3v7);
