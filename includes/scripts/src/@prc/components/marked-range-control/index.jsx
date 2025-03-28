/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { RangeControl } from '@wordpress/components';

const StyledRangeControl = styled(RangeControl)`
	span.components-range-control__mark-label {
		padding-top: 10px;
	}
`;

export default function MarkedRangeControl(props) {
	return (
		<StyledRangeControl
			{...props}
		/>
	);
}