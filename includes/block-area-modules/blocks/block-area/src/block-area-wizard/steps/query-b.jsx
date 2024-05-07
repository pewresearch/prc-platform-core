/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { useTaxonomy } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BaseControl, ToggleControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY_LABEL } from '../../constants';

/**
 * Search for and select a taxonomy, or inherit from the template.
 *
 * @param {Object}   props                              Component props.
 * @param {string}   props.categorySlug                 The category slug.
 * @param {string}   props.templateSlug                 The template slug.
 * @param {boolean}  props.allowCategorySelection       Allow category selection.
 * @param {boolean}  props.inheritCategory              Inherit category from template.
 * @param {Function} props.toggleAllowCategorySelection Toggle category selection.
 * @param {Function} props.setInheritCategory           Set inherit category.
 * @param {Function} props.setCategorySlug              Set category slug.
 * @param {Object}   props.buttonState                  The button state.
 * @param {Function} props.setButtonState               Set button state.
 * @param {Function} props.setNextStep                  Set the next step.
 * @param            props.taxonomyName
 * @param            props.setTaxonomyName
 * @param            props.taxonomyTermSlug
 * @param            props.setTaxonomyTermSlug
 * @param            props.allowTaxonomySelection
 * @param            props.inheritTermFromTemplate
 * @param            props.toggleAllowTaxonomySelection
 * @param            props.setInheritTermFromTemplate
 * @return {*} The component.
 */
export default function QueryB({
	taxonomyName,
	setTaxonomyName,
	taxonomyTermSlug,
	setTaxonomyTermSlug,
	templateSlug,
	allowTaxonomySelection,
	inheritTermFromTemplate,
	toggleAllowTaxonomySelection,
	setInheritTermFromTemplate,
	buttonState,
	setButtonState,
	setNextStep,
}) {
	console.log('taxonomyName', taxonomyName, templateSlug);
	const isTaxonomyTemplate =
		undefined !== templateSlug && templateSlug?.includes(`${taxonomyName}`);
	const templateSlugCleaned = templateSlug?.replace(`${taxonomyName}-`, '');

	const [templateTermId, templateTermName] = useTaxonomy(
		taxonomyName,
		templateSlugCleaned
	);
	const [termId, termName] = useTaxonomy(taxonomyName, taxonomyTermSlug);

	useEffect(() => {
		const newButtonargs = {
			...buttonState,
			text: 'Next',
			disabled: true,
			onClick: () => setNextStep('query-c'),
		};
		if (!allowTaxonomySelection) {
			newButtonargs.disabled = false;
		} else {
			if (!inheritTermFromTemplate && !taxonomyTermSlug) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			if (
				isTaxonomyTemplate &&
				!inheritTermFromTemplate &&
				!taxonomyTermSlug
			) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			if (!isTaxonomyTemplate && !taxonomyTermSlug) {
				newButtonargs.disabled = true;
			} else {
				newButtonargs.disabled = false;
			}
			console.log('templateSlug', templateSlug);
		}
		setButtonState(newButtonargs);
	}, [
		allowTaxonomySelection,
		inheritTermFromTemplate,
		taxonomyTermSlug,
		templateSlug,
	]);

	return (
		<div>
			<BaseControl
				label={__('Query by Taxonomy?', 'prc-platform-core')}
				id="query-by-taxonomy-boolean"
			>
				<ToggleControl
					label={__('Query by Taxonomy')}
					checked={allowTaxonomySelection}
					onChange={() => toggleAllowTaxonomySelection()}
				/>
			</BaseControl>
			{allowTaxonomySelection && (
				<Fragment>
					{isTaxonomyTemplate && (
						<BaseControl
							label={__(
								'Inherit Taxonomy Term from Template?',
								'prc-platform-core'
							)}
							id="inherit-taxonomy-term-boolean"
						>
							<ToggleControl
								label={
									inheritTermFromTemplate
										? __('Yes', 'prc-platform-core')
										: __('No', 'prc-platform-core')
								}
								checked={inheritTermFromTemplate}
								onChange={() =>
									setInheritTermFromTemplate(
										!inheritTermFromTemplate
									)
								}
							/>
						</BaseControl>
					)}
					{true !== inheritTermFromTemplate && (
						<WPEntitySearch
							placeholder={`Search for a taxonomy term to filter ${TAXONOMY_LABEL} by`}
							searchLabel={`Search for a taxonomy term to filter ${TAXONOMY_LABEL} by`}
							entityType="taxonomy"
							entitySubType={taxonomyName}
							entityId={templateTermId || termId || false}
							searchValue={templateTermName || termName || ''}
							onSelect={(entity) => {
								console.log('Taxonomy Entity: ', entity);
								setTaxonomyTermSlug(entity.slug);
							}}
							onKeyEnter={() => {
								console.log('Enter Key Pressed');
							}}
							onKeyESC={() => {
								console.log('ESC Key Pressed');
							}}
							perPage={10}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
}
