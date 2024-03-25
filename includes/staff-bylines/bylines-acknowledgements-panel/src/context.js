/* eslint-disable camelcase */

/**
 * WordPress Dependencies
 */
import {
	useState,
	useContext,
	createContext,
	useEffect,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

const bylinesContext = createContext();

const useProvideBylines = () => {
	const { postType } = useSelect(
		(select) => ({
			postType: select('core/editor').getCurrentPostType(),
		}),
		[]
	);
	const { editPost } = useDispatch('core/editor');

	const [bylineItems, setBylines] = useState([]);
	const [acknowledgementItems, setAcknowledgements] = useState([]);
	const [isLoaded, toggleIsLoaded] = useState(false);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');
	if (undefined === meta) {
		console.warn(
			'Bylines will not work correctly until meta can be loaded, ensure this post type supports `custom-fields`.'
		);
		// Bail early if no meta
		return {
			displayBylines: false,
			bylineItems: [],
			acknowledgementItems: [],
			reorder: null,
			append: null,
			remove: null,
			updateItem: null,
			toggleBylinesDisplay: null,
		};
	}

	const { bylines, acknowledgements, displayBylines } = meta;

	const reorder = (oldIndex, newIndex, isBylines = true) => {
		const newItems = isBylines
			? [...bylineItems]
			: [...acknowledgementItems];
		const item = newItems[oldIndex];
		newItems.splice(oldIndex, 1);
		newItems.splice(newIndex, 0, item);
		if (isBylines) {
			setBylines(newItems);
		} else {
			setAcknowledgements(newItems);
		}
	};

	const append = (key, termId, isBylines = true) => {
		const newItems = isBylines
			? [...bylineItems]
			: [...acknowledgementItems];
		newItems.push({ key, termId });
		if (isBylines) {
			setBylines(newItems);
		} else {
			setAcknowledgements(newItems);
		}
	};

	const remove = (index, isBylines = true) => {
		const newItems = isBylines
			? [...bylineItems]
			: [...acknowledgementItems];
		newItems.splice(index, 1);
		if (isBylines) {
			setBylines(newItems);
		} else {
			setAcknowledgements(newItems);
		}
	};

	const updateItem = (index, key, value, isBylines = true) => {
		const newItems = isBylines
			? [...bylineItems]
			: [...acknowledgementItems];
		newItems[index][key] = value;
		if (isBylines) {
			setBylines(newItems);
		} else {
			setAcknowledgements(newItems);
		}
	};

	const toggleBylinesDisplay = () => {
		setMeta({ displayBylines: !displayBylines });
	};

	useEffect(() => {
		if (!isLoaded) {
			console.log('initializing bylines...', meta);
			if (Array.isArray(bylines)) {
				setBylines([...bylines]);
			}
			// check if acknowledgements is an array, if not, set it to an empty array
			if (Array.isArray(acknowledgements)) {
				setAcknowledgements([...acknowledgements]);
			}
			toggleIsLoaded(true);
		}
	}, [bylines, acknowledgements, isLoaded]);

	useEffect(() => {
		if (isLoaded) {
			console.log('Meta Save', [bylineItems, acknowledgementItems]);
			const newMetaUpdates = {
				bylines: bylineItems,
			};
			if (Array.isArray(acknowledgementItems)) {
				newMetaUpdates.acknowledgements = acknowledgementItems;
			}
			setMeta(newMetaUpdates);
			// get array of term ids from bylines and acknowledgements
			const termIds = [...bylineItems, ...acknowledgementItems].map(
				(b) => b.termId
			);
			editPost({ bylines: termIds });
		}
	}, [isLoaded, bylineItems, acknowledgementItems]);

	// Return the user object and auth methods
	return {
		displayBylines,
		bylineItems,
		acknowledgementItems,
		reorder,
		append,
		remove,
		updateItem,
		toggleBylinesDisplay,
	};
};

// Hook for child components to get the context object ...
// ... and re-render when it changes.
const useBylines = () => useContext(bylinesContext);

// Provider component that wraps the facets app, you must hydrate the bylines with data from post meta.
// Available to any child component that calls useBylines()
function ProvideBylines({ children }) {
	const provider = useProvideBylines();
	return (
		<bylinesContext.Provider value={provider}>
			{children}
		</bylinesContext.Provider>
	);
}

export { ProvideBylines, useBylines };
export default ProvideBylines;
