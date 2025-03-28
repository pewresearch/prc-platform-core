/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';
/**
 * WordPress Dependencies
 */
import { useEffect, useState, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

export default function useMetaStatefully(metaKey, defaultValue = '') {
	const { editPost } = useDispatch('core/editor');
	const meta = useSelect(
		(select) => select('core/editor').getEditedPostAttribute('meta'),
		[]
	);
	const [value, setValue] = useState(meta[metaKey] || defaultValue);
	const debouncedValue = useDebounce(value, 500);

	useEffect(() => {
		editPost({ meta: { [metaKey]: debouncedValue } });
	}, [debouncedValue, editPost, meta, metaKey]);

	return [value, setValue];
}
