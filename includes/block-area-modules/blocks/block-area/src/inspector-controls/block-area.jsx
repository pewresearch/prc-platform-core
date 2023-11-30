/**
 * WordPress Dependencies
 */
import { Fragment, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl, Button, ToggleControl, FlexBlock, FlexItem, CardDivider } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from '../constants';

export default function BlockAreaControl({
	attributes,
	setAttributes,
	blockArea,
	postStatus,
	setPostStatus
}) {
	const { metadata, ref } = attributes;

	const {id, name, slug} = blockArea;

	// Block Area:
	const [blockAreaName, setBlockAreaName] = useEntityProp('taxonomy', TAXONOMY, 'name', id);

	// This will check if the block area already has a label in the block editor and if not, it will set it to the block area name.
	useEffect(() => {
		if (! metadata?.name && blockAreaName) {
			setAttributes({
				metadata: {
					...metadata,
					name: blockAreaName,
				},
			});
		}
	}, [metadata, blockAreaName]);

	if (!id) {
		return null;
	}

	return (
		<Fragment>
			<FlexBlock>
				<TextControl
					label={__(`${TAXONOMY_LABEL} Name`)}
					value={blockAreaName}
					onChange={setBlockAreaName}
				/>
			</FlexBlock>
			<FlexBlock>
				<ToggleControl
					label={__('Preview Latest Draft Module', 'prc-platform-core')}
					checked={'draft' === postStatus}
					help={__('This will allow you to preview and edit the latest draft module in the block area. This will not be visible on the front end, the latest published module will always be visible.', 'prc-platform-core')}
					onChange={(value) => {
						setPostStatus(value ? 'draft' : 'publish');
					}}
				/>
			</FlexBlock>
			<FlexBlock>
				<Button
					isDestructive
					variant="secondary"
					onClick={() => {
						setAttributes({
							ref: null,
							blockAreaSlug: null,
							categorySlug: null,
							inheritCategory: null,
						});
					}}
				>
					{__('Reset Block Area')}
				</Button>
			</FlexBlock>
		</Fragment>
	);
}
