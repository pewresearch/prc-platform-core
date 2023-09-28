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
import { Button, TextControl, PanelBody, ExternalLink } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import DetachEntityMenuControl from './DetachEntityMenuControl';
import { POST_TYPE, POST_TYPE_LABEL, TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function Controls({ setAttributes, clientId, blocks, blockAreaId, blockModuleId }) {
	// Block Area:
	const [blockAreaName, setBlockAreaName] = useEntityProp('taxonomy', TAXONOMY, 'name', blockAreaId);

	// Block Module:
	const [blockModuleTitle, setBlockModuleTitle] = useEntityProp('postType', POST_TYPE, 'title', blockModuleId);
	const [blockModuleLink] = useEntityProp('postType', POST_TYPE, 'link', blockModuleId);

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
					<div>
						<ExternalLink href={blockModuleLink}>{`Edit ${POST_TYPE_LABEL}`}</ExternalLink>
					</div>
					<div>
						<Button
							isDestructive
							variant="secondary"
							onClick={() => {
								setAttributes({
									blockAreaSlug: null,
									categorySlug: null,
									inheritCategory: false,
								});
							}}
						>
							{__('Reset Block Area')}
						</Button>
					</div>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}
