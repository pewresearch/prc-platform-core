/* eslint-disable no-console */
/**
 * Internal dependencies
 */
import shapeImg from './helpers';

const DEFAULT_STATE = {
	A1: false,
	A2: false,
	A3: false,
	A4: false,
	XL: false,
	facebook: false,
	twitter: false,
};

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
const imgPropagation = (imgData, size) => {
	const state = {};
	if ('A1' === size) {
		state.A2 = shapeImg(imgData, 'A2');
		state.XL = shapeImg(imgData, 'XL');
		state.facebook = shapeImg(imgData, 'facebook');
		state.twitter = shapeImg(imgData, 'twitter');
	}
	if ('A1' === size || 'A2' === size) {
		state.A3 = shapeImg(imgData, 'A3');
		state.A4 = shapeImg(imgData, 'A4');
	}
	if ('facebook' === size) {
		state.twitter = shapeImg(imgData, 'twitter');
	}
	state[size] = shapeImg(imgData, size);
	return state;
};

const chartArtPropagation = (state, size) => {
	const tmpState = state;
	const value = !state[size].chartArt;
	if ('A2' === size) {
		tmpState.A2.chartArt = value;
		tmpState.A3.chartArt = value;
		tmpState.A4.chartArt = value;
	}
	tmpState[size].chartArt = value;
	return tmpState;
};

const reducer = (state = DEFAULT_STATE, action) => {
	console.log('reducer', state, action);
	// eslint-disable-next-line default-case
	switch (action.type) {
		case 'INIT_STORE':
			return { ...action.items };

		case 'RESET_STORE':
			return { ...DEFAULT_STATE };

		case 'STORE_IMAGE':
			return {
				...state,
				...{
					...imgPropagation(action.imgData, action.size),
				},
			};
		case 'TOGGLE_CHART_ART':
			return {
				...state,
				...{
					...chartArtPropagation(state, action.size),
				},
			};
	}

	return state;
};

export default reducer;
