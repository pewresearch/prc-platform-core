/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY_LABEL } from '../constants';

const Indicator = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default function LoadingIndicator({loading = false, label = __(`Loading ${TAXONOMY_LABEL}`, 'prc-platform-core')}) {
	if (loading) {
		<Indicator>
			<span>{label}... </span>
			<Spinner />
		</Indicator>
	}
}
