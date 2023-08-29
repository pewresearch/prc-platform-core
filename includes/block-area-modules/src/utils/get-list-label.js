/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function getTaxonomyBySlug(taxonomy = null, slug =  null) {
	const { taxId, taxName } = useSelect( select => {
		const { getEntityRecords } = select( coreStore );

		const tax = null !== slug ? getEntityRecords( 'taxonomy', taxonomy, {
			context: 'view',
			per_page: 1,
			_fields: [ 'id', 'name' ],
			slug: slug,
		} ) : null;

		return {
			taxId: tax?.[ 0 ]?.id,
			taxName: tax?.[ 0 ]?.name,
		}
	});

	return [
		taxId,
		taxName,
	];
}
