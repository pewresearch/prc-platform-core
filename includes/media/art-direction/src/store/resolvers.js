/* eslint-disable no-console */
/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import actions from './actions';

const isJson = (str) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

// Initially resolve if there is saved data.
const resolvers = {
	*getArt() {
		const { _art, artDirection } = select('core/editor').getEditedPostAttribute('meta');

		// check if artDirection is set, is an object with values and if so then yield actions.initstore that value early...
		if (artDirection && Object.keys(artDirection).length > 0) {
			yield actions.initStore(artDirection);
		}

		// Fallback for legacy data:
		console.warn('deprecated: _art', _art);

		if (!isJson(_art)) {
			return;
		}

		const decodedItems = JSON.parse(_art);
		console.log('art!', decodedItems);

		// Seed state with parsed JSON string data:
		yield actions.initStore(decodedItems);
	},
};

export default resolvers;
