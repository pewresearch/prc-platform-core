import { Popover, SelectControl } from '@wordpress/components';

const types = [
	// Datasets are added automatically by the datasets system and a filter in the report materials widget.
	// {
	//     label: 'Dataset',
	//     value: 'dataset',
	//     icon:
	//         'https://www.pewresearch.org/wp-content/themes/prc_parent/src/images/icons/icon-dataset.svg',
	// },
	{
		label: 'Default',
		value: null,
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-detailed-table.svg',
	},
	{
		label: 'Detailed Table',
		value: 'detailedTable',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-detailed-table.svg',
	},
	{
		label: 'Link',
		value: 'link',
		icon: null, // Select an icon
	},
	{
		label: 'Presentation',
		value: 'presentation',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-presentation.svg',
	},
	{
		label: 'Press Release',
		value: 'pressRelease',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-press-release.svg',
	},
	{
		label: 'Promo',
		value: 'promo',
		icon: null, // Upload an image
	},
	{
		label: 'Q & A',
		value: 'qA',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-q-and-a.svg',
	},
	{
		label: 'Questionnaire',
		value: 'questionnaire',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-questionnaire.svg',
	},
	{
		label: 'Report PDF',
		value: 'report',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-report.svg',
	},
	{
		label: 'Supplemental',
		value: 'supplemental',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-supplemental.svg',
	},
	{
		label: 'Topline',
		value: 'topline',
		icon: '/wp-content/themes/prc_parent/src/images/icons/icon-topline.svg',
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
