/**
 * WordPress Dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import {
	POST_TYPE,
	POST_TYPE_LABEL,
	TAXONOMY,
	TAXONOMY_REST_BASE,
} from '../constants';

export default async function createBlockModule(
	blockModuleTitle,
	blockAreaId,
	taxonomyName,
	taxonomyTermId,
	status = 'publish'
) {
	const args = {
		title: blockModuleTitle,
		status,
	};
	if (blockAreaId) {
		args[TAXONOMY_REST_BASE] = [blockAreaId];
	}
	if (taxonomyTermId) {
		args[taxonomyName] = [taxonomyTermId];
	}

	const { saveEntityRecord } = dispatch(coreStore);

	const newBlockModule = await saveEntityRecord('postType', POST_TYPE, args);

	if (newBlockModule) {
		console.log('onCreateBlockModule', newBlockModule);
		return newBlockModule;
	}

	return false;
}
