// Completely copied from Automattic's positioning hook:
// https://github.com/Automattic/wp-calypso/blob/trunk/packages/help-center/src/hooks/use-opening-coordinates.ts
/* eslint-disable @wordpress/no-unused-vars-before-return */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from '@wordpress/element';

const AESTHETIC_OFFSET = 20;
const HELP_CENTER_WIDTH = 410;
const HELP_CENTER_POSITION = {
	MASTERBAR: 11,
	EDITOR: 15,
};

const getOriginElementOffset = (element) => {
	if (element.classList.contains('masterbar__item')) {
		return HELP_CENTER_POSITION.MASTERBAR;
	}
	if (element.classList.contains('entry-point-button')) {
		return HELP_CENTER_POSITION.EDITOR;
	}
	return 0;
};

const getDefaultPosition = () => ({
	left: window?.innerWidth - HELP_CENTER_WIDTH - AESTHETIC_OFFSET,
	top: 50,
	transformOrigin: 'center',
});

/**
 * This function calculates the position of the Help Center based on the last click event.
 * @param element The element that was clicked
 * @return object with left and top properties
 */
const calculateOpeningPosition = (element) => {
	const { innerWidth, innerHeight } = window;
	const helpCenterHeight = Math.min(800, innerHeight * 0.8);

	// To prevent Help Center from not being shown if an element is not found.
	if (!element) {
		return getDefaultPosition();
	}

	const { x, y, width, height } = element.getBoundingClientRect();
	const position = getOriginElementOffset(element);
	const buttonLeftEdge = x - position;
	const buttonTopEdge = y;
	const buttonBottomEdge = y + height;

	const coords = {
		top: buttonBottomEdge + AESTHETIC_OFFSET,
		left: buttonLeftEdge,
		transformOrigin: 'top left',
	};

	if (buttonTopEdge + helpCenterHeight + AESTHETIC_OFFSET > innerHeight) {
		// Align the bottom edge of the help center with the top edge of the button
		coords.top = buttonTopEdge - helpCenterHeight - AESTHETIC_OFFSET;
		coords.transformOrigin = 'bottom';
	} else {
		// Align the top edge of the help center with the bottom edge of the button
		coords.top = buttonBottomEdge + AESTHETIC_OFFSET;
		coords.transformOrigin = 'top';
	}

	if (buttonLeftEdge + HELP_CENTER_WIDTH + AESTHETIC_OFFSET > innerWidth) {
		// Align right edge of the help center with the right edge of the button
		const buttonRightEdge = x + width + position;
		coords.left = buttonRightEdge - HELP_CENTER_WIDTH;
		coords.transformOrigin += ' right';
	} else {
		// Align left edge of the help center with the left edge of the button
		coords.left = buttonLeftEdge;
		coords.transformOrigin += ' left';
	}

	const isOffScreen =
		coords.top < 0 ||
		coords.left < 0 ||
		coords.left + HELP_CENTER_WIDTH > innerWidth ||
		coords.top + helpCenterHeight > innerHeight;

	return isOffScreen ? getDefaultPosition() : coords;
};

/**
 * This hook determines the position of the Help Center based on the last click event.
 * @param isMinimized If the Help Center is minimized
 * @return object with left and top properties
 */
export function useOpeningCoordinates(isMinimized) {
	const [openingCoordinates, setOpeningCoordinates] =
		useState(getDefaultPosition());

	// useEffect(() => {
	// 	if (isMinimized) {
	// 		return;
	// 	}
	// 	const handler = (event) => {
	// 		try {
	// 			const path = event.composedPath();
	// 			const openingElement =
	// 				path.find((element) => element) || path[0];
	// 			setOpeningCoordinates(calculateOpeningPosition(openingElement));
	// 		} catch (e) {
	// 			// Handle unexpected click targets
	// 		}
	// 	};

	// 	document.addEventListener('mousedown', handler);
	// 	return () => document.removeEventListener('mousedown', handler);
	// }, []);
	if (isMinimized && openingCoordinates) {
		return {
			...openingCoordinates,
			top: 'auto',
			transformOrigin: 'bottom right',
		};
	}

	return openingCoordinates;
}
