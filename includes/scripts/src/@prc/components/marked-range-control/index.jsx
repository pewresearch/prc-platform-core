/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { RangeControl } from '@wordpress/components';

const StyledRangeControl = styled(RangeControl)`
	.components-range-control__slider-wrapper {
		padding-bottom: 28px;
	}

	span.components-range-control__mark-label {
		padding-top: 4px;
		font-size: 11px;
	}
`;

export default function MarkedRangeControl(props) {
	return <StyledRangeControl {...props} />;
}
