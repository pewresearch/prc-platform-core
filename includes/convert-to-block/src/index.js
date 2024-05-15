/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';

/**
 * Internal Dependencies
 */
import tweetable from './transforms/shortcode-tweetable';

domReady(() => {
	tweetable();
});
