/**
 * Internal Dependencies
 */
import { TAXONOMY } from '../constants';
import {getTaxonomyBySlug} from '../utils';

export default function useTaxonomyInfo(blockAreaSlug = null, categorySlug =  null) {
	const [categoryId, categoryName] = getTaxonomyBySlug('category', categorySlug);
	const [blockAreaId, blockAreaName] = getTaxonomyBySlug(TAXONOMY, blockAreaSlug);

	return {
		blockAreaId,
		blockAreaName,
		categoryId,
		categoryName,
	}
}
