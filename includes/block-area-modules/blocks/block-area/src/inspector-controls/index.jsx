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
import { Button, TextControl, PanelBody, ExternalLink, Flex, FlexBlock, FlexItem, CardDivider } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import BlockAreaControl from './block-area';
import BlockModuleControl from './block-module';
import CategoryControl from './category';

export default function Controls({
	attributes,
	setAttributes,
	clientId,
	blockArea,
	category,
	blockModule,
	postStatus,
	setPostStatus,
}) {
	const {ref} = attributes;
	return (
		<InspectorControls>
			{!ref && (
				<Fragment>
					<PanelBody title={__('Block Area')} initialOpen={true}>
						<Flex direction="column" gap={'10px'}>
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
					<PanelBody title={__('Category')} initialOpen={true}>
						<Flex direction="column" gap={'10px'}>
							<CategoryControl
								{...{
									attributes,
									setAttributes,
									category,
								}}
							/>
						</Flex>
					</PanelBody>
				</Fragment>
			)}
			<PanelBody title={__('Block Module')} initialOpen={true}>
				<Flex direction="column" gap={'10px'}>
					<BlockModuleControl
						{...{
							setAttributes,
							blockArea,
							category,
							blockModule,
						}}
					/>
				</Flex>
			</PanelBody>
		</InspectorControls>
	);
}
