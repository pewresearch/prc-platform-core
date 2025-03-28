/**
 * External Dependencies
 */
import * as d3 from 'd3';
import * as d3GeoProjection from 'd3-geo-projection';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('d3GeoProjection', d3GeoProjection);
