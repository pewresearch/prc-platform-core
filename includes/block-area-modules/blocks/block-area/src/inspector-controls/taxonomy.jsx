/**
 * External Dependencies
 */
import { TermSelect } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToggleControl, FlexBlock } from '@wordpress/components';

/**
 * Internal Dependencies
 */

export default function TaxonomyControl({
	attributes,
	setAttributes,
	taxonomy,
}) {
	const { id, name, slug } = taxonomy;
	const { inheritTermFromTemplate, taxonomyName, taxonomyTermSlug } =
		attributes;

	const termValue = useMemo(() => {
		if (!id) {
			return [];
		}
		return [
			{
				value: slug,
				title: name,
			},
		];
	}, [id, name, slug]);

	return (
		<FlexBlock>
			<ToggleControl
				label={__('Inherit Term From Template', 'prc-platform-core')}
				checked={inheritTermFromTemplate}
				onChange={(value) => {
					setAttributes({
						inheritTermFromTemplate: value,
						taxonomyTermSlug:
							true === value ? null : taxonomyTermSlug,
					});
				}}
			/>
			{!inheritTermFromTemplate && (
				<TermSelect
					{...{
						onChange: (value) => {
							console.log('onChange...', value);
							// if empty set term slug to empty as well
							if (!value) {
								setAttributes({ taxonomyTermSlug: null });
							} else {
								setAttributes({ taxonomyTermSlug: value.slug });
							}
						},
						taxonomy: taxonomyName,
						value: termValue,
						maxTerms: 1,
					}}
				/>
			)}
		</FlexBlock>
	);
}
