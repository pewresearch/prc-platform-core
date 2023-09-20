/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import {
	useState,
	useContext,
	createContext,
	useMemo,
} from '@wordpress/element';
import { useEntityProp, useResourcePermissions } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */

const postReportPackageContext = createContext();

const usePostReportPackageContext = (postId, postType) => {
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta', postId);
	const {canDelete, isResolving} = useResourcePermissions('posts', postId);

	const allowEditing = useMemo(() => {
		if (isResolving) {
			return false;
		}
		if (canDelete) {
			return true;
		}
		return false;
	}, [isResolving, canDelete]);

	const { materials, setMaterials, backChapters, setBackChapters } = useMemo(() => {
		return {
			materials: meta?.reportMaterials,
			setMaterials(newVal) {
				setMeta({
					...meta,
					reportMaterials: newVal,
				});
			},
			backChapters: meta?.multiSectionReport,
			setBackChapters(newVal) {
				setMeta({
					...meta,
					multiSectionReport: newVal,
				});
			}
		};
	}, [meta]);

	const getLatestStateByItemType = (itemsType = 'materials') => {
		if ( 'materials' === itemsType ) {
			return [...materials];
		} else if ( 'backChapters' === itemsType ) {
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
		if ( 'materials' === itemsType ) {
			fn = setMaterials;
		} else if ( 'backChapters' === itemsType ) {
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
		if ( 'materials' === itemsType ) {
			fn = setMaterials;
		} else if ( 'backChapters' === itemsType ) {
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
		if ( 'materials' === itemsType ) {
			fn = setMaterials;
		} else if ( 'backChapters' === itemsType ) {
			fn = setBackChapters;
		}

		fn(newItems);
	};

	const updateItem = (index, valueKey, value, itemsType = 'materials') => {
		if (!allowEditing) {
			return;
		}
		const newItems = getLatestStateByItemType(itemsType);

		newItems[index][valueKey] = value;

		let fn = () => console.log('updateItem', index, valueKey, value, itemsType);
		if ( 'materials' === itemsType ) {
			fn = setMaterials;
		} else if ( 'backChapters' === itemsType ) {
			fn = setBackChapters;
		}

		fn(newItems);
	};

	return {
		allowEditing,
		postId,
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

function ProvidePostReportPackage({ postId, postType, children }) {
	const provider = usePostReportPackageContext(postId, postType);
	return (
		<postReportPackageContext.Provider value={provider}>
			{children}
		</postReportPackageContext.Provider>
	);
}

export { ProvidePostReportPackage, usePostReportPackage };
export default ProvidePostReportPackage;
