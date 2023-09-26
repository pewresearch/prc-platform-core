/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { useTaxonomy } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { BaseControl, Placeholder, ToggleControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY_LABEL } from './constants';

export default function CategorySearchSelect({ categorySlug, templateSlug, inheritCategory = false, onInheritChange = () => {}, onCategoryChange = () => {} }) {
	const isCategoryTemplate = undefined !== templateSlug && templateSlug?.includes('category');
	const templateSlugCleaned = templateSlug?.replace( 'category-', '' );

	const [templateCatId, templateCatName] = useTaxonomy('category', templateSlugCleaned);
	const [catId, catName] = useTaxonomy('category', categorySlug);

	return (
		<Placeholder label={__('Category Search Select', 'prc-platform-core')} isColumnLayout={true}>
			{ isCategoryTemplate && (
				<BaseControl label={__('Inherit Category from Template?', 'prc-platform-core')}>
					<ToggleControl
						label={ inheritCategory ? __('Yes', 'prc-platform-core') : __('No', 'prc-platform-core') }
						checked={ inheritCategory }
						onChange={ onInheritChange }
					/>
				</BaseControl>
			) }
			{ (true !== inheritCategory) && (
				<WPEntitySearch
					placeholder={__(`Search for a category to filter ${TAXONOMY_LABEL} by`)}
					searchLabel={__(`Search for a category to filter ${TAXONOMY_LABEL} by`)}
					entityType="taxonomy"
					entitySubType="category"
					entityId={templateCatId || catId || false}
					searchValue={templateCatName || catName || ''}
					onSelect={(entity) => {
						console.log('Category Entity: ', entity);
						onCategoryChange(entity.slug);
					}}
					onKeyEnter={() => {
						console.log("Enter Key Pressed");
					}}
					onKeyESC={() => {
						console.log("ESC Key Pressed");
					}}
					perPage={10}
				/>
			) }
		</Placeholder>
	);
}
