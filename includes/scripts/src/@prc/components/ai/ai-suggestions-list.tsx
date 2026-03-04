/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';

interface AISuggestionsListProps<T> {
	/** Array of suggestion items to render. */
	suggestions: T[];

	/** Set of currently selected item IDs. */
	selectedIds: Set<string | number>;

	/** Called when a suggestion's checkbox is toggled. */
	onToggle: (id: string | number) => void;

	/** Extracts a unique ID from a suggestion item. */
	getId: (item: T) => string | number;

	/**
	 * Renders the label / body of a single suggestion.
	 * Receives the item; should return a ReactNode used as
	 * the CheckboxControl label.
	 */
	renderItem: (item: T) => React.ReactNode;

	/** Message shown when the suggestions array is empty. */
	emptyMessage?: string;
}

/**
 * Multi-select list of AI suggestions with checkboxes.
 *
 * The consumer provides a `renderItem` function that controls how
 * each suggestion looks. Selection state is managed externally via
 * `selectedIds` and `onToggle`.
 * @param root0
 * @param root0.suggestions
 * @param root0.selectedIds
 * @param root0.onToggle
 * @param root0.getId
 * @param root0.renderItem
 * @param root0.emptyMessage
 */
export default function AISuggestionsList<T>({
	suggestions,
	selectedIds,
	onToggle,
	getId,
	renderItem,
	emptyMessage,
}: AISuggestionsListProps<T>) {
	if (suggestions.length === 0) {
		return (
			<p className="prc-ai-suggestions-list__empty">
				{emptyMessage ||
					__('No suggestions available.', 'prc-platform-core')}
			</p>
		);
	}

	return (
		<div className="prc-ai-suggestions-list">
			{suggestions.map((item) => {
				const id = getId(item);
				const isSelected = selectedIds.has(id);

				return (
					<div
						key={String(id)}
						className={`prc-ai-suggestions-list__item${
							isSelected
								? ' prc-ai-suggestions-list__item--selected'
								: ''
						}`}
					>
						<CheckboxControl
							__nextHasNoMarginBottom
							label={renderItem(item)}
							checked={isSelected}
							onChange={() => onToggle(id)}
						/>
					</div>
				);
			})}
		</div>
	);
}
