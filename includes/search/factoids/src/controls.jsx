/* eslint-disable @wordpress/i18n-no-variables */
/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/* eslint-disable max-lines-per-function */
/* eslint-disable @wordpress/no-base-control-with-label-without-id */
/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	BaseControl,
	Button,
	TextControl,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

export default function Controls({
	isMissing,
	searchTerm,
	setSearchTerm
}) {
	return (
		<InspectorControls>
			<PanelBody>
				<PanelRow>
					<TextControl
						label={__('Search', 'prc-platform-search-factoids')}
						value={searchTerm}
						onChange={setSearchTerm}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
}
