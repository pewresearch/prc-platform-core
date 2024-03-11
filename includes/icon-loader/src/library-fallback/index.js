/**
 * External Dependencies
 */
import { icon } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

/**
 * Because this script is enqueue later than the prc-icon-library we want to check if the prcIcons object exists without claiming it as a script dependency in the webpack.config.js. This will allow us to create a fallback for the prcIcons object if it doesn't exist.
 */
if (!window.prcIcons) {
	window.prcIcons = {
		icons: {},
		icon,
		Icon,
	};
}
