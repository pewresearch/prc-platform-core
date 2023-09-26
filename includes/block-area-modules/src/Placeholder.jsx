/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import { symbolFilled as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Placeholder as WPComPlaceholder,
	Spinner,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import BlockAreaCreate from './BlockAreaCreate';
import BlockAreaSearch from './BlockAreaSearch';
import BlockModuleCreate from './BlockModuleCreate';
import CategorySearchSelect from './CategorySearchSelect';
import { TAXONOMY_LABEL } from './constants';

export default function Placeholder({
	attributes,
	setAttributes,
	isNew,
	isResolving,
	context,
	noticeOperations,
}) {
	const [instructions, setInstructions] = useState(
		__(`Search for an existing ${TAXONOMY_LABEL.toLowerCase()} or create a new one`)
	);
	return (
		<WPComPlaceholder
			instructions={instructions}
			label={__(`${TAXONOMY_LABEL}`)}
			icon={icon}
			isColumnLayout={true}
		>
			<div style={{ width: '100%' }}>
				<BlockAreaSearch {...{
					blockAreaSlug: attributes?.blockAreaSlug,
					setBlockAreaSlug: (slug) => setAttributes({blockAreaSlug: slug})
				}}/>
				<BlockAreaCreate {...{
					blockAreaName: null,
					onCreation: (slug) => {
						console.log('newBlockarea', slug);
						setAttributes({blockAreaSlug: slug});
					}
				}}/>
				<CategorySearchSelect {...{
					categorySlug: attributes?.categorySlug,
					templateSlug: context?.templateSlug,
					inheritCategory: attributes?.inheritCategory,
					onInheritChange: (inherit) => setAttributes({inheritCategory: inherit}),
					onCategoryChange: (slug) => setAttributes({categorySlug: slug})
				}}/>
				<BlockModuleCreate {...{
					blockAreaSlug: attributes?.blockAreaSlug,
					categorySlug: attributes?.categorySlug,
					onCreation: (newBlockModule) => {
						console.log('newBlockModule!!', newBlockModule);
					},
				}}/>
			</div>
		</WPComPlaceholder>
	);
}
