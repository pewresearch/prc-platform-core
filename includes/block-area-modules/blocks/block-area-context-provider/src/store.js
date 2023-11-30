// createa  quick store using wordpress data api
import { createReduxStore } from '@wordpress/data';

const STORE_NAME = 'prc-platform/block-area-context';

const DEFAULT_STATE = {
	postIds: [],
};

const actions = {
    setPostIds(postIds) {
		return {
			type: 'SET_POST_IDS',
			postIds,
		};
	},
};

const store = createReduxStore( STORE_NAME, {
    reducer( state = DEFAULT_STATE, action ) {
        switch (action.type) {
			case 'SET_POST_IDS':
				return {
					...state,
					postIds: action.postIds,
				};
		}

        return state;
    },
    actions,
    selectors: {
        getPostIds(state) {
			return state.postIds;
		},
    },
} );

export { store, STORE_NAME };

export default store;