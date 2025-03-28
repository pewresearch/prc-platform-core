const actions = {
	seed(items) {
		return {
			type: 'SEED',
			items,
		};
	},
	append(...items) {
		return {
			type: 'APPEND',
			items,
		};
	},
	prepend(...items) {
		return {
			type: 'PREPEND',
			items,
		};
	},
	insert(index, ...items) {
		return {
			type: 'INSERT',
			index,
			items,
		};
	},
	apply(fn) {
		return {
			type: 'APPLY',
			fn,
		};
	},
	remove(...indexes) {
		return {
			type: 'REMOVE',
			indexes,
		};
	},
	reorder({ from, to }) {
		return {
			type: 'REORDER',
			from,
			to,
		};
	},
	setItem(index, item) {
		return {
			type: 'SET_ITEM',
			index,
			item,
		};
	},
	setItemProp(index, prop, value) {
		return {
			type: 'SET_ITEM_PROP',
			index,
			prop,
			value,
		};
	},
};

export default actions;
