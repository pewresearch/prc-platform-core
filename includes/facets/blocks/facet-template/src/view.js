/**
 * WordPress Dependencies
 */
import { store } from '@wordpress/interactivity';
import { isURL, buildQueryString } from '@wordpress/url';
import { createRef, render } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal Dependencies
 */

store( {
	state: {
		facetTemplate: {},
	},
	actions: {
		facetTemplate: {
			onExpand: ( { context, state, selectors } ) => {
				context.facetTemplate.expanded = ! context.facetTemplate.expanded;
			},
		},
	},
	effects: {
		facetTemplate: {
			onExpand: ( { context, state, selectors } ) => {
				const {expanded} = context.facetTemplate;
				if ( expanded ) {
					context.facetTemplate.expandedLabel = "- Less";
				} else {
					context.facetTemplate.expandedLabel = "+ More";
				}
			}
		},
	},
} );
