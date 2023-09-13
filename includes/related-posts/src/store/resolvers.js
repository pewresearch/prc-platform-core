import { select } from '@wordpress/data';
import { listStoreActions } from '@prc-app/shared';

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
	*getItems() {
		const { relatedPosts } =
			select('core/editor').getEditedPostAttribute('meta');

		console.log('relatedPosts?', relatedPosts);

		if (0 === relatedPosts.length) {
			return;
		}

		// Seed state with data:
		yield listStoreActions.seed(relatedPosts);
	},
};

export default resolvers;
