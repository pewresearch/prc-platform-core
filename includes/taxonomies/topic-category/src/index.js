/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';

/**
 * Change the "post publish" panel text to reflect the new Topic name for Categories.
 */
domReady(() => {
	addFilter(
		'i18n.gettext_default',
		'prc-platform/i18n',
		( translation, text, domain ) => {
			if ( text === 'Assign a category' ) {
				return 'Assign a topic';
			}
			if ( text === 'Categories provide a helpful way to group related posts together and to quickly tell readers what a post is about.' ) {
				return 'Topics provide a helpful way to group related posts together and to quickly tell readers what a post is about.';
			}
			return translation;
		}
	);
});
