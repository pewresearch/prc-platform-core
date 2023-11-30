/* eslint-disable max-len */
/* eslint-disable camelcase */
/**
 * External Dependencies
 */
import { useDebounce, useWindowSize } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import {
	useState,
	useContext,
	createContext,
	useEffect,
	useRef,
} from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

const facetsContext = createContext();

const useProvideFacets = (seed, domRef) => {
	const data = seed; // Currently we don't need to change this data, so we wont keep it in state, but we will keep it in ref.
	const ref = useRef(domRef); // This is pointing to the group/card containing the facets.
	const mobileAttachRef = useRef(
		document.getElementById('js-prc-facets-mobile-attach'),
	);
	const [nextUrl, updateUrl] = useState('');
	const [processing, toggleProcessing] = useState(false);
	const [selections, updateSelections] = useState({});
	const [firstLoadSelections, updateFirstLoadSelections] = useState(false);
	const [isSearch, toggleIsSearch] = useState(false);
	const [isTaxonomy, setIsTaxonomy] = useState(false);
	const [postType, setPostType] = useState(false);
	const { width } = useWindowSize();
	const debouncedWidth = useDebounce(width, 300);
	const [isMobile, toggleIsMobile] = useState(false);

	const getCurrentUrl = () => {
		const { location } = window;
		const { origin, pathname } = location;
		// if pathname contains /page/x then remove it
		const path = pathname.replace(/\/page\/\d+/, '');
		return `${origin}${path}`;
	};

	/**
	 * Builds the query string from the selections object for the next url when the user clicks update.
	 */
	const buildNextUrl = () => {
		const tmp = {};
		const keys = Object.keys(selections);
		keys.forEach((key) => {
			if (0 < selections[key].length) {
				// split selections[key] array into a string with , as a delimiter
				// and then add to the tmp object with a underscore prepending the key.
				tmp[`_${key}`] = selections[key].join(',');
			}
		});
		const currentUrl = getCurrentUrl();
		const newUrl = addQueryArgs(currentUrl, tmp);
		updateUrl(newUrl);
	};

	/**
	 * Clears the selections object of the given facet.
	 * @param {string|'ALL'|array} facetName The facet name (or array of names) to clear, passing "ALL" will clear all facets.
	 */
	const clearFacetSelection = (facetName = null) => {
		let tmp = { ...selections };
		// if facetName is an array of facet names, clear all selections for those facets
		if (Array.isArray(facetName)) {
			facetName.forEach((facet) => {
				delete tmp[facet];
			});
		} else if ('ALL' === facetName) {
			tmp = {};
		} else {
			delete tmp[facetName];
		}
		updateSelections({ ...tmp });
	};

	const processUrlChange = () => {
		toggleProcessing(true);
		// Fetch the next url before redirecting, this way we can force the app server to cache the results.
		fetch(nextUrl)
			.then((response) => {
				window.location = nextUrl;
			})
			.catch((err) => {
				// There was an error
				console.error(err);
				// eslint-disable-next-line no-alert
				alert(`We've encountered an error. Please try again later.`);
			});
	};

	/**
	 * Initialize the selections object from the given selected facets in the facets object.
	 */
	useEffect(() => {
		const keys = Object.keys(data.facets);
		const tmp = {};
		keys.forEach((key) => {
			if (0 < data.facets[key].selected.length) {
				tmp[key] = data.facets[key].selected;
			}
		});

		// If data.is_taxonomy is not false then we are on a taxonomy page and should remove the is_taxonomy value from tmp.
		if (false !== data.is_taxonomy) {
			delete tmp[data.is_taxonomy];
			setIsTaxonomy(data.is_taxonomy);
		}

		setPostType(data.post_type);

		updateSelections({ ...tmp });
		if (false === firstLoadSelections) {
			updateFirstLoadSelections(tmp);
		}

		// if currenturl contains /search then toggle display topic to true
		// We want topic's to be visible on search.
		const currentUrl = getCurrentUrl();
		if (currentUrl.includes('/search')) {
			toggleIsSearch(true);
		}
		if (currentUrl.includes('/regions-countries')) {
			console.log("Regions Countries", keys);
		}

		if (window.prcFacets.debug.enabled) {
			console.log('Facets Init: Pre-Selected -> ', tmp);
		}
	}, []);

	useEffect(() => {
		if (768 > width) {
			toggleIsMobile(true);
		} else {
			toggleIsMobile(false);
		}
	}, [debouncedWidth]);

	/**
	 * As selections change update the next url.
	 */
	useEffect(() => {
		buildNextUrl();
	}, [selections]);

	// Return the user object and auth methods
	return {
		data,
		ref,
		mobileAttachRef,
		processing,
		processUrlChange,
		nextUrl,
		updateSelections,
		selections,
		hasSelections: 0 < Object.keys(selections).length,
		clearFacetSelection,
		firstLoadSelections,
		getCurrentUrl,
		isSearch,
		isMobile,
		isTaxonomy,
		postType,
	};
};

// Hook for child components to get the context object ...
// ... and re-render when it changes.
const useFacets = () => useContext(facetsContext);

// Provider component that wraps the facets app, you must hydrate the facets with data.
// Available to any child component that calls useFacets()
function ProvideFacets({ seed, domRef, children }) {
	const provider = useProvideFacets(seed, domRef);
	return (
		<facetsContext.Provider value={provider}>{children}</facetsContext.Provider>
	);
}

export { ProvideFacets, useFacets };
export default ProvideFacets;
