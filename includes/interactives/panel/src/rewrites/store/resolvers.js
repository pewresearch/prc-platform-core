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
		const { _interactive_rewrites } =
			select('core/editor').getEditedPostAttribute('meta');

		console.log('_interactive_rewrites?', _interactive_rewrites);

		if (0 === _interactive_rewrites.length) {
			yield listStoreActions.seed([]);
		}

		// Seed state with data:
		yield listStoreActions.seed(_interactive_rewrites);
	},
};

export default resolvers;
