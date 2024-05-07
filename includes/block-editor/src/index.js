/**
 * WordPress Dependencies:
 */
import domReady from '@wordpress/dom-ready';
import { select, subscribe, dispatch } from '@wordpress/data';
import {
	unregisterBlockType,
	unregisterBlockVariation,
	registerBlockCollection,
} from '@wordpress/blocks';
import { removeFilter } from '@wordpress/hooks';

/**
 * Internal Dependencies:
 */

/**
 * Removes the external media button that Jetpack so rudely adds everywhere.
 */

const removeMetaPanels = (postType) => {
	// We do not use Tags or Comments at Pew Research Center.
	dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-post_tag');
	dispatch('core/edit-post').removeEditorPanel('discussion-panel');
};

const unregisterBlocks = () => {
	const toRemove = [
		'core/archives',
		'core/calendar',
		'core/latest-comments',
		'core/tag-cloud',
		'core/verse',
	];
	toRemove.forEach((blockType) => {
		unregisterBlockType(blockType);
	});

	const embedVariationToRemove = [
		'animoto',
		'spotify',
		'flickr',
		'cloudup',
		'collegehumor',
		'issuu',
		'kickstarter',
		'mixcloud',
		'reverbnation',
		'smugmug',
		'amazon-kindle',
		'pinterest',
		'loom',
		'smartframe',
		'descript',
	];
	embedVariationToRemove.forEach((name) => {
		unregisterBlockVariation('core/embed', name);
	});
};

domReady(() => {
	if (null === select('core/editor')) {
		return;
	}

	removeFilter('editor.MediaUpload', 'external-media/replace-media-upload');

	setTimeout(() => {
		const postType = select('core/editor').getCurrentPostType();
		if (null !== postType) {
			removeMetaPanels(postType);
		}

		registerBlockCollection('prc-block', {
			title: 'Pew Research Center Block Library',
			icon: () => (
				<svg
					id="tiny-logo"
					data-name="Tiny PRC Logo"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 198 198"
					height="20"
				>
					<path d="M142.83,131.63,174,162.77a98.58,98.58,0,0,0,12.74-19l-66.08-27.37a27.49,27.49,0,0,0,6-14.44l66.05,27.36a97.65,97.65,0,0,0,4.47-22.46h-44a56.14,56.14,0,0,0,.62-7.83,54.79,54.79,0,0,0-.63-7.84s0,0,0,0h44a97.65,97.65,0,0,0-4.47-22.46L126.63,96.08a27.43,27.43,0,0,0-6-14.44l66.09-27.37a98.58,98.58,0,0,0-12.74-19L142.83,66.38a54.89,54.89,0,0,0-11.05-11.06l31.14-31.14a98.08,98.08,0,0,0-19-12.73L116.52,77.52a27.57,27.57,0,0,0-14.45-6l27.36-66A98,98,0,0,0,107,1V45h0a53.41,53.41,0,0,0-7.85-.63,54.6,54.6,0,0,0-7.81.62V1A97.65,97.65,0,0,0,68.87,5.47L96.24,71.52a27.54,27.54,0,0,0-14.45,6L54.43,11.44a98.27,98.27,0,0,0-19,12.74L66.53,55.32A54.52,54.52,0,0,0,55.46,66.39s0,0,0,0L24.32,35.23a98.53,98.53,0,0,0-12.73,19L77.66,81.64a27.49,27.49,0,0,0-6,14.44l-66-27.36A97.65,97.65,0,0,0,1.15,91.18h44v0A56.28,56.28,0,0,0,44.57,99a56.14,56.14,0,0,0,.62,7.83h-44a97.65,97.65,0,0,0,4.47,22.46l66.05-27.36a27.49,27.49,0,0,0,6,14.44L11.59,143.73a98.53,98.53,0,0,0,12.73,19l31.15-31.14a54.94,54.94,0,0,0,11.06,11.06h0L35.39,173.83a98.23,98.23,0,0,0,19,12.73l27.36-66.08a27.46,27.46,0,0,0,14.45,6L68.87,192.54A98.18,98.18,0,0,0,91.33,197V153A49.75,49.75,0,0,0,107,153h0v44a97.46,97.46,0,0,0,22.45-4.47l-27.36-66a27.49,27.49,0,0,0,14.45-6l27.36,66.08a98.53,98.53,0,0,0,19-12.73l-31.14-31.14h0a54.68,54.68,0,0,0,11.06-11.06Z" />
				</svg>
			),
		});

		unregisterBlocks();

		console.log('Loading @pewresearch/prc-platform-block-editor...', 'Block editor ready for post type: ' + postType);
	}, 3000);
});

