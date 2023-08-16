const selectors = {
	getArt(state) {
		return state;
	},
	hasPrimaryImage(state) {
		if (false !== state.A1 && undefined !== state.A1) {
			return true;
		}
		return false;
	},
	isChartArt(state, size) {
		if (Object.keys(state).length === 0) {
			return false;
		}
		if (false !== state[size] && undefined !== state[size].chartArt) {
			return state[size].chartArt;
		}
		return false;
	},
};

export default selectors;
