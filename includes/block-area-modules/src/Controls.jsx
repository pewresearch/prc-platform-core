/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { Button, TextControl, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import DetachEntityMenuControl from './DetachEntityMenuControl';
import { POST_TYPE, POST_TYPE_LABEL, TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function Controls({ attributes, clientId, blocks, blockAreaId, blockModuleId }) {
	// Block Area:
	const [blockAreaName, setBlockAreaName] = useEntityProp('taxonomy', TAXONOMY, 'name', blockAreaId);

	// Block Module:
	const [blockModuleTitle, setBlockModuleTitle] = useEntityProp('postType', POST_TYPE, 'title', blockModuleId);

	return (
		<Fragment>
			<DetachEntityMenuControl {...{ blocks, clientId }} />
			<InspectorControls>
				<PanelBody>
					<div>
						<TextControl
							label={__(`${TAXONOMY_LABEL} Name`)}
							value={blockAreaName}
							onChange={setBlockAreaName}
						/>

					</div>
					<div>
						<TextControl
							__nextHasNoMarginBottom
							label={__(`${POST_TYPE_LABEL} Title`)}
							value={blockModuleTitle}
							onChange={setBlockModuleTitle}
						/>
					</div>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}
