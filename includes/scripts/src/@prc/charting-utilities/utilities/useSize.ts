import { useEffect, useState } from 'react';
import type { Size } from '../types/windowSize';

function useSize(
	className: string | undefined,
	svgRef: React.RefObject<SVGSVGElement>
): Size {
	const [size, setSize] = useState<Size>({
		width: undefined,
		height: undefined,
		windowWidth: undefined,
		windowHeight: undefined,
	});
	useEffect(() => {
		function handleResize() {
			const element = svgRef.current?.closest(`.${className}`);
			// Always get window dimensions
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			// if no class name is passed, return the window size for width/height too
			if (element) {
				const { width, height } = element.getBoundingClientRect();
				setSize({ width, height, windowWidth, windowHeight });
				return;
			}

			setSize({
				width: windowWidth,
				height: windowHeight,
				windowWidth,
				windowHeight,
			});
		}
		// Add event listener
		window.addEventListener('resize', handleResize);
		// check if there are PRC blocks on the page, and wait for special listener
		if (document.querySelector('.wp-block-prc-block-tabs')) {
			window.addEventListener('tabsReady', handleResize);
			// likewise, if there are any dialogs on the page, wait for them to finish animating to resize
		} else if (document.querySelector('.wp-block-prc-block-dialog')) {
			window.addEventListener('wpDialogAnimationEnd', handleResize);
			// otherwise, wait for window to load
		} else {
			window.addEventListener('load', handleResize);
		} // set initial size on timeout.

		// This is needed to get the correct size of the svg
		// when adding charts in the WP editor
		setTimeout(() => {
			handleResize();
		}, 0);
		// Remove event listener on cleanup
		return () => {
			window.removeEventListener('load', handleResize);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('tabsReady', handleResize);
			window.removeEventListener('wpDialogAnimationEnd', handleResize);
		};
	}, [className, svgRef]);
	return size;
}

export { useSize };
