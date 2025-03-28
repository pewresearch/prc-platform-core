/**
 * WordPress Dependencies
 */
import { Fragment, useState, useMemo, useEffect } from '@wordpress/element';
import {
	SearchControl,
	TabbableContainer,
	KeyboardShortcuts,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import SearchResults from './search-results';
import { ProvideWPEntitySearch } from './context';

/**
 * A component to search for a post or stub by url or title
 * using the WordPress REST API and entities store.
 *
 * @param {*} param0
 * @return
 */
export default function WPEntitySearch({
	placeholder = 'Climate Change', // placeholder for the search input
	searchValue = '', // pre-populate the search input
	onSelect = () => {},
	onKeyEnter = () => {},
	onKeyESC = () => {},
	entityId,
	entityType = 'postType', // taxonomy, user
	entitySubType = 'post', // ['post', 'page', 'staff'] || ['category', 'tag'] || 'user'
	perPage = 10,
	hideChildren = true,
	onUpdateURL = false,
	clearOnSelect = false,
	createNew = false,
	showExcerpt = false,
	showType = true,
	searchSize = 'default', // compact also available
	children,
}) {
	// Setup our search value first thing.
	const [searchInput, setSearchInput] = useState(searchValue);
	const searchControlSize = useMemo(() => {
		// Inverting the syntax to make it more readable.
		// For us you say searchControlSize="large" to get
		// the "default" otheriwse we default to "compact"
		return 'large' === searchSize ? 'default' : 'compact';
	}, [searchSize]);

	return (
		<TabbableContainer
			onNavigate={(index, elm) => console.log('onNavigate:', elm)}
		>
			<KeyboardShortcuts
				shortcuts={{
					esc: () => {
						if ('function' === typeof onKeyESC) {
							onKeyESC();
							setSearchInput('');
						}
					},
					enter: () => {
						if ('function' === typeof onKeyEnter) {
							onKeyEnter();
						}
					},
				}}
			>
				<SearchControl
					value={searchInput}
					onChange={(keyword) => setSearchInput(keyword)}
					placeholder={placeholder}
					autoComplete="off"
					size={searchControlSize}
				/>
				<ProvideWPEntitySearch
					{...{
						entityId,
						entityType,
						entitySubType,
						perPage,
						hideChildren,
						searchInput,
						setSearchInput,
						onUpdateURL,
						onSelect,
						clearOnSelect,
						createNew,
						showExcerpt,
						showType,
					}}
				>
					<SearchResults />
				</ProvideWPEntitySearch>
			</KeyboardShortcuts>
			<div
				className="wp-entity-search__children"
				style={{
					paddingTop: '0.5em',
				}}
			>
				{children}
			</div>
		</TabbableContainer>
	);
}
