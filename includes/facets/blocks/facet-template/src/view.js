/**
 * WordPress Dependencies
 */
import {
	store,
	getElement,
	getContext,
	getServerContext,
	getServerState,
} from '@wordpress/interactivity';

/**
 * Internal Dependencies
 */

function formatCount(count) {
	return count;
	// return 250 <= count ? '250+' : count;
}

function getPropertyFromServerChoice(property, searchValue, values) {
	const choice = values.find((c) => c.value === searchValue);
	return choice ? choice[property] : null;
}

const { state, actions } = store('prc-platform/facets-context-provider', {
	state: {
		// These get values for each choice scoped to their context.
		get label() {
			const context = getContext().choice;
			const { facetSlug, label, value } = context;
			const count = getPropertyFromServerChoice(
				'count',
				value,
				getServerState().facets[facetSlug].choices
			);
			return `${label} (${formatCount(count)})`;
		},
		get isSelected() {
			const { facetSlug, value } = getContext().choice;
			return state.selected[facetSlug].includes(value);
		},
		get checked() {
			const { facetSlug, value } = getContext().choice;
			return state.selected[facetSlug].includes(value);
		},
		get id() {
			const context = getContext();
			return `facet_${context.choice.slug}_${context.choice.term_id}`;
		},
		get type() {
			return getContext().choice.type;
		},
		get value() {
			return getContext().choice.value;
		},
		get slug() {
			return getContext().choice.slug;
		},
		get name() {
			return getContext().choice.slug;
		},
		get facetSlug() {
			return getContext().choice.facetSlug;
		},
		get hasExpandedChoices() {
			return (
				getServerContext().expandedChoices &&
				getServerContext().expandedChoices.length > 0
			);
		},
		get placeholder() {
			const context = getContext();
			const { facetSlug, placeholder } = context;
			const { selected } = state;
			const selectedValues = selected[facetSlug];
			let plchldr = `Select ${placeholder}`;
			if (undefined !== selectedValues && 1 <= selectedValues.length) {
				plchldr = selectedValues
					.map((value) =>
						value
							.replace(/-/g, ' ')
							.split(' ')
							.map(
								(word) =>
									word.charAt(0).toUpperCase() + word.slice(1)
							)
							.join(' ')
					)
					.join(', ');
			}
			return plchldr;
		},
		get facetChoices() {
			return getServerContext().choices;
		},
		get facetExpandedChoices() {
			return getServerContext().expandedChoices;
		},
		get filterableFacetChoices() {
			const { searchValue } = getContext();
			const { data } = getServerContext();
			if (!searchValue) {
				return data;
			}

			// This takes a search term and filters the choices based on the search term.
			const matches = data.filter((choice) => {
				const { label } = choice;
				return label.toLowerCase().includes(searchValue.toLowerCase());
			});
			return matches;
		},
		get hasSelections() {
			const { facetSlug } = getContext();
			const { selected } = state;
			return selected[facetSlug].length > 0;
		},
	},
	actions: {
		/**
		 * When clicking on the clear button, clear the facet from the selections.
		 */
		clearFacet: () => {
			const { facetSlug } = getContext();
			actions.onClear(facetSlug);
		},
		onCheckboxClick: () => {
			const { value, facetSlug, getSelected } = state;

			if (
				!getSelected[facetSlug] ||
				getSelected[facetSlug].length === 0
			) {
				state.selected[facetSlug] = [value];
			} else if (getSelected[facetSlug].includes(value)) {
				state.selected[facetSlug] = getSelected[facetSlug].filter(
					(item) => item !== value
				);
			} else if ('radio' === state.type) {
				state.selected[facetSlug] = [value];
			} else {
				state.selected[facetSlug] = [...getSelected[facetSlug], value];
			}
		},
		*onCheckboxMouseEnter() {
			const { facetSlug, value, getSelected } = state;
			const currentSelected = getSelected[facetSlug] || [];
			const nextSelected = { ...currentSelected, [facetSlug]: value };
			const nextUrl = actions.constructNewUrl(nextSelected);
			yield actions.prefetch(nextUrl);
		},
		onSelectClick: () => {
			const context = getContext();
			const { facetSlug, value } = context.choice;

			const currentSelected = state.getSelected;
			const newSelected = currentSelected;
			if (!currentSelected[facetSlug]) {
				newSelected[facetSlug] = [value];
			} else if (currentSelected[facetSlug].includes(value)) {
				newSelected[facetSlug] = newSelected[facetSlug].filter(
					(item) => item !== value
				);
			} else {
				newSelected[facetSlug] = [value];
			}

			state.selected = newSelected;
			context.searchValue = '';
		},
		/**
		 * When clicking on the facet expanded button, toggle the expanded state.
		 */
		onExpand: () => {
			const context = getContext();
			context.expanded = !context.expanded;
		},
		onCollapse: () => {
			// By default this runs on the on-blur directive on the input element
			// but we also use it as a shortcut to close the listbox on click,
			// Because the on-blur event fires before the click event
			// we need to slow things down a bit, 150 ms should do it...
			const context = getContext();
			let isRunning = false;
			if (!isRunning) {
				isRunning = true;
				setTimeout(() => {
					context.expanded = false;
					isRunning = false;
				}, 150);
			}
		},
		moveThroughChoices: (direction, ref) => {
			const { facetChoices } = state;
			const { activeIndex } = getContext();
			let nextActive = null;
			if (activeIndex === null || isNaN(activeIndex)) {
				nextActive = 0;
			} else {
				nextActive = activeIndex + direction;
			}
			if (nextActive < 0) {
				nextActive = facetChoices.length - 1;
			}
			if (nextActive >= facetChoices.length) {
				nextActive = 0;
			}
			const nextActiveValue = facetChoices[nextActive].value;
			// also scroll the listbox to the active item as you go...
			const listbox = ref.parentElement.parentElement.querySelector(
				'.wp-block-prc-platform-facet-select-field__list'
			);
			const activeItem = listbox.querySelector(
				`[data-ref-value="${nextActiveValue}"]`
			);
			if (activeItem) {
				// Remove the active class from the previous active item.
				const previousActive = listbox.querySelector('.is-selected');
				if (previousActive) {
					previousActive.classList.remove('is-selected');
				}
				activeItem.classList.add('is-selected');
				activeItem.scrollIntoView({
					block: 'nearest',
				});
			}

			// facetChoices.forEach((option) => {
			// 	option.isSelected = false;
			// });
			// facetChoices[nextActive].isSelected = true;

			getContext().activeIndex = nextActive;

			// actions.setFilteredOptions(filteredOptions, id);
		},
		onSelectKeyUp: (event) => {
			event.preventDefault();
			const context = getContext();
			const { facetSlug, activeIndex, choices } = context;

			// The input value.
			const { value } = event.target;

			const { ref } = getElement();

			if (event.key === 'Escape') {
				if (true === getContext().expanded) {
					ref.blur();
				}
				return;
			}

			if (event.keyCode === 40 && event.key === 'ArrowDown') {
				actions.moveThroughChoices(1, event.target);
				return;
			}
			if (event.keyCode === 38 && event.key === 'ArrowUp') {
				actions.moveThroughChoices(-1, event.target);
				return;
			}
			if (event.key === 'Enter') {
				const selectedValue = choices[activeIndex].value;
				const currentSelected = state.selected;
				const newSelected = currentSelected;
				if (!currentSelected[facetSlug]) {
					newSelected[facetSlug] = [selectedValue];
				} else if (currentSelected[facetSlug].includes(selectedValue)) {
					newSelected[facetSlug] = newSelected[facetSlug].filter(
						(item) => item !== selectedValue
					);
				} else {
					newSelected[facetSlug] = [selectedValue];
				}
				context.expanded = false;
				state.selected = newSelected;

				return;
			}

			// Otherwise, filter the options.
			getContext().searchValue = value.toLowerCase();
		},
	},
	callbacks: {
		onUpdates: () => {
			const localContext = getContext();
			const serverContext = getServerContext();
		},
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
	},
});
