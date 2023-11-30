/**
 * External Dependencies
 */
import { TermSelect } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl, ToggleControl, ExternalLink, Flex, FlexBlock, FlexItem, CardDivider } from '@wordpress/components';

/**
 * Internal Dependencies
 */

export default function CategoryControl({
	attributes,
	setAttributes,
	category
}) {
	const {id, name, slug} = category;

	const {inheritCategory, categorySlug} = attributes;

	const categoryValue = useMemo(() => {
		if (!id) {
			return [];
		}
		return [
			{
				value: slug,
				title: name,
			}
		];
	}, [id, name, slug]);

	return (
		<FlexBlock>
			<ToggleControl
				label={__('Inherit Category', 'prc-platform-core')}
				checked={inheritCategory}
				onChange={(value) => {
					setAttributes({
						inheritCategory: value,
						categorySlug: true === value ? null : categorySlug,
					});
				}}
			/>
			{!inheritCategory && (
				<TermSelect {...{
					onChange: (value) => {
						console.log("onChange...", value);
						// if value is empty we shoudl setCategory to null
						if (!value) {
							setAttributes({categorySlug: null});
						} else {
							setAttributes({categorySlug: value.slug});
						}
					},
					taxonomy: 'category',
					value: categoryValue,
					maxTerms: 1,
				}}/>
			)}
		</FlexBlock>
	);
}
