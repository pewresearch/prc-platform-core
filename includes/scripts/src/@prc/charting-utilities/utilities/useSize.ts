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
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

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

		// Tracks window-level dimension changes for windowWidth/windowHeight
		// (used by consumers for mobile breakpoint checks). The container may
		// not resize when the window does if it has a fixed max-width.
		window.addEventListener('resize', handleResize);

		// ResizeObserver on the container element detects size changes from any
		// source: tab visibility toggles, accordion reveals, CSS transitions, etc.
		// Also fires once on initial observation, handling the first-paint sizing.
		let resizeObserver: ResizeObserver | undefined;
		const element = svgRef.current?.closest(`.${className}`);
		if (element) {
			resizeObserver = new ResizeObserver(() => {
				handleResize();
			});
			resizeObserver.observe(element);
		}

		if (
			document.querySelector('.wp-block-prc-block-tabs') ||
			document.querySelector('.wp-block-tabs')
		) {
			window.addEventListener('tabsReady', handleResize);
		} else if (document.querySelector('.wp-block-prc-block-dialog')) {
			window.addEventListener('wpDialogAnimationEnd', handleResize);
		} else {
			window.addEventListener('load', handleResize);
		}

		setTimeout(() => {
			handleResize();
		}, 0);

		return () => {
			window.removeEventListener('load', handleResize);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('tabsReady', handleResize);
			window.removeEventListener('wpDialogAnimationEnd', handleResize);
			resizeObserver?.disconnect();
		};
	}, [className, svgRef]);
	return size;
}

export { useSize };
