/**
 * WordPress Dependencies
 */
import { combineReducers } from "@wordpress/data";

const DEFAULT_STATE = [];

const reducer = (state = DEFAULT_STATE, action) => {
	// Cloned is used in reorder, setItem, and setItemProp:
	const cloned = [...state];
	// eslint-disable-next-line default-case
	switch (action.type) {
		case 'SEED':
			return [...action.items];
		case 'APPEND':
			return [...state, ...action.items];
		case 'PREPEND':
			return [...action.items, ...state];
		case 'INSERT':
			return [
				...state.slice(0, action.index),
				...action.items,
				...state.slice(action.index),
			];
		case 'APPLY':
			return state.map((item, index) => action.fn(item, index));
		case 'REMOVE':
			return state.filter((_, index) => !action.indexes.includes(index));
		case 'REORDER':
			// eslint-disable-next-line no-case-declarations
			const item = state[action.from];

			cloned.splice(action.from, 1);
			cloned.splice(action.to, 0, item);

			return cloned;
		case 'SET_ITEM':
			cloned[action.index] = action.item;
			return cloned;
		case 'SET_ITEM_PROP':
			cloned[action.index] = {
				...cloned[action.index],
				[action.prop]: action.value,
			};
			return cloned;
	}

	return state;
};

export default reducer;
