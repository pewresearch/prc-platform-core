/**
 * External Dependencies
 */
import {
	library,
	dom,
} from '@fortawesome/fontawesome-svg-core';
import { icons } from '@prc/icons';

/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';

library.add(icons);

domReady(() => {
	dom.i2svg();
	dom.watch();
});
