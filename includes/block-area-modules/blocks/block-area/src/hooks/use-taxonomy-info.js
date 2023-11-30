/**
 * External Dependencies
 */
import { useTaxonomy } from '@prc/hooks';

/**
 * Internal Dependencies
 */
import { TAXONOMY } from '../constants';

/**
 * Given a block area slug and category slug, returns the block area id and name and category id and name.
 * @param {*} blockAreaSlug
 * @param {*} categorySlug
 * @returns
 */
export default function useTaxonomyInfo(blockAreaSlug = null, categorySlug =  null) {
	const [categoryId, categoryName] = useTaxonomy('category', categorySlug);
	const [blockAreaId, blockAreaName] = useTaxonomy(TAXONOMY, blockAreaSlug);

	return {
		blockAreaId,
		blockAreaName,
		categoryId,
		categoryName,
	}
}
