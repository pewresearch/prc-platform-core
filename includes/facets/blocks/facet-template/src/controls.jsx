/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect, useMemo } from '@wordpress/element';
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
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';

/**
 * Internal Dependencies
 */

const getTemplateForType = (type, name) => {
	const defaultAttrs = {
		interactiveNamespace: 'prc-platform/facets-context-provider',
		isInteractive: true,
	};
	console.log('getTemplateForType', type, name);
	const label = `${name
		.replace(/_/g, ' ')
		.replace(/\w\S*/g, (w) =>
			w.replace(/^\w/, (c) => c.toUpperCase())
		)} Value`;
	switch (type) {
		case 'checkboxes':
			return [
				[
					'prc-block/form-input-checkbox',
					{
						type: 'checkbox',
						label,
						...defaultAttrs,
					},
				],
			];
		case 'dropdown':
			return [
				[
					'prc-block/form-input-select',
					{
						placeholder: label,
						...defaultAttrs,
					},
				],
			];
		case 'yearly':
			return [
				[
					'prc-block/form-input-select',
					{
						placeholder: label,
						...defaultAttrs,
					},
				],
			];
		case 'date_range':
			return [
				[
					'prc-block/form-input-select',
					{
						placeholder: label,
						...defaultAttrs,
					},
				],
				[
					'prc-block/form-input-select',
					{
						placeholder: label,
						...defaultAttrs,
					},
				],
			];
		default:
			// Default to Radio
			return [
				[
					'prc-block/form-input-checkbox',
					{
						type: 'radio',
						label,
						...defaultAttrs,
					},
				],
			];
	}
};

export default function Controls({
	attributes,
	setAttributes,
	context,
	clientId,
}) {
	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const { facetName, facetLabel, facetType } = attributes;

	const { facetsContextProvider } = context;

	const options = useMemo(() => {
		if (!facetsContextProvider) {
			return [
				{
					label: 'No Facets Found',
					value: '',
				},
			];
		}
		const newOptions = [
			{
				label: 'Select a Facet',
				value: '',
			},
		];
		Object.keys(facetsContextProvider).forEach((facetKey) => {
			newOptions.push({
				label: facetsContextProvider[facetKey].label,
				value: facetsContextProvider[facetKey].name,
			});
		});
		return newOptions;
	}, [facetsContextProvider]);

	return (
		<InspectorControls>
			<PanelBody title="Facet Template">
				<div>
					<SelectControl
						label="Facet"
						help="Select a facet from those registered with FacetWP."
						options={options}
						value={facetName}
						onChange={(value) => {
							const name = value;
							const { type } = facetsContextProvider[name];
							const { label } = facetsContextProvider[name];
							setAttributes({
								facetName: name,
								facetType: type,
								facetLabel: label,
							});

							const defaultTemplate = getTemplateForType(
								type,
								name
							);
							replaceInnerBlocks(
								clientId,
								createBlocksFromInnerBlocksTemplate(
									defaultTemplate
								),
								false
							);
						}}
					/>
					<ExternalLink href="/pewresearch-org/wp-admin/options-general.php?page=facetwp">
						FacetWP Settings
					</ExternalLink>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
