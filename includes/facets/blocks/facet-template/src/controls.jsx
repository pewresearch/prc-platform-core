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
		interactiveNamespace: 'facetsContextProvider',
		isInteractive: true,
	}
	const label = name.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) + ' Value';
	switch (type) {
		case 'checkboxes':
			return [['prc-block/form-field', {
				className: 'is-style-form-field-input-checkbox',
				label,
				...defaultAttrs,
			}, [
				['prc-block/form-input-checkbox', {
					type: 'checkbox',
					...defaultAttrs,
				}]
			]]]
			break;
		case 'radio':
			return [['prc-block/form-field', {
				className: 'is-style-form-field-input-radio',
				label,
				...defaultAttrs,
			}, [
				['prc-block/form-input-checkbox', {
					type: 'radio',
					...defaultAttrs,
				}]
			]]]
			break;
		case 'time_since':
			return [['prc-block/form-field', {
				className: 'is-style-form-field-input-radio',
				label,
				...defaultAttrs,
			}, [
				['prc-block/form-input-checkbox', {
					type: 'radio',
					...defaultAttrs,
				}]
			]]]
			break;
		// @TODO: define dropdown block from Ben
		// @TODO: define time since and year range options.
		default:
			return [['prc-block/form-field', {
				className: 'is-style-form-field-input-text',
				label,
				...defaultAttrs,
			}, [
				['prc-block/form-input-text', {
					type: 'text',
					...defaultAttrs,
				}]
			]]]
			break;
	}
}

export default function Controls({ attributes, setAttributes, context, clientId }) {

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const {
		facetName,
		facetLabel,
		facetType,
	} = attributes;

	const { facetsContextProvider } = context;

	const options = useMemo(()=>{
		if ( ! facetsContextProvider ) {
			return [
				{
					label: 'No Facets Found',
					value: '',
				}
			];
		}
		const newOptions = [{
			label: 'Select a Facet',
			value: '',
		}];
		Object.keys(facetsContextProvider).forEach( facetKey => {
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
						options={ options }
						value={ facetName }
						onChange={ ( value ) => {
							const name = value;
							const type = facetsContextProvider[name].type;
							const label = facetsContextProvider[name].label;
							setAttributes( {
								facetName: name,
								facetType: type,
								facetLabel: label,
							} );

							const defaultTemplate = getTemplateForType(type, name);
							replaceInnerBlocks(
								clientId,
								createBlocksFromInnerBlocksTemplate(defaultTemplate),
								false,
							);
						} }
					/>
					<ExternalLink href="/pewresearch-org/wp-admin/options-general.php?page=facetwp">FacetWP Settings</ExternalLink>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
