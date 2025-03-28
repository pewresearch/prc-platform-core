import { useEffect, useState } from '@wordpress/element';

/**
 * Watches for window size changes and returns the current window size.
 * Usage: const { width, height } = useWindowSize();
 * Adapted from https://usehooks.com/useWindowSize/.
 * @returns {object} width and height of window
 */
const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	return windowSize;
}

export default useWindowSize;
