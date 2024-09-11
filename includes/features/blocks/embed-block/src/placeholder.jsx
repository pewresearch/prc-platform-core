/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder as WPPlaceholder, Spinner } from '@wordpress/components';

import FeatureSearch from './entity-search';

const Placeholder = ({ setAttributes, isResolving }) => {
	return (
		<WPPlaceholder
			icon="admin-post"
			label={__('Feature')}
			instructions={
				isResolving
					? __('Loading feature… ')
					: __('Search for a feature to add to this post.')
			}
		>
			{!isResolving && <FeatureSearch setAttributes={setAttributes} />}
			{isResolving && (
				<FlexEl>
					<Spinner />
				</FlexEl>
			)}
		</WPPlaceholder>
	);
};

const FlexEl = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default Placeholder;
