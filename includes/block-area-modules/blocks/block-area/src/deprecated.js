/**
 * Use this file to upgrade block attributes from older versions of the block.
 */
const deprecated = [
	{
		attributes: {
			categorySlug: {
				type: 'string',
			},
			inheritCategory: {
				type: 'boolean',
			},
		},
		migrate({ categorySlug, inheritCategory }) {
			return {
				taxonomyName: 'category',
				taxonomyTermSlug: categorySlug,
				inheritFromTemplate: inheritCategory,
			};
		},
	},
];

export default deprecated;
