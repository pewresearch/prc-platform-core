/**
 * WordPress dependencies
 */
import { useState, useEffect } from 'react';

/**
 * A hook to get the client width of an element and update it as the window resizes.
 *
 * @param {element} ref
 * @param {Array}   dependencies
 * @return
 */
export default function useClientWidth(ref, dependencies) {
	const [clientWidth, setClientWidth] = useState();

	function calculateClientWidth() {
		setClientWidth(ref?.current?.clientWidth);
	}

	useEffect(calculateClientWidth, [ref, dependencies]);

	useEffect(() => {
		console.log('useClientWidth', ref, dependencies);
		if (ref?.current?.ownerDocument === undefined) {
			return;
		}
		const { defaultView } = ref?.current?.ownerDocument;

		defaultView.addEventListener('resize', calculateClientWidth);

		return () => {
			defaultView.removeEventListener('resize', calculateClientWidth);
		};
	}, [ref]);

	return clientWidth;
}
