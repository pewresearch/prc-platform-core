import { abbreviateNumber, checkContrast, newDateByFormat } from '../utilities/helpers';
import { timeFormat, timeParse } from 'd3-time-format';
import { independentAxis, dependentAxis } from '../types/configTypes';
import { AxisScale, AxisScaleOutput } from '@visx/axis';

// sanity check to catch old date formats with single quotes
const replaceStraightQuotesWithFancy = (dateFormat: string) => {
	// replace "'%y" with "'%y"
	// eg. '18 -> '18
	return dateFormat.replace("'%y", '\u2019%y');
};

// Convert human-readable date format to d3 format
const convertToD3Format = (
	format: string | null | undefined
): string | null => {
	if (!format) return null;

	// Map of human-readable formats to d3 formats
	const formatMap: Record<string, string> = {
		'YYYY-MM-DD': '%Y-%m-%d',
		'YYYY-MM': '%Y-%m',
		'MM/DD/YYYY': '%m/%d/%Y',
		'MM/YYYY': '%m/%Y',
		'DD/MM/YYYY': '%d/%m/%Y',
		YYYY: '%Y',
		MM: '%m',
		'MM/DD': '%m/%d',
		'DD/MM': '%d/%m',
	};

	return formatMap[format] || null;
};

// Common date format patterns for parsing input strings (fallback)
// These are the base formats that incoming date strings might use
const INPUT_DATE_FORMATS = [
	'%m-%Y', // '08-2000'
	'%Y-%m', // '2000-08'
	'%Y', // '2000'
	'%m/%Y', // '08/2000'
	'%Y/%m', // '2000/08'
	'%m-%d-%Y', // '08-15-2000'
	'%Y-%m-%d', // '2000-08-15'
	'%m/%d/%Y', // '08/15/2000'
	'%Y/%m/%d', // '2000/08/15'
	'%B %Y', // 'August 2000'
	'%b %Y', // 'Aug 2000'
	'%B %d, %Y', // 'August 15, 2000'
	'%b %d, %Y', // 'Aug 15, 2000'
];

const formatTicks = (
	config: independentAxis | dependentAxis,
	t: number | Date | string,
	inputDateFormat?: string | null
) => {
	if (
		config.customTickFormat &&
		typeof config.customTickFormat === 'function'
	) {
		return config.customTickFormat(t);
	}

	if (config.scale === 'time') {
		config = config as independentAxis;

		// Parse the date string if t is a string, otherwise use it as a Date
		let dateValue: Date;
		if (typeof t === 'string') {
			let parsedDate: Date | null = null;

			// First, try to use the provided inputDateFormat if available
			const d3InputFormat = convertToD3Format(inputDateFormat);
			if (d3InputFormat) {
				const parser = timeParse(d3InputFormat);
				parsedDate = parser(t);
			}

			// If that didn't work, try each fallback format until one works
			if (!parsedDate) {
				for (const format of INPUT_DATE_FORMATS) {
					const parser = timeParse(format);
					parsedDate = parser(t);
					if (parsedDate) {
						break;
					}
				}
			}

			if (parsedDate) {
				dateValue = parsedDate;
			} else {
				// Fallback to native Date parsing if d3 parsing fails
				dateValue = new Date(t);
			}
		} else {
			dateValue = t as Date;
		}

		// Format the parsed date using the output format
		const d3DateFormat = timeFormat(
			replaceStraightQuotesWithFancy(config.dateFormat)
		);

		const formattedDate = d3DateFormat(dateValue);

		if (config.tickUnit) {
			if (config.tickUnitPosition === 'end') {
				return `${formattedDate}${config.tickUnit}`;
			}
			return `${config.tickUnit}${formattedDate}`;
		}
		return formattedDate;
	}
	t = t as number;
	if (config.abbreviateTicks) {
		if (config.tickUnit) {
			if (config.tickUnitPosition === 'end') {
				return `${abbreviateNumber(t, config.abbreviateTicksDecimals)}${
					config.tickUnit
				}`;
			}
			return `${config.tickUnit}${abbreviateNumber(
				t,
				config.abbreviateTicksDecimals
			)}`;
		}
		return abbreviateNumber(t, config.abbreviateTicksDecimals);
	}
	if (config.ticksToLocaleString) {
		if (config.tickUnit) {
			if (config.tickUnitPosition === 'end') {
				return `${t.toLocaleString()}${config.tickUnit}`;
			}
			return `${config.tickUnit}${t.toLocaleString()}`;
		}
		return t.toLocaleString();
	}
	if (config.tickUnit) {
		if (config.tickUnitPosition === 'end') {
			return `${t}${config.tickUnit}`;
		}
		return `${config.tickUnit}${t}`;
	}
	return `${t}`;
};

const getColor = (color: string, theme: string) => {
	if (!color) {
		// return transparent
		return 'transparent';
	}
	if (theme === 'light') {
		return color;
	}
	return checkContrast(color, '#1e1e1e') > 3 ? color : '#ccc';
};

const getAxisProps = (
	config: independentAxis | dependentAxis,
	scale: AxisScale<AxisScaleOutput>,
	theme: 'light' | 'dark',
	inputDateFormat?: string | null
) => {
	const { axis, ticks, axisLabel, tickLabels } = config;

	// Parse tickValues if they're strings and scale is time
	let parsedTickValues = config.tickValues;
	if (config.scale === 'time' && config.tickValues) {
		parsedTickValues = config.tickValues.map((tick) => {
			// If it's already a Date, return it
			if (tick instanceof Date) {
				return tick;
			}
			// If it's a string or number, parse it
			return newDateByFormat(String(tick), inputDateFormat);
		}) as any;
	}

	return {
		scale: scale,
		hideAxisLine: !config.active,
		hideTicks: !config.active,
		stroke: getColor(axis.stroke, theme),
		strokeWidth: axis.strokeWidth,
		tickStroke: getColor(axis.stroke, theme),
		tickLength: ticks.size,
		hideZero: !config.showZero,
		label: config.label ? config.label : '',
		labelOffset: axisLabel.padding,
		numTicks: config.tickCount,
		tickValues:
			config.scale === 'time'
				? (parsedTickValues as Date[] | undefined)
				: (parsedTickValues as number[] | undefined),
		labelProps: {
			fill: getColor(axisLabel.fill, theme),
			fontSize: axisLabel.fontSize,
			textAnchor: axisLabel.textAnchor,
			dy: axisLabel.dy,
			dx: axisLabel.dx,
			fontFamily: axisLabel.fontFamily,
			verticalAnchor: axisLabel.verticalAnchor,
			angle: axisLabel.angle,
			width: axisLabel.maxWidth,
		},
		tickFormat: (t: any) =>
			formatTicks(config, t, inputDateFormat),
		tickLabelProps: () => {
			return {
				fill: getColor(tickLabels.fill, theme),
				fontSize: tickLabels.fontSize,
				textAnchor: tickLabels.textAnchor,
				dy: tickLabels.dy,
				dx: tickLabels.dx,
				fontFamily: tickLabels.fontFamily,
				verticalAnchor: tickLabels.verticalAnchor,
				angle: tickLabels.angle,
				width: tickLabels.maxWidth,
			};
		},
	};
};

export { getAxisProps };
