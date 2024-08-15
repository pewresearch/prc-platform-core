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
	createContext,
	useMemo,
} from '@wordpress/element';
// import { useDispatch, useSelect } from '@wordpress/data';
import { useEntityProp, useResourcePermissions } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */

const postReportPackageContext = createContext();

const usePostReportPackageContext = (postId, postType, currentPostId) => {
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta', postId);
	const { canDelete, isResolving } = useResourcePermissions('posts', postId);

	const [materials, setMaterials] = useState(meta?.reportMaterials ?? []);
	const [backChapters, setBackChapters] = useState(
		meta?.multiSectionReport ?? []
	);
	const debounceMaterials = useDebounce(materials, 500);
	const debounceBackChapters = useDebounce(backChapters, 500);

	const allowEditing = useMemo(() => {
		if (isResolving) {
			return false;
		}
		if (canDelete) {
			return true;
		}
		return false;
	}, [isResolving, canDelete]);

	// This approach doesnt support cross collabration as well but it works for now. Leaving the entity sync version below for reference.
	useEffect(() => {
		console.log('Materials...', postId, meta, materials);
		if (!allowEditing || undefined === meta) {
			return;
		}
		setMeta({
			...meta,
			reportMaterials: materials,
		});
	}, [debounceMaterials]);

	useEffect(() => {
		console.log('Back Chapters...', backChapters);
		if (!allowEditing || undefined === meta) {
			return;
		}
		setMeta({
			...meta,
			multiSectionReport: backChapters,
		});
	}, [debounceBackChapters]);

	// const { materials, setMaterials, backChapters, setBackChapters } = useMemo(() => {
	// 	return {
	// 		materials: meta?.reportMaterials,
	// 		setMaterials(newVal) {
	// 			setMeta({
	// 				...meta,
	// 				reportMaterials: newVal,
	// 			});
	// 		},
	// 		backChapters: meta?.multiSectionReport,
	// 		setBackChapters(newVal) {
	// 			setMeta({
	// 				...meta,
	// 				multiSectionReport: newVal,
	// 			});
	// 		}
	// 	};
	// }, [meta]);

	const getLatestStateByItemType = (itemsType = 'materials') => {
		if ('materials' === itemsType) {
			return [...materials];
		} else if ('backChapters' === itemsType) {
			return [...backChapters];
		}
		return [];
	};

	const reorder = (oldIndex, newIndex, itemsType = 'materials') => {
		if (!allowEditing) {
			return;
		}
		const newItems = getLatestStateByItemType(itemsType);

		// Do reordering.
		const item = newItems[oldIndex];
		newItems.splice(oldIndex, 1);
		newItems.splice(newIndex, 0, item);

		let fn = () => console.log('reorder', oldIndex, newIndex, itemsType);
		if ('materials' === itemsType) {
			fn = setMaterials;
		} else if ('backChapters' === itemsType) {
			fn = setBackChapters;
		}

		fn(newItems);
	};

	const append = (key, value = {}, itemsType = 'materials') => {
		if (!allowEditing) {
			return;
		}
		const newItems = getLatestStateByItemType(itemsType);

		const obj = {
			key,
		};
		Object.assign(obj, value);
		newItems.push(obj);

		let fn = () => console.log('append', key, value, obj, itemsType);
		if ('materials' === itemsType) {
			fn = setMaterials;
		} else if ('backChapters' === itemsType) {
			fn = setBackChapters;
		}
		fn(newItems);
	};

	const remove = (index, itemsType = 'materials') => {
		if (!allowEditing) {
			return;
		}
		const newItems = getLatestStateByItemType(itemsType);

		newItems.splice(index, 1);

		let fn = () => console.log('remove', index, itemsType);
		if ('materials' === itemsType) {
			fn = setMaterials;
		} else if ('backChapters' === itemsType) {
			fn = setBackChapters;
		}

		fn(newItems);
	};

	const updateItem = (index, valueKey, value, itemsType = 'materials') => {
		if (!allowEditing) {
			return;
		}
		console.log(
			'updateItem',
			index,
			valueKey,
			value,
			itemsType,
			allowEditing,
			isResolving,
			canDelete
		);
		const newItems = getLatestStateByItemType(itemsType);

		newItems[index][valueKey] = value;

		let fn = () =>
			console.log('updateItem', index, valueKey, value, itemsType);
		if ('materials' === itemsType) {
			fn = setMaterials;
		} else if ('backChapters' === itemsType) {
			fn = setBackChapters;
		}

		fn(newItems);
	};

	return {
		allowEditing,
		postId,
		currentPostId,
		postType,
		materials,
		backChapters,
		reorder,
		append,
		remove,
		updateItem,
	};
};

const usePostReportPackage = () => useContext(postReportPackageContext);

function ProvidePostReportPackage({
	postId,
	postType,
	currentPostId,
	children,
}) {
	const provider = usePostReportPackageContext(
		postId,
		postType,
		currentPostId
	);
	return (
		<postReportPackageContext.Provider value={provider}>
			{children}
		</postReportPackageContext.Provider>
	);
}

export { ProvidePostReportPackage, usePostReportPackage };
export default ProvidePostReportPackage;
