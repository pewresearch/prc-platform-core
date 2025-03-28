/**
 * External Dependencies
 */
import * as CSV from 'comma-separated-values';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('CSV', CSV);
