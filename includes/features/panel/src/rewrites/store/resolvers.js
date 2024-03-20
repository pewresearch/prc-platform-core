/**
 * External Dependencies
 */
import { listStoreActions } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

// Initially resolve if there is saved data.
const resolvers = {
	*getItems() {
		const { _feature_rewrites } =
			select('core/editor').getEditedPostAttribute('meta');

		console.log('_feature_rewrites?', _feature_rewrites);

		if (0 === _feature_rewrites.length) {
			yield listStoreActions.seed([]);
		}

		// Seed state with data:
		yield listStoreActions.seed(_feature_rewrites);
	},
};

export default resolvers;
