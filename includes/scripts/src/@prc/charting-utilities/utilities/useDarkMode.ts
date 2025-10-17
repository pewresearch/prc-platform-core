// create a useEffect hook that listens for changes to the media query
// and updates the value of the dark mode state
//
// https://usehooks.com/useDarkMode/
import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import useMedia from './useMedia';

function useDarkMode() {
	// Use our useLocalStorage hook to persist state through a page refresh.
	// Read the recipe for this hook to learn more: usehooks.com/useLocalStorage
	const [enabledState, setEnabledState] = useLocalStorage<boolean>(
		'dark-mode-enabled',
		false
	);
	// See if user has set a browser or OS preference for dark mode.
	// The usePrefersDarkMode hook composes a useMedia hook (see code below).
	const prefersDarkMode = usePrefersDarkMode();
	// If enabledState is defined use it, otherwise fallback to prefersDarkMode.
	// This allows user to override OS level setting on our website.
	const enabled = prefersDarkMode;
	// Fire off effect that add/removes dark mode class
	useEffect(
		() => {
			const className = 'dark-mode';
			const element = window.document.body;
			if (enabled) {
				element.classList.add(className);
			} else {
				element.classList.remove(className);
			}
		},
		[enabled] // Only re-call effect when value changes
	);
	// Return enabled state and setter
	return [enabled, setEnabledState];
}

function usePrefersDarkMode() {
	return useMedia(['(prefers-color-scheme: dark)'], [true], false);
}

export default useDarkMode;
export { useDarkMode };
