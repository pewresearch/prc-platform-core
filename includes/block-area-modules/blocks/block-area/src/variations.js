/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'topic-block-area',
		isDefault: true,
		title: __('Topic Block Area'),
		description: __('The default block area, queries by topic category.'),
		attributes: { taxonomyName: 'category' },
		scope: ['inserter', 'transform'],
		isActive: (blockAttributes, variationAttributes) =>
			variationAttributes.taxonomyName === blockAttributes.taxonomyName,
	},
	{
		name: 'regions-countries-block-area',
		title: __('Regions Countries Block Area'),
		description: __(
			'This block area queries by regions and countries taxonomy.'
		),
		attributes: { taxonomyName: 'regions-countries' },
		scope: ['inserter', 'transform'],
		isActive: (blockAttributes, variationAttributes) =>
			variationAttributes.taxonomyName === blockAttributes.taxonomyName,
	},
	{
		name: 'collections-block-area',
		title: __('Collections Block Area'),
		description: __(
			'This block area queries by collections and countries taxonomy.'
		),
		attributes: { taxonomyName: 'collection' },
		scope: ['inserter', 'transform'],
		isActive: (blockAttributes, variationAttributes) =>
			variationAttributes.taxonomyName === blockAttributes.taxonomyName,
	},
];
