/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { useTaxonomy } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { Fragment, useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { BaseControl, ToggleControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY_LABEL } from '../../constants';

export default function QueryB({
	categorySlug,
	templateSlug,
	allowCategorySelection,
	inheritCategory,
	toggleAllowCategorySelection = () => {},
	setInheritCategory = () => {},
	setCategorySlug = () => {},
	buttonState,
	setButtonState,
	setNextStep,
}) {
	const isCategoryTemplate = undefined !== templateSlug && templateSlug?.includes('category');
	const templateSlugCleaned = templateSlug?.replace( 'category-', '' );

	const [templateCatId, templateCatName] = useTaxonomy('category', templateSlugCleaned);
	const [catId, catName] = useTaxonomy('category', categorySlug);

	useEffect(()=> {
		const newButtonargs = {
			...buttonState,
			text: 'Next',
			disabled: true,
			onClick: () => setNextStep('query-c'),
		}
		if (!allowCategorySelection) {
			newButtonargs.disabled = false;
		} else {
			if ( !inheritCategory && !categorySlug ) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			if ( isCategoryTemplate && !inheritCategory && !categorySlug ) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			if ( !isCategoryTemplate && !categorySlug ) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			console.log("templateSlug", templateSlug);
		}
		setButtonState(newButtonargs);
	}, [allowCategorySelection, inheritCategory, categorySlug, templateSlug]);

	return (
		<div>
		<BaseControl label={__('Query by Category?', 'prc-platform-core')}>
			<ToggleControl
				label={ __('Query by Category') }
				checked={ allowCategorySelection }
				onChange={ () => toggleAllowCategorySelection() }
			/>
		</BaseControl>
		{ allowCategorySelection && (
			<Fragment>
				{ isCategoryTemplate && (
					<BaseControl label={__('Inherit Category from Template?', 'prc-platform-core')}>
						<ToggleControl
							label={ inheritCategory ? __('Yes', 'prc-platform-core') : __('No', 'prc-platform-core') }
							checked={ inheritCategory }
							onChange={ () => setInheritCategory(!inheritCategory) }
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
							setCategorySlug(entity.slug);
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
			</Fragment>
		)}
		</div>
	);
}
