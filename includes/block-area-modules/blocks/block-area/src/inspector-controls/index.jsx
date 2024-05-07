/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import {
	Button,
	TextControl,
	PanelBody,
	ExternalLink,
	Flex,
	FlexBlock,
	FlexItem,
	CardDivider,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import BlockAreaControl from './block-area';
import BlockModuleControl from './block-module';
import TaxonomyControl from './taxonomy';

export default function Controls({
	attributes,
	setAttributes,
	clientId,
	blockArea,
	taxonomy,
	blockModule,
	postStatus,
	setPostStatus,
}) {
	const { ref } = attributes;
	return (
		<InspectorControls>
			{!ref && (
				<Fragment>
					<PanelBody title={__('Block Area')} initialOpen={true}>
						<Flex direction="column" gap="10px">
							<BlockAreaControl
								{...{
									attributes,
									setAttributes,
									blockArea,
									blockModule,
									postStatus,
									setPostStatus,
								}}
							/>
						</Flex>
					</PanelBody>
					<PanelBody title={__('Taxonomy')} initialOpen={true}>
						<Flex direction="column" gap="10px">
							<TaxonomyControl
								{...{
									attributes,
									setAttributes,
									taxonomy,
								}}
							/>
						</Flex>
					</PanelBody>
				</Fragment>
			)}
			<PanelBody title={__('Block Module')} initialOpen={true}>
				<Flex direction="column" gap="10px">
					<BlockModuleControl
						{...{
							attributes,
							setAttributes,
							blockArea,
							taxonomy,
							blockModule,
						}}
					/>
				</Flex>
			</PanelBody>
		</InspectorControls>
	);
}
