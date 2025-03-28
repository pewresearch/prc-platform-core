/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Watches an inputValue and returns a debounced version of it after set delay.
 * Usage: const debouncedValue = useDebounce('a string being typed by a user...', 500);
 * @param {*} inputValue
 * @param {*} delay
 * @returns value after delay
 */
const useDebounce = (value, delay) => {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);
			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay], // Only re-call effect if value or delay changes
	);
	return debouncedValue;
};

export default useDebounce;
