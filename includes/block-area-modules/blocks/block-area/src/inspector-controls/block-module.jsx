/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { Button, TextControl, PanelBody, ExternalLink, Flex, FlexBlock, FlexItem, CardDivider } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL } from '../constants';
import BlockModuleCreate from '../block-module-create';

export default function BlockModuleControl({
	setAttributes,
	blockArea,
	category,
	blockModule
}) {
	const {id, name, slug} = blockModule;

	const blockAreaId = blockArea?.id;
	const categoryId = category?.id;

	// Block Module:
	const [blockModuleTitle, setBlockModuleTitle] = useEntityProp('postType', POST_TYPE, 'title', id);
	const [blockModuleLink] = useEntityProp('postType', POST_TYPE, 'link', id);

	if (!id) {
		return null;
	}

	return (
		<Fragment>
			<FlexBlock>
				<TextControl
					__nextHasNoMarginBottom
					label={__(`${POST_TYPE_LABEL} Title`)}
					value={blockModuleTitle}
					onChange={setBlockModuleTitle}
				/>
			</FlexBlock>
			<FlexBlock>
				<BlockModuleCreate
					{...{
						blockAreaId,
						categoryId,
						setAttributes,
					}}
				/>
			</FlexBlock>
		</Fragment>
	);
}
