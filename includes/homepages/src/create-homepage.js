/**
 * WordPress Dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { POST_TYPE } from './constants';

export default async function createHomepage(
	homepageTitle,
	defaultContent,
	status = 'draft'
) {
	const args = {
		title: homepageTitle,
		content: defaultContent,
		status,
	};

	const { saveEntityRecord } = dispatch(coreStore);

	const newHomepage = await saveEntityRecord('postType', POST_TYPE, args);

	if (newHomepage) {
		console.log('onCreateHomepage', newHomepage);
		return newHomepage;
	}

	return false;
}
