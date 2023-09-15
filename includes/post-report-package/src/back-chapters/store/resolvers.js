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
		const meta = select('core/editor').getEditedPostAttribute('meta');

		const { multiSectionReport } = meta;
		const backChapters = meta?.back_chapters;

		console.log('multiSectionReport?', meta, multiSectionReport, backChapters);

		if (null === multiSectionReport) {
			return;
		}

		// Seed state
		yield listStoreActions.seed(multiSectionReport);
	},
};

export default resolvers;
