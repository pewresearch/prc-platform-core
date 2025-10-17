import { timeParse } from 'd3-time-format';

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
		'MM-DD-YYYY': '%m-%d-%Y',
		'DD-MM-YYYY': '%d-%m-%Y',
		'MM-YYYY': '%m-%Y',
		YYYY: '%Y',
		MM: '%m',
		'MM/DD': '%m/%d',
		'DD/MM': '%d/%m',
	};

	return formatMap[format] || null;
};

// Common date format patterns for parsing input strings (fallback)
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

const abbreviateNumber = (num: number, fixed?: number): string => {
	if (num === null) {
		return '';
	} // terminate early
	if (num === 0) {
		return '0';
	} // terminate early
	// terminate if not a number
	if (isNaN(num)) {
		return num.toString();
	}
	num = Number(num);
	fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
	var b = num.toPrecision(2).split('e'), // get power
		k =
			b.length === 1
				? 0
				: Math.floor(Math.min(parseInt(b[1].slice(1)), 14) / 3), // floor at decimals, ceiling at trillions
		c =
			k < 1
				? num.toFixed(0 + fixed)
				: (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
		d = Number(c) < 0 ? c : Math.abs(Number(c)), // enforce -0 is 0
		e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
	return e;
};

const hexToRgb = (hex: string) => {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.toString().replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) {
		return 'black';
	}

	const rgb: number[] = [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
	];
	return rgb;
};

function luminance(r: number, g: number, b: number) {
	var a = [r, g, b].map(function (v) {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function checkContrast(hex1: string, hex2: string) {
	const rgb1 = hexToRgb(hex1) as number[];
	const rgb2 = hexToRgb(hex2) as number[];
	var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

function labelFill(hex = '#000000'): string {
	const rgb = hexToRgb(hex) as number[];
	// set determine color contrast per W3 guidelines: https://www.w3.org/TR/AERT/#color-contrast
	// Color brightness = ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
	// The range for color brightness difference is 125.
	const brightness = Math.round(
		(rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	);
	const fill = brightness > 125 ? 'black' : 'white';
	return fill;
}

function getBarLabelFill(
	labelColor: 'contrast' | 'black' | 'white' | 'inherit',
	labelPositionBar: string,
	barValue: number,
	labelCutoff: number,
	theme: string,
	barColor: string,
	categoryColor: string
): string {
	// Explicit color choices
	if (labelColor === 'black') {
		return 'black';
	}
	if (labelColor === 'white') {
		return 'white';
	}
	if (labelColor === 'inherit') {
		return categoryColor;
	}

	// Contrast mode: determine based on position and luminosity
	if (labelPositionBar === 'outside' || barValue <= labelCutoff) {
		return theme === 'light' ? 'black' : 'white';
	}
	return labelFill(barColor);
}

const newDateByFormat = (
	date: string,
	format: string | null | undefined
): Date => {
	let parsedDate: Date | null = null;
	// First, try to use the provided format if available
	const d3InputFormat = convertToD3Format(format);
	if (d3InputFormat) {
		const parser = timeParse(d3InputFormat);
		parsedDate = parser(date);
	}

	// If that didn't work, try each fallback format until one works
	if (!parsedDate) {
		for (const formatPattern of INPUT_DATE_FORMATS) {
			const parser = timeParse(formatPattern);
			parsedDate = parser(date);
			if (parsedDate) {
				break;
			}
		}
	}

	// Fallback to native Date parsing if d3 parsing fails
	if (!parsedDate) {
		parsedDate = new Date(date);
	}

	return parsedDate;
};

const scaleAxisNumTicks = (
	numTicks: number,
	chartWidth: number,
	layoutWidth: number
) => {
	// if there are 3 or less ticks, don't scale.
	// this should typically fit on the chart
	if (numTicks <= 3) {
		return numTicks;
	}
	const chartToLayoutRatio = chartWidth / layoutWidth;
	if (chartToLayoutRatio > 1) {
		return numTicks;
	}
	const scaledNumTicks = Math.floor(numTicks * chartToLayoutRatio);
	return scaledNumTicks;
};

export {
	abbreviateNumber,
	labelFill,
	getBarLabelFill,
	newDateByFormat,
	checkContrast,
	scaleAxisNumTicks,
};
