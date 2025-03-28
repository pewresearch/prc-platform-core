import { useEffect, useState } from '@wordpress/element';

const useKeyPress = (targetKey = null, targetCode = null) => {
	// State for keeping track of whether key is pressed
	const [keyPressed, setKeyPressed] = useState(false);
	// If pressed key is our target key then set to true
	function downHandler({ key, code }) {
		if (code === targetCode) {
			setKeyPressed(true);
		}
		if (key === targetKey) {
			setKeyPressed(true);
		}
	}
	// If released key is our target key then set to false
	const upHandler = ({ key, code }) => {
		if (code === targetCode) {
			setKeyPressed(false);
		}
		if (key === targetKey) {
			setKeyPressed(false);
		}
	};
	// Add event listeners
	useEffect(() => {
		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
	}, []); // Empty array ensures that effect is only run on mount and unmount
	return keyPressed;
};

export default useKeyPress;
