import { DataRender } from '../types/dataRender';
import { Layout } from '../types/layout';
import { abbreviateNumber } from '../utilities/helpers';
import { Tooltip } from '../types/tooltip';
import { timeFormat } from 'd3-time-format';
import { Size } from '../types/windowSize';
import { useMemo } from 'react';

type TooltipData = { [key: string]: string | number };

function styleTooltipString(formatString: string, color: string) {
	// get each substring between {{ }} and replace it with a span
	const formatted = formatString.replace(/{{(.*?)}}/g, (match, key) => {
		let isBold, isColor, isLowerCase;
		if (key.indexOf('.isBold()') > -1) {
			isBold = true;
			key = key.replace('.isBold()', '');
		}
		if (key.indexOf('.isColor()') > -1) {
			isColor = true;
			key = key.replace('.isColor()', '');
		}
		if (key.indexOf('.toLowerCase()') > -1) {
			isLowerCase = true;
			key = key.replace('.toLowerCase()', '');
		}
		return isColor || isBold || isLowerCase
			? `<span style="color: ${isColor ? color : '#2a2a2a'}; font-weight: ${
					isBold ? 'bold' : 'normal'
				}; text-transform: ${
					isLowerCase ? 'lowercase' : 'none'
				};">{{${key}}}</span>`
			: `<span>{{${key}}}</span>`;
	});
	return formatted;
}

function formatTooltipString(formatString: string, color: string) {
	return function (data: TooltipData) {
		const formatted = formatString
			.replace(/{{\s*(\w+)\.toLowerCase\(\)\s*}}/g, (match, key) => {
				const originalKey = key.replace(/\.toLowerCase\(\)$/, '');
				const value = data[originalKey];
				return value ? value.toString().toLowerCase() : '';
			})
			.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
				const value = data[key];
				return value ? value.toString() : '';
			});
		return formatted;
	};
}
const getTooltipHeaderFormat = (
	d: { x: any; category: any },
	config: Tooltip
) => {
	// if d.x is a date, format it
	const d3DateFormat = timeFormat(config.dateFormat);
	const x = d.x instanceof Date ? d3DateFormat(d.x) : d.x;
	// if d.category is a date, format it
	const category =
		d.category instanceof Date ? d3DateFormat(d.category) : d.category;
	// do some formatting on the numerical value

	if ('categoryValue' === config.headerValue) {
		return category;
	}
	return x;
};

const getTooltipFormat = (
	d: { x: any; y: any; category: any; color: any },
	config: Tooltip,
	DataRender: DataRender | undefined
) => {
	// if d.x is a date, format it
	const d3DateFormat = timeFormat(config.dateFormat);
	const x = d.x instanceof Date ? d3DateFormat(d.x) : d.x;
	// if d.category is a date, format it
	const category =
		d.category instanceof Date ? d3DateFormat(d.category) : d.category;
	let datum: number | string = config.absoluteValue
		? Math.abs(d.y)
		: Number(d.y);
	//if custom label is set, use it
	if (config.customFormat) {
		return config.customFormat(datum);
	}
	// if there is a dataRender, check is the mapScale is 'ordinal', if so, datum is a string
	if (DataRender && DataRender.mapScale === 'ordinal') {
		datum = d.y;
		if (config.format && config.format.length > 0) {
			// quick conversion for strings using sprintf format
			const reformat = config.format
				.replace(/%1\$s/g, '{{column}}')
				.replace(/%2\$s/g, '{{value}}')
				.replace(/%3\$s/g, '{{row}}');
			const styledFormat = styleTooltipString(reformat, d.color);
			const format = formatTooltipString(styledFormat, d.color);
			return format({ column: category, value: datum, row: x });
		} else {
			const format = formatTooltipString('{{row}}: {{value}}', d.color);
			return format({ row: x, value: datum });
		}
	}
	// do some formatting on the numerical value
	if (config.toFixedDecimal) {
		datum = Number(Number(datum).toFixed(config.toFixedDecimal));
	}
	if (config.abbreviateValue) {
		datum = abbreviateNumber(datum, config.toFixedDecimal);
	}
	if (config.toLocaleString) {
		datum = datum.toLocaleString();
	}
	if (config.format && config.format.length > 0) {
		// quick conversion for strings using sprintf format
		const reformat = config.format
			.replace(/%1\$s/g, '{{column}}')
			.replace(/%2\$s/g, '{{value}}')
			.replace(/%3\$s/g, '{{row}}');
		const styledFormat = styleTooltipString(reformat, d.color);
		const format = formatTooltipString(styledFormat, d.color);
		return format({ column: category, value: datum, row: x });
	} else {
		const format = formatTooltipString('{{row}}: {{value}}', d.color);
		return format({ row: x, value: datum });
	}
	// otherwise, return the value with the unit at the start
};

const getTooltipVisible = (
	layout: Layout,
	chartWidth: number,
	tooltip: Tooltip
) => {
	const hasBreakpoint =
		!isNaN(layout.mobileBreakpoint) || layout.mobileBreakpoint > 0;
	if (!hasBreakpoint || chartWidth >= layout.mobileBreakpoint) {
		return tooltip.active;
	}
	// if the chart is smaller than the breakpoint, check tooltip.activeOnMobile
	if (hasBreakpoint && chartWidth < layout.mobileBreakpoint) {
		return tooltip.activeOnMobile;
	}
};

export { getTooltipHeaderFormat, getTooltipFormat, getTooltipVisible };
