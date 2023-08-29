/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { BaseControl, ToggleControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function PlaceholderCategorySelect({ attributes, setAttributes, setCategory, context }) {
	const { templateSlug } = context;
	const isCategoryTemplate = templateSlug === 'category';
	const isCategoryTermTemplate = templateSlug?.startsWith( 'category-' );
	const { inheritCategory, categorySlug } = attributes;

	const { templateCategory = false } = useSelect( select => {
		const { getEntityRecords, getTaxonomies } = select( coreStore );
		const templateCat = templateSlug?.startsWith( 'category-' ) && getEntityRecords( 'taxonomy', 'category', {
			context: 'view',
			per_page: 1,
			_fields: [ 'id', 'name' ],
			slug: templateSlug.replace( 'category-', '' ),
		} );
		return {
			templateCategory: templateCat?.[0],
		}
	});

	const onInheritChange = (newVal) => {
		console.log('onInheritChange', newVal);
		const newOption = ! inheritCategory;
		// set attributes, but replace everything in there with the new option, this way if categorySlug is set it'll get removed.
		setAttributes({
			inheritCategory: newOption,
			categorySlug: null,
		});
	};

	useEffect(() => {
		console.log('templateCategory', templateCategory);
	}, [templateCategory]);

	return (
		<div>
			{ (true === isCategoryTermTemplate || true === isCategoryTemplate) && (
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
					entityId={templateCategory?.id || null}
					searchValue={templateCategory?.name || ''}
					onSelect={(entity) => {
						console.log('Category Entity: ', entity);
						setCategory(entity.slug);
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
		</div>
	);
}
