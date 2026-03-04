/**
 * Converts a hex color string to RGB array [r, g, b].
 *
 * @param {string} hex Hex color (e.g. #fff or #ffffff).
 * @return {number[]|string} [r,g,b] or 'black' if invalid.
 */
function hexToRgb(hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.toString().replace(shorthandRegex, (m, r, g, b) => {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) {
		return 'black';
	}

	return [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
	];
}

/**
 * Returns a contrasting color (light or dark) for a given hex background.
 *
 * @param {string} color       Hex background color.
 * @param {string} outputLight Hex to return when background is dark.
 * @param {string} outputDark  Hex to return when background is light.
 * @return {string} outputLight or outputDark.
 */
function getContrastingColorFromHex(
	color,
	outputLight = '#ffffff',
	outputDark = '#2a2a2a'
) {
	const rgb = hexToRgb(color);
	if (rgb === 'black') {
		return outputLight;
	}
	// W3 color brightness: (R*299 + G*587 + B*114) / 1000
	const brightness = Math.round(
		(rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	);
	return brightness > 125 ? outputDark : outputLight;
}

export { hexToRgb, getContrastingColorFromHex };
