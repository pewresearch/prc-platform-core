/**
 * External Dependencies
 */
import { useTaxonomy } from '@prc/hooks';

/**
 * Internal Dependencies
 */
import { TAXONOMY } from '../constants';

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
