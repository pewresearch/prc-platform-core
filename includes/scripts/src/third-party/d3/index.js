/**
 * External Dependencies
 */
import * as d3 from 'd3';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('d3', d3);
