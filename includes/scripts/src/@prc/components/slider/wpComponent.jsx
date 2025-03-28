import { RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import styled from '@emotion/styled';
const WPRangeControl = () => {
	const [columns, setColumns] = useState(2);
	const marks = [
		{
			value: 0,
			label: '0',
		},
		{
			value: 1,
			label: '1',
		},
		{
			value: 8,
			label: '8',
		},
		{
			value: 10,
			label: '10',
		},
	];
	return (
		<RangeControl
			label={'Columns'}
			value={columns}
			marks={marks}
			hideLabelFromVision
			onChange={(value) => setColumns(value)}
			min={0}
			max={10}
			step={1}
			withInputField={false}
			showTooltip={false}
			trackColor={'#f00'}
		/>
	);
};

const StyledRangeControl = styled(WPRangeControl)``;

export default WPRangeControl;
