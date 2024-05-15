/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl, FlexBlock } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL } from '../constants';
import BlockModuleCreate from '../block-module-create';

export default function BlockModuleControl({
	attributes,
	setAttributes,
	blockArea,
	taxonomy,
	blockModule,
}) {
	const { taxonomyName } = attributes;
	const { id, name, slug } = blockModule;

	const blockAreaId = blockArea?.id;
	const taxonomyId = taxonomy?.id;

	// Block Module:
	const [blockModuleTitle, setBlockModuleTitle] = useEntityProp(
		'postType',
		POST_TYPE,
		'title',
		id
	);
	const [blockModuleLink] = useEntityProp('postType', POST_TYPE, 'link', id);

	if (!id) {
		return null;
	}

	return (
		<Fragment>
			<FlexBlock>
				<TextControl
					__nextHasNoMarginBottom
					label={`${POST_TYPE_LABEL} Title`}
					value={blockModuleTitle}
					onChange={setBlockModuleTitle}
				/>
			</FlexBlock>
			<FlexBlock>
				<BlockModuleCreate
					{...{
						blockAreaId,
						taxonomyName,
						taxonomyTermId: taxonomyId,
						setAttributes,
					}}
				/>
			</FlexBlock>
		</Fragment>
	);
}
