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
	useMemo,
	createContext,
} from '@wordpress/element';
import { useEntityProp, useResourcePermissions } from '@wordpress/core-data';
import { dispatch, useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */

const artDirectionContext = createContext();

function shapeImg(img, size) {
	// console.log('prc-platform/art-direction shapeImg::', img);
	if (img.sizes[size]) {
		return {
			id: img.id,
			rawUrl: img.url,
			url: img.sizes[size].url,
			width: img.sizes[size].width,
			height: img.sizes[size].height,
			caption: img.caption,
			chartArt: false,
		};
	}
	// eslint-disable-next-line no-console
	console.error(`No image size found for ${size}`, img);
	return false;
}

/**
 * State logic that sets other state objects.
 * If the state/image being processed is A1 sized it will autopopulate all images.
 * If A2 then A3 and A4 will be acted upon
 * If Facebook then only Twitter will be acted upon
 *
 * @param {WP Media Image Blob} imgData
 * @param {string}              size
 * @return {Object} modified state object
 */
function propagateImageChanges(imgData, size) {
	const updates = {};
	if ('A1' === size) {
		updates.A2 = shapeImg(imgData, 'A2');
		updates.XL = shapeImg(imgData, 'XL');
		updates.facebook = shapeImg(imgData, 'facebook');
		updates.twitter = shapeImg(imgData, 'twitter');
	}
	if ('A1' === size || 'A2' === size) {
		updates.A3 = shapeImg(imgData, 'A3');
		updates.A4 = shapeImg(imgData, 'A4');
	}
	if ('facebook' === size) {
		updates.twitter = shapeImg(imgData, 'twitter');
	}
	updates[size] = shapeImg(imgData, size);
	return updates;
}

function propagateBorderedToggle(updates = {}, size) {
	const value = !updates[size].chartArt;
	if ('A2' === size) {
		updates.A2.chartArt = value;
		updates.A3.chartArt = value;
		updates.A4.chartArt = value;
	} else {
		updates[size].chartArt = value;
	}
	console.log(
		'prc-platform/art-direction propagateBorderedToggle::',
		updates
	);
	return updates;
}

function updateFeatureImage(img = false) {
	if (false !== img) {
		const { editPost } = dispatch('core/editor');
		editPost({ featured_media: img.id });
	}
}

const useArtDirectionContext = () => {
	const { postId, postType, testMeta } = useSelect((select) => {
		return {
			postId: select('core/editor').getCurrentPostId(),
			postType: select('core/editor').getCurrentPostType(),
			testMeta: select('core/editor').getCurrentPostAttribute('meta'),
		};
	}, []);
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta', postId);
	const { canDelete, isResolving } = useResourcePermissions('posts', postId);
	const allowEditing = useMemo(() => {
		console.log('ART CHECK 0', isResolving, canDelete);
		if (isResolving) {
			return false;
		}
		if (canDelete) {
			return true;
		}
		return false;
	}, [isResolving, canDelete]);

	const [artDirection, setArtDirection] = useState(meta.artDirection || {});
	const debouncedArtDirection = useDebounce(artDirection, 1000);

	/**
	 * Handle saving data back to post.
	 * This approach doesnt support cross collabration as well... but it works for now.
	 */
	useEffect(() => {
		console.log('ART DIRECTION:', meta, testMeta);
		if (!allowEditing || undefined === meta) {
			return;
		}
		// If there is an A1 image, set it as the featured image
		if (debouncedArtDirection.A1 && debouncedArtDirection.A1 !== false) {
			updateFeatureImage(debouncedArtDirection.A1);
			console.log('Featured Image: ', debouncedArtDirection.A1);
		}
		// Check if debouncedArtDirection is different from meta.artDirection, by going through each object and it's properties and making sure they are the same.
		if (
			JSON.stringify(debouncedArtDirection) !==
			JSON.stringify(meta.artDirection)
		) {
			// console.clear();
			console.log(
				'Art Direction Change Detected',
				debouncedArtDirection,
				meta
			);
		} else {
			console.log(
				'No Art Direction Change Detected',
				debouncedArtDirection,
				meta.artDirection
			);
			return;
		}
		console.log('ART DIRECTION UPDATE: ', debouncedArtDirection, meta);
		setMeta({
			...meta,
			artDirection: debouncedArtDirection,
		});
	}, [debouncedArtDirection, allowEditing, meta, setMeta]);

	const setImageSlot = (imgData, size) => {
		const newArtDirection = propagateImageChanges(imgData, size);
		setArtDirection({ ...artDirection, ...newArtDirection });
	};

	const toggleImageSlotBordered = (size) => {
		let newArtDirection = { ...artDirection };
		newArtDirection = propagateBorderedToggle(newArtDirection, size);
		setArtDirection({ ...newArtDirection });
	};

	const isImageSlotBordered = (size) => {
		return artDirection?.[size]?.chartArt;
	};

	const getImageSlot = (size) => {
		return artDirection?.[size];
	};

	const capitalize = (s) => {
		if ('string' !== typeof s) return '';
		return s.charAt(0).toUpperCase() + s.slice(1);
	};

	const hasA1Image = useMemo(() => {
		return !!artDirection.A1;
	}, [artDirection]);

	const allSlotsTheSame = useMemo(() => {
		const keys = Object.keys(debouncedArtDirection);
		const first = debouncedArtDirection[keys[0]];
		console.log('allSlotsTheSame', keys, first);
		for (let i = 1; i < keys.length; i++) {
			console.log(
				'allSlotsTheSame...',
				first,
				debouncedArtDirection[keys[i]]
			);
			let strike = 0;
			if (first.id !== debouncedArtDirection[keys[i]].id) {
				strike += 1;
			}
			if (first.chartArt !== debouncedArtDirection[keys[i]].chartArt) {
				strike += 1;
			}
			if (strike > 0) {
				console.log('allSlotsTheSame...', 'not all the same');
				return false;
			}
		}
		console.log('allSlotsTheSame...', 'all the same');
		return true;
	}, [debouncedArtDirection]);

	return {
		allowEditing,
		postId,
		postType,
		artDirection: debouncedArtDirection,
		hasA1Image,
		setImageSlot,
		getImageSlot,
		isImageSlotBordered,
		toggleImageSlotBordered,
		capitalize,
		allSlotsTheSame,
	};
};

const useArtDirection = () => useContext(artDirectionContext);

function ProvideArtDirection({ children }) {
	const provider = useArtDirectionContext();
	return (
		<artDirectionContext.Provider value={provider}>
			{children}
		</artDirectionContext.Provider>
	);
}

export { ProvideArtDirection, useArtDirection };
export default ProvideArtDirection;
