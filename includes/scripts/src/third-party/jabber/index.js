/**
 * External Dependencies
 */
import jabber from 'jabber';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('jabber', jabber);
