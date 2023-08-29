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
import { LoadingIndicator } from './utils';
import PlaceholderWizard from './PlaceholderWizard';
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
		>
			<div style={{ width: '100%' }}>
				<LoadingIndicator loading={!isNew && isResolving}/>
				{isNew && (
					<PlaceholderWizard
						attributes={attributes}
						setAttributes={setAttributes}
						context={context}
						setInstructions={setInstructions}
						noticeOperations={noticeOperations}
					/>
				)}
			</div>
		</WPComPlaceholder>
	);
}
