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
	const b = num.toPrecision(2).split('e'), // get power
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
	const a = [r, g, b].map(function (v) {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function checkContrast(hex1: string, hex2: string) {
	const rgb1 = hexToRgb(hex1) as number[];
	const rgb2 = hexToRgb(hex2) as number[];
	const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
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

/**
 * Parse a light-dark() CSS value into its light and dark components.
 *
 * @param value - CSS color value to parse.
 * @return Light and dark components, or null if not a light-dark() value.
 */
function parseLightDark(value: string): { light: string; dark: string } | null {
	const match = value.match(/^light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/);
	if (match) {
		return { light: match[1], dark: match[2] };
	}
	return null;
}

/**
 * Compute a contrast-appropriate label fill for a bar that may use
 * a light-dark() color value. Returns a light-dark() string when the
 * input bar color is itself a light-dark() value; otherwise falls
 * back to the standard single-value labelFill().
 *
 * @param barColor - The bar's fill color, possibly a light-dark() value.
 * @return A color string suitable for label text on the bar.
 */
function contrastLabelFillForLightDark(barColor: string): string {
	const parsed = parseLightDark(barColor);
	if (parsed) {
		const lightLabel = labelFill(parsed.light);
		const darkLabel = labelFill(parsed.dark);
		// If both variants need the same label color, return it directly
		if (lightLabel === darkLabel) {
			return lightLabel;
		}
		// Build a light-dark() for the label fill using the correct
		// contrast color for each mode variant
		const lightHex = lightLabel === 'black' ? '#000000' : '#ffffff';
		const darkHex = darkLabel === 'black' ? '#000000' : '#ffffff';
		return `light-dark(${lightHex}, ${darkHex})`;
	}
	return labelFill(barColor);
}

/**
 * UI-black / UI-white as light-dark() values, matching theme.json
 * ui-white and ui-black definitions.
 */
const UI_BLACK = 'light-dark(#000000, #f0f0f0)';
const UI_WHITE = 'light-dark(#ffffff, #1a1a1a)';

function getBarLabelFill(
	labelColor: 'contrast' | 'black' | 'white' | 'inherit',
	labelPositionBar: string,
	barValue: number,
	labelCutoff: number,
	theme: string,
	barColor: string,
	categoryColor: string
): string {
	// Explicit color choices — resolve named colors to light-dark()
	if (labelColor === 'black') {
		return UI_BLACK;
	}
	if (labelColor === 'white') {
		return UI_WHITE;
	}
	if (labelColor === 'inherit') {
		// categoryColor is already resolved by getConfig
		return categoryColor;
	}

	// Contrast mode: determine based on position and luminosity
	if (labelPositionBar === 'outside' || barValue < labelCutoff) {
		// Outside labels use the base text color
		return UI_BLACK;
	}
	// Inside labels need contrast against the bar's fill color
	return contrastLabelFillForLightDark(barColor);
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

// Helper function to decode HTML entities for SVG rendering
const decodeHtmlEntities = (text: string): string => {
	if (!text) return text ?? '';
	return text
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#x27;/g, "'")
		.replace(/&#x2F;/g, '/')
		.replace(/&#x60;/g, '`')
		.replace(/&#x3D;/g, '=');
};

// Helper function to extract and decode custom labels from data
// Note: This reads from __labels (legacy) - for new custom text, use getCustomLabelText
const getCustomLabel = (
	dataPoint: Record<string, any>,
	key: string
): string => {
	const label = dataPoint?.__labels?.[key];
	return label ? decodeHtmlEntities(label) : '';
};

/**
 * Get custom label text for a data point/category combination.
 * This reads from __labelText which is populated from labels.customLabels.
 *
 * @param dataPoint The data point object
 * @param key       The category key (e.g., 'n1', 'Democrats')
 * @return Custom label text if set, empty string otherwise
 */
const getCustomLabelText = (
	dataPoint: Record<string, any>,
	key: string
): string => {
	const text = dataPoint?.__labelText?.[key];
	return text ? decodeHtmlEntities(text) : '';
};

/**
 * Check if a label should be visible for a data point/category.
 * Returns true by default if no visibility override is set.
 *
 * @param dataPoint The data point object
 * @param key       The category key
 * @return Whether the label should be visible
 */
const isLabelVisible = (
	dataPoint: Record<string, any>,
	key: string
): boolean => {
	const visibility = dataPoint?.__labelVisible?.[key];
	// Default to true if not explicitly set to false
	return visibility !== false;
};

/**
 * Get custom style overrides for a label.
 *
 * @param dataPoint The data point object
 * @param key       The category key
 * @return Style override object or null if none set
 */
const getCustomLabelStyle = (
	dataPoint: Record<string, any>,
	key: string
): {
	color?: string;
	fontWeight?: string | number;
	fontSize?: number;
	fontStyle?: 'normal' | 'italic' | 'underline' | 'strikethrough';
	fontFamily?: string;
	maxWidth?: number;
	textOutline?: boolean;
} | null => {
	return dataPoint?.__labelStyles?.[key] || null;
};

/**
 * Get the group value for a data point based on the dataRender configuration.
 * Returns null if grouping is not active or the data point doesn't have the group property.
 *
 * @param dataPoint - The data point (FlatData)
 * @param dataRender - The dataRender configuration
 * @returns The group value as a string, or null
 */
const getGroupValue = (
	dataPoint: any,
	dataRender: { groupBreaksActive?: boolean; groupBreaksCategory?: string }
): string | null => {
	if (
		dataRender?.groupBreaksActive &&
		dataRender?.groupBreaksCategory &&
		dataPoint?.[dataRender.groupBreaksCategory] != null
	) {
		return String(dataPoint[dataRender.groupBreaksCategory]);
	}
	return null;
};

/**
 * Generate a group-aware element key for storing/looking up customizations.
 *
 * Key formats:
 * - 2-part (no grouping): "xValue::category"
 * - 3-part (with grouping): "xValue::category::groupValue"
 *
 * @param x - The x value from the data point
 * @param category - The category/series name
 * @param groupValue - The group value (from getGroupValue), or null
 * @returns The element key string
 */
const generateElementKey = (
	x: any,
	category: string,
	groupValue: string | null = null
): string => {
	const xStr = x instanceof Date ? x.toISOString() : String(x);
	if (groupValue) {
		return `${xStr}::${category}::${groupValue}`;
	}
	return `${xStr}::${category}`;
};

export {
	abbreviateNumber,
	labelFill,
	contrastLabelFillForLightDark,
	getBarLabelFill,
	newDateByFormat,
	checkContrast,
	scaleAxisNumTicks,
	decodeHtmlEntities,
	getCustomLabel,
	getCustomLabelText,
	isLabelVisible,
	getCustomLabelStyle,
	getGroupValue,
	generateElementKey,
};
