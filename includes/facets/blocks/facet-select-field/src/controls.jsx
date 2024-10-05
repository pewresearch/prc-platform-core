/**
 * External Dependencies
 */
import { Sorter } from '@prc/controls';

/**
 * WordPress Dependencies
 */
import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */

export default function Controls({
	attributes,
	setAttributes,
	clientId,
	context,
}) {
	const { placeholder, disabled } =
		attributes;

	return (
		<InspectorControls>
			<PanelBody title={__('Form Input Field Settings')}>
				<TextControl
					label="Placeholder"
					value={placeholder}
					onChange={(newPlaceholder) => {
						setAttributes({ placeholder: newPlaceholder });
					}}
				/>
				<ToggleControl
					label="Disabled"
					checked={disabled}
					help="If toggled on, the user cannot interact with this input."
					onChange={(val) => {
						setAttributes({ disabled: val });
					}}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
