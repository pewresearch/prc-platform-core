/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { PluginPrePublishPanel } from '@wordpress/edit-post';
import { addFilter } from '@wordpress/hooks';
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { reducer, actions, controls, selectors, resolvers } from './store';
import ArtDirectionPanel from './panel';

import './style.scss';

/**
 * Register Data Store: prc/art
 */
registerStore('prc/art', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});

const renderArtDirection = () => {
	return () => {
		return (
			<Fragment>
				<ArtDirectionPanel />
				<PluginPrePublishPanel
					title="Review Featured Image"
					initialOpen
				>
					<ArtDirectionPanel />
				</PluginPrePublishPanel>
			</Fragment>
		);
	};
};

// Replacing the Featured Image panel contents : https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/editor/src/components/post-featured-image/README.md.
addFilter(
	'editor.PostFeaturedImage',
	'prc-block-plugins/art-direction',
	renderArtDirection
);
