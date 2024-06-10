import { registerBlockVariation } from '@wordpress/blocks';

registerBlockVariation('core/paragraph', {
	name: 'Dataset Description',
	title: 'Dataset Description Binding',
	description: 'Displays the description for the dataset.',
	attributes: {
		content:
			'Displays the description for the dataset. Adipisicing fugiat veniam sunt tempor est anim laboris reprehenderit esse labore ut ea. Reprehenderit excepteur pariatur eu fugiat eu. Ipsum aliquip voluptate fugiat magna labore Lorem ex nulla nisi labore sit.',
		metadata: {
			bindings: {
				content: {
					source: 'prc-platform/dataset-description',
				},
			},
		},
	},
});
