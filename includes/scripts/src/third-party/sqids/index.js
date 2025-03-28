/**
 * External Dependencies
 */
import Sqids from 'sqids';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('sqids', Sqids);
