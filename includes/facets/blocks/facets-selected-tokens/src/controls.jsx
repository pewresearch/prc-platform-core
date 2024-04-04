/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect, useCallback } from '@wordpress/element';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	CardDivider,
	ExternalLink,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import ColorControls from './color-controls';

function InspectorPanel({ colors, clientId }) {
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Block Controls">
					<BaseControl label="Do Something">
						<Button variant="primary">Do Something</Button>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<ColorControls colors={colors} clientId={clientId} />
		</Fragment>
	);
}

export default function Controls({
	attributes,
	setAttributes,
	context,
	colors,
	clientId,
}) {
	return (
		<InspectorPanel
			{...{ attributes, setAttributes, context, colors, clientId }}
		/>
	);
}
