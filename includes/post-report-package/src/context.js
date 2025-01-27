/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import {
	useEffect,
	useState,
	useContext,
	useCallback,
	createContext,
	useMemo,
} from '@wordpress/element';
import {
	useEntityProp,
	useResourcePermissions,
	useEntityRecord,
} from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal Dependencies
 */

const postReportPackageContext = createContext();

const usePostReportPackageContext = (parentId, postType, postId) => {
	// Quick memoized check to determine if this is a child post or not.
	const isChild = useMemo(() => {
		return parentId !== postId;
	}, [parentId, postId]);

	// Get the parent record.
	const { record, isResolving } = useEntityRecord(
		'postType',
		postType,
		parentId
	);
	// Get the parent meta values and setter function.
	const [meta, setMeta] = useEntityProp(
		'postType',
		postType,
		'meta',
		parentId
	);

	// Determine if the current user has permissions to edit the parent post.
	const { canDelete, canUpdate } = useResourcePermissions('posts', parentId);

	// State for the materials, chapters and parts.
	// Package Materials
	// @TODO: Change to package_materials
	const [materials, _setMaterials] = useState(null);
	const _materials = useDebounce(materials, 100);
	const setMaterials = (value) => _setMaterials(value);
	useEffect(() => {
		if (null === _materials && meta?.reportMaterials !== undefined) {
			_setMaterials(meta.reportMaterials);
		}
		if (_materials !== null && meta?.reportMaterials !== _materials) {
			setMeta({ ...meta, reportMaterials: _materials });
		}
	}, [_materials, meta]);
	// Package Chapters
	// @TODO: Change to package_chapters
	const [chapters, _setChapters] = useState(null);
	const _chapters = useDebounce(chapters, 100);
	const setChapters = (value) => _setChapters(value);
	useEffect(() => {
		if (null === _chapters && meta?.multiSectionReport !== undefined) {
			_setChapters(meta.multiSectionReport);
		}
		if (_chapters !== null && meta?.multiSectionReport !== _chapters) {
			setMeta({ ...meta, multiSectionReport: _chapters });
		}
	}, [_chapters, meta]);
	// Package Parts
	const [parts, _setParts] = useState(null);
	const _parts = useDebounce(parts, 100);
	const setParts = (value) => _setParts(value);
	useEffect(() => {
		if (null === _parts && meta?.package_parts !== undefined) {
			_setParts(meta.package_parts);
		}
		if (_parts !== null && meta?.package_parts !== _parts) {
			setMeta({ ...meta, package_parts: _parts });
		}
	}, [_parts, meta]);
	// Enable Parts (flag)
	const [_enableParts, setEnableParts] = useState(null);
	const enableParts = useDebounce(_enableParts, 150);
	const toggleParts = () => {
		setEnableParts(!enableParts);
	};
	useEffect(() => {
		// if enableParts is null and meta.package_parts__enabled has a value then set it...
		if (
			enableParts === null &&
			meta?.package_parts__enabled !== undefined
		) {
			setEnableParts(meta.package_parts__enabled);
		}
		// if enableParts is not null and the meta value is not the same as the enableParts value, update the meta value.
		if (
			enableParts !== null &&
			meta?.package_parts__enabled !== enableParts
		) {
			setMeta({ ...meta, package_parts__enabled: enableParts });
		}
	}, [enableParts, meta]);

	const parentPost = useMemo(() => {
		if (isResolving || !record) {
			return;
		}
		return record;
	}, [record, isResolving]);

	const parentPostTitle = useMemo(() => {
		if (parentPost) {
			return decodeEntities(parentPost.title.rendered);
		}
		return '';
	}, [parentPost]);

	const allowEditing = useMemo(() => {
		if (isResolving) {
			return false;
		}
		if (canDelete && canUpdate) {
			return true;
		}
		return false;
	}, [isResolving, canDelete, canUpdate]);

	const hasChapters = useMemo(() => {
		return null !== chapters && chapters.length > 0;
	}, [chapters]);

	const getLatestStateByItemType = useCallback(
		(itemsType = 'materials') => {
			if ('materials' === itemsType) {
				return [...materials];
			} else if ('chapters' === itemsType) {
				return [...chapters];
			} else if ('parts' === itemsType) {
				return [...parts];
			}
			return [];
		},
		[materials, chapters, parts]
	);

	const reorder = useCallback(
		(oldIndex, newIndex, itemsType = 'materials') => {
			if (!allowEditing) {
				return;
			}
			const newItems = getLatestStateByItemType(itemsType);

			// Do reordering.
			const item = newItems[oldIndex];
			newItems.splice(oldIndex, 1);
			newItems.splice(newIndex, 0, item);

			let fn = () =>
				console.log('reorder', oldIndex, newIndex, itemsType);
			if ('materials' === itemsType) {
				fn = setMaterials;
			} else if ('chapters' === itemsType) {
				fn = setChapters;
			} else if ('parts' === itemsType) {
				fn = setParts;
			}

			fn(newItems);
		},
		[allowEditing, getLatestStateByItemType]
	);

	const append = useCallback(
		(key, value = {}, itemsType = 'materials') => {
			if (!allowEditing) {
				return;
			}
			const newItems = getLatestStateByItemType(itemsType);

			const obj = {
				key,
			};
			Object.assign(obj, value);
			newItems.push(obj);

			let fn;
			if ('materials' === itemsType) {
				fn = setMaterials;
			} else if ('chapters' === itemsType) {
				fn = setChapters;
			} else if ('parts' === itemsType) {
				fn = setParts;
			}
			fn(newItems);
		},
		[allowEditing, getLatestStateByItemType]
	);

	const remove = useCallback(
		(index, itemsType = 'materials') => {
			if (!allowEditing) {
				return;
			}
			const newItems = getLatestStateByItemType(itemsType);

			newItems.splice(index, 1);

			let fn = () => console.log('remove', index, itemsType);
			if ('materials' === itemsType) {
				fn = setMaterials;
			} else if ('chapters' === itemsType) {
				fn = setChapters;
			} else if ('parts' === itemsType) {
				fn = setParts;
			}

			fn(newItems);
		},
		[allowEditing, getLatestStateByItemType]
	);

	const updateItem = useCallback(
		(index, valueKey, value, itemsType = 'materials') => {
			if (!allowEditing) {
				return;
			}
			const newItems = getLatestStateByItemType(itemsType);

			newItems[index][valueKey] = value;

			let fn = () =>
				console.log('updateItem', index, valueKey, value, itemsType);
			if ('materials' === itemsType) {
				fn = setMaterials;
			} else if ('chapters' === itemsType) {
				fn = setChapters;
			} else if ('parts' === itemsType) {
				fn = setParts;
			}

			fn(newItems);
		},
		[allowEditing, getLatestStateByItemType]
	);

	return {
		// Editor and post info:
		isChild,
		isResolving,
		allowEditing,
		parentId,
		postId,
		postType,
		parentPost,
		parentPostTitle,
		// Package settings and data:
		hasChapters,
		enableParts,
		materials,
		chapters,
		parts,
		// Context functions:
		reorder,
		append,
		remove,
		updateItem,
		toggleParts,
	};
};

const usePostReportPackage = () => useContext(postReportPackageContext);

function ProvidePostReportPackage({ parentId, postType, postId, children }) {
	const provider = usePostReportPackageContext(parentId, postType, postId);
	return (
		<postReportPackageContext.Provider value={provider}>
			{children}
		</postReportPackageContext.Provider>
	);
}

export { ProvidePostReportPackage, usePostReportPackage };
export default ProvidePostReportPackage;
