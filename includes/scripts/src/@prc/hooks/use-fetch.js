import { useEffect, useRef, useReducer } from '@wordpress/element';

/**
 * A react hook to fetch data from a url and store status, errors, and date in state.
 * Usage: const { status, data, error } = useFetch(url);
 * Adapted from https://www.smashingmagazine.com/2020/07/custom-react-hook-fetch-cache-data/
 * Example application: https://codesandbox.io/s/usefetch-demo-clt9o
 * @param {*} url
 * @returns {object} status, data, and error
 */
const useFetch = (url) => {
	const cache = useRef({});

	// initial state, no preloaded data
	const initialState = {
		status: 'idle',
		error: null,
		data: [],
	};

	// reducer function to update state depending on current status of fetch
	const reducer = (state, action) => {
		switch (action.type) {
			case 'FETCHING':
				return { ...initialState, status: 'fetching' };
			case 'FETCHED':
				return {
					...initialState,
					status: 'fetched',
					data: action.payload,
				};
			case 'FETCH_ERROR':
				return {
					...initialState,
					status: 'error',
					error: action.payload,
				};
			default:
				return state;
		}
	};
	// useReducer instead of useState to set multiple values simultaneously and prevent unnecessary rerenders.
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		let cancelRequest = false;
		if (!url) return undefined;

		const fetchData = async () => {
			dispatch({ type: 'FETCHING' });
			if (cache.current[url]) {
				const data = cache.current[url];
				dispatch({ type: 'FETCHED', payload: data });
			} else {
				try {
					const response = await fetch(url);
					const data = await response.json();
					cache.current[url] = data;
					if (!cancelRequest) {
						dispatch({ type: 'FETCHED', payload: data });
					}
				} catch (error) {
					if (!cancelRequest) {
						dispatch({
							type: 'FETCH_ERROR',
							payload: error.message,
						});
					}
				}
			}
		};

		fetchData();

		// cleanup switch to prevent data leak on unmount
		return function cleanup() {
			cancelRequest = true;
		};
	}, [url]);

	return state;
};

export default useFetch;
