/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import { POST_TYPE, TAXONOMY } from '../constants';

export default function useLatestBlockModule(blockArea = null, category =  null, options = { enabled: false }) {

	const { categoryId, categoryName, blockAreaId, blockAreaName } = useSelect( select => {
		const { getEntityRecords } = select( coreStore );
		const cat = getEntityRecords( 'taxonomy', 'category', {
			context: 'view',
			per_page: 1,
			_fields: [ 'id', 'name' ],
			slug: category,
		} );
		const area = getEntityRecords( 'taxonomy', TAXONOMY, {
			context: 'view',
			per_page: 1,
			_fields: [ 'id', 'name' ],
			slug: blockArea,
		} );
		return {
			categoryId: cat?.[ 0 ]?.id,
			categoryName: cat?.[ 0 ]?.name,
			blockAreaId: area?.[ 0 ]?.id,
			blockAreaName: area?.[ 0 ]?.name,
		}
	});

	const queryArgs = {
		context: 'view',
		orderby: 'date',
		order: 'desc',
	};
	if (categoryId) {
		queryArgs.category = [categoryId];
	}
	if (blockAreaId) {
		queryArgs[TAXONOMY] = [blockAreaId];
	}
	return useEntityRecords( 'postType', POST_TYPE, queryArgs, options );
}
