/**
 * WordPress Dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import ListStoreItem from './item';
import actions from './actions';
import reducer from './reducer';

const registerListStore = (name, resolvers = false, selectors = false) => {
	if (false === resolvers || false === selectors) {
		console.warn(
			'registerListStore requires at least one resolver and one selector',
			'resolvers:',
			resolvers,
			'selectors',
			selectors,
		);
	}
	const store = createReduxStore(name, {
		reducer,
		actions,
		selectors,
		controls: {},
		resolvers,
	});
	console.log(`@prc/components/list-store: registerListStore(${name})`);
	register(store);
};

export { registerListStore, ListStoreItem, actions, reducer };
export default registerListStore;
