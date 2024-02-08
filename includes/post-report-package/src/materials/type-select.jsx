/**
 * WordPress Dependencies
 */
import { Popover, SelectControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import types from './types.json';

const TypeSelect = ({ type = null, onChange, toggleVisibility }) => {
	const { options } = types;
	return (
		<Popover
			className="prc-report-material-popover"
			noArrow={false}
			placement="left-start"
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

const getLabel = (type) => {
	const { options } = types;
	const t = options.find((x) => x.value === type);
	if (undefined !== t) {
		return t.label;
	}
	return '';
};

const getValue = (type) => {
	const { options } = types;
	const t = options.find((x) => x.value === type);
	if (undefined !== t) {
		return t.value;
	}
	return '';
};

const getOptions = () => {
	return types?.options || [];
};

export { TypeSelect, getLabel, getValue, getOptions };

export default TypeSelect;
