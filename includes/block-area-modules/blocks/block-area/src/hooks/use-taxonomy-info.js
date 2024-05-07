/**
 * External Dependencies
 */
import { useTaxonomy } from '@prc/hooks';

/**
 * Internal Dependencies
 */
import { TAXONOMY } from '../constants';

/**
 * Given a block area slug and category slug this function
 * returns the block area id and name as well as the given taxonomies id and name.
 * @param {string} blockAreaSlug    The block area slug.
 * @param {string} taxonomyName     The taxonomy name.
 * @param {string} taxonomyTermSlug The taxonomy term slug.
 * @return {Object} The block area id and name as well as the taxonomy id and name.
 */
export default function useTaxonomyInfo(
	blockAreaSlug = null,
	taxonomyName = null,
	taxonomyTermSlug = null
) {
	let taxRestName = taxonomyName;
	if (taxonomyName === 'category') {
		taxRestName = 'categories';
	}
	const [taxId, taxName] = useTaxonomy(taxRestName, taxonomyTermSlug);
	const [blockAreaId, blockAreaName] = useTaxonomy(TAXONOMY, blockAreaSlug);
	console.log(
		'useTaxonomyInfo',
		blockAreaSlug,
		taxonomyName,
		taxonomyTermSlug,
		taxId,
		taxName,
		blockAreaId,
		blockAreaName
	);

	return {
		blockAreaId,
		blockAreaName,
		taxonomyTermId: taxId,
		taxonomyTermName: taxName,
	};
}
