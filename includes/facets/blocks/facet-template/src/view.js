/**
 * WordPress Dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';

store('prc-platform/facet-template', {
	actions: {
		/**
		 * When clicking on the facet expanded button, toggle the expanded state.
		 */
		onExpand: () => {
			const context = getContext();
			context.expanded = !context.expanded;
		},
		/**
		 * When clicking on the clear button, clear the facet from the selections.
		 */
		onClear: () => {
			const context = getContext();
			const { facetSlug } = context;
			const targetStore = store(targetNamespace);
			if (!targetStore.actions || !targetStore.actions.onClear) {
				return;
			}
			targetStore.actions.onClear(facetSlug);
		},
	},
	callbacks: {
		/**
		 * When the facet is expanded, update the label to be either More or Less.
		 */
		onExpand: () => {
			const context = getContext();
			const { expanded } = context;
			if (expanded) {
				context.expandedLabel = '- Less';
			} else {
				context.expandedLabel = '+ More';
			}
		},
		/**
		 * Determine if the facet has selections.
		 */
		isSelected: () => {
			const context = getContext();
			const { facetSlug } = context;
			const { state } = store('prc-platform/facets-context-provider');
			const selected = state.getSelected;
			if (selected[facetSlug] && selected[facetSlug].length > 0) {
				return true;
			}
			return false;
		},
	},
});
