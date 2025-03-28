/**
 * External Dependencies
 */
import classnames from 'classnames';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('classnames', classnames);
// Alias for classnames
loadScript('classNames', classnames);
