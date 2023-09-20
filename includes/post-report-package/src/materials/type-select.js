import { Popover, SelectControl } from '@wordpress/components';

const types = [
	// Datasets are added automatically by the hooks and filters in the datasets system and as such are not defined here.
	{
		label: 'Default',
		value: null,
		icon: null,
	},
	{
		label: 'Detailed Table',
		value: 'detailedTable',
		icon: null,
	},
	{
		label: 'Link',
		value: 'link',
		icon: null, // Select an icon
	},
	{
		label: 'Presentation',
		value: 'presentation',
		icon: null,
	},
	{
		label: 'Press Release',
		value: 'pressRelease',
		icon: null,
	},
	{
		label: 'Promo',
		value: 'promo',
		icon: null, // Upload an image
	},
	{
		label: 'Q & A',
		value: 'qA',
		icon: null,
	},
	{
		label: 'Questionnaire',
		value: 'questionnaire',
		icon: null,
	},
	{
		label: 'Report PDF',
		value: 'report',
		icon: null,
	},
	{
		label: 'Supplemental',
		value: 'supplemental',
		icon: null,
	},
	{
		label: 'Topline',
		value: 'topline',
		icon: null,
	},
];

const TypeSelect = ({ type = null, onChange, toggleVisibility }) => {
	const options = types;
	return (
		<Popover
			className="prc-report-material-popover"
			noArrow={false}
			onFocusOutside={() => {
				toggleVisibility(false);
			}}
		>
			<div style={{ padding: '0.6em', minWidth: '140px' }}>
				<SelectControl
					label="Type"
					value={type}
					options={options}
					onChange={onChange}
				/>
			</div>
		</Popover>
	);
};

export { TypeSelect, types };

export default TypeSelect;
