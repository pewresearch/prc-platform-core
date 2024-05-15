/**
 * This file is used for internal embeds. Content from pewresearch.org embedded on pewresearch.org.
 */

/**
 * External Dependencies
 */
import domReady from '@wordpress/dom-ready';

domReady(() => {
	// get all the iframe elements that have an id that start with pewresearch-org-embed-xyz where xyz will be a post id
	const embeds = document.querySelectorAll('iframe[id^="pewresearch-org-embed-"]');
	// loop through the embeds and initialize the iFrameResize library
	embeds.forEach((embed) => {
		console.log('... embed ...', embed);
		iFrameResize(
			{
				bodyMargin: 0,
				bodyPadding: 0,
				heightCalculationMethod: 'taggedElement'
			},
			embed,
		);
	});
});
