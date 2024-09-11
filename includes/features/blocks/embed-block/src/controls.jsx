/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 * @param root0
 * @param root0.attributes
 * @param root0.clientId
 * @param root0.blocks
 */
// import DetachFeature from './convert-to-blocks';

export default function Controls({ attributes, clientId, blocks }) {
	const { ref } = attributes;

	const [permalink] = useEntityProp('postType', 'feature', 'link', ref);

	return (
		<Fragment>
			{/* I don't think we need the ability to detach. Will leave in case. */}
			{/* <DetachFeature {...{ blocks, clientId }} /> */}
			<InspectorControls>
				<PanelBody>
					<Button
						variant="secondary"
						onClick={() => {
							window.open(permalink, '_blank');
						}}
					>
						View original feature in new tab
					</Button>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}
