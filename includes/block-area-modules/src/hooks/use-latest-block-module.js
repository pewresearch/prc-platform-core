/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import { POST_TYPE, TAXONOMY } from '../constants';

export default function useLatestBlockModule(blockAreaId = null, categoryId =  null, options = { enabled: false }) {
	const queryArgs = {
		context: 'view',
		orderby: 'date',
		order: 'desc',
	};
	if (categoryId) {
		queryArgs['categories'] = [categoryId];
	}
	if (blockAreaId) {
		queryArgs[TAXONOMY] = [blockAreaId];
	}
	if (blockAreaId && categoryId) {
		queryArgs['tax_relation'] = 'AND';
	}
	console.log('useLatestBlockModule', queryArgs);
	const {records, hasResolved} = useEntityRecords( 'postType', POST_TYPE, queryArgs, options );
	return {
		blockModuleId: records?.[ 0 ]?.id,
		hasResolved,
	}
}
