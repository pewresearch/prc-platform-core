import { abbreviateNumber } from '../utilities/helpers';
import { Labels } from '../types/configTypes';
type BarProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	value: number;
};

type PositionProps = {
	labelPositionDX: number;
	labelPositionDY: number;
	labelPositionBar: 'inside' | 'outside' | 'center';
};

const getLabelProps = (config: {
	labelAngle?: number;
	fontSize: number;
	fontWeight: number;
	fontFamily: string;
	textAnchor: 'start' | 'middle' | 'end';
	labelPositionDY: number;
	labelPositionDX: number;
}) => {
	return {
		pointerEvents: 'none',
		angle: config.labelAngle,
		textAnchor: config.textAnchor,
		dy: config.labelPositionDY,
		dx: config.labelPositionDX,
		style: {
			fontSize: config.fontSize,
			fontWeight: config.fontWeight,
			fontFamily: config.fontFamily,
		},
	};
};

const getLabelFormat = (
	d: any,
	category: string,
	config: Labels,
	cutoff: number | null
) => {
	const datum = config.absoluteValue ? Math.abs(d) : Number(d);

	//if custom label is set, use it and return
	if (config.customLabelFormat) {
		return config.customLabelFormat(datum, category);
	}

	// running Number() twice will truncate trailing zeros
	const fixedDatum = config.truncateDecimal
		? Number(Number(datum).toFixed(config.toFixedDecimal))
		: Number(datum).toFixed(config.toFixedDecimal);

	const localizedDatum = config.truncateDecimal
		? Number(datum.toFixed(config.toFixedDecimal)).toLocaleString('en-US')
		: // if we are not truncating decimals, we can just use the toLocaleString method
			datum.toLocaleString('en-US', {
				minimumFractionDigits: config.toFixedDecimal,
				maximumFractionDigits: config.toFixedDecimal,
			});
	const abbreviatedDatum = abbreviateNumber(datum, config.toFixedDecimal);

	// if custom label is not set, check for cutoff
	if (cutoff === null || Number(fixedDatum) > cutoff) {
		//if there is a unit specified, add it to the label either at end or start

		if (config.labelUnit) {
			if (config.labelUnitPosition === 'end') {
				// check if abbreviated values is selected
				if (config.abbreviateValue) {
					return `${abbreviatedDatum}${config.labelUnit}`;
				}
				//if not abbreviated values, check if toLocaleString is selected
				if (config.toLocaleString) {
					return `${localizedDatum}${config.labelUnit}`;
				}
				// if neither selected, return the value with the unit
				return `${fixedDatum}${config.labelUnit}`;
			}
			// if position label start and abbreviated values is selected
			if (config.abbreviateValue) {
				return `${config.labelUnit}${abbreviatedDatum}`;
			}
			// if position label start and toLocaleString is selected
			if (config.toLocaleString) {
				return `${config.labelUnit}${localizedDatum}`;
			}
			// otherwise, return the value with the unit at the start
			return `${config.labelUnit}${fixedDatum}`;
		}
		if (config.abbreviateValue) {
			return `${abbreviatedDatum}`;
		}
		if (config.toLocaleString) {
			return `${localizedDatum}`;
		}
		// if none of the above are selected, return the value as is to the specified decimal place
		return `${fixedDatum}`;
	}
	return '';
};

const positionNodeLabel = () => {};
const horizontalPositioning = (
	bar: BarProps,
	config: PositionProps,
	labelCutOff: number,
	stack: 'stacked' | 'single'
) => {
	const { x, y, width, height, value } = bar;
	const { labelPositionDX, labelPositionDY, labelPositionBar } = config;
	if (value < labelCutOff && stack === 'single') {
		return {
			x: x + width + 10 + labelPositionDX,
			y: y + height / 2 + labelPositionDY,
		};
	}
	if (labelPositionBar === 'center') {
		return {
			x: x + width / 2 + labelPositionDX,
			y: y + height / 2 + labelPositionDY,
		};
	}
	if (labelPositionBar === 'inside') {
		return {
			x: x + width - 20 + labelPositionDX,
			y: y + height / 2 + labelPositionDY,
		};
	}
	return {
		x: x + width + 5 + labelPositionDX,
		y: y + height / 2 + labelPositionDY,
	};
};
const verticalPositioning = (
	bar: BarProps,
	config: PositionProps,
	labelCutOff: number,
	stack: 'stacked' | 'single'
) => {
	const { x, y, width, height, value } = bar;
	const { labelPositionDX, labelPositionDY, labelPositionBar } = config;
	if (Math.abs(value) < labelCutOff) {
		return {
			x: x + width / 2 + labelPositionDX,
			y: y - 5 + labelPositionDY,
		};
	}
	if (labelPositionBar === 'center') {
		return {
			x: x + width / 2 + labelPositionDX,
			y: y + height / 2 + labelPositionDY,
		};
	}
	if (labelPositionBar === 'inside') {
		return {
			x: x + width / 2 + labelPositionDX,
			y: y + 20 + labelPositionDY,
		};
	}
	return {
		x: x + width / 2 + labelPositionDX,
		y: y - 5 + labelPositionDY,
	};
};

const positionBarLabel = (
	bar: BarProps,
	config: PositionProps,
	labelCutOff: number,
	orientation: 'vertical' | 'horizontal',
	stack: 'stacked' | 'single'
) => {
	if (orientation === 'horizontal') {
		return horizontalPositioning(bar, config, labelCutOff, stack);
	}
	return verticalPositioning(bar, config, labelCutOff, stack);
};

export { getLabelProps, getLabelFormat, positionNodeLabel, positionBarLabel };
