/**
 * Social Image Generator - Canvas-based image composition.
 *
 * Generates images by compositing:
 * 1. Source image
 * 2. Title text
 * 3. Optional logo (when logoSrc is provided)
 */

import { DEFAULT_PLATFORM_SIZES } from './platform-sizes';

/**
 * Load an image from a URL and return an HTMLImageElement.
 *
 * @param {string} url - The image URL to load.
 * @return {Promise<HTMLImageElement>} The loaded image element.
 */
const loadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
		img.src = url;
	});
};

/**
 * Wrap text to fit within a maximum width, returning an array of lines.
 *
 * @param {CanvasRenderingContext2D} ctx      - The canvas context.
 * @param {string}                   text     - The text to wrap.
 * @param {number}                   maxWidth - Maximum width for each line.
 * @param {number}                   maxLines - Maximum number of lines.
 * @return {string[]} Array of text lines.
 */
const wrapText = (ctx, text, maxWidth, maxLines = 4) => {
	const words = text.split(' ');
	const lines = [];
	let currentLine = '';

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const metrics = ctx.measureText(testLine);

		if (metrics.width > maxWidth && currentLine) {
			lines.push(currentLine);
			currentLine = word;

			if (lines.length >= maxLines) {
				const lastLine = lines[lines.length - 1];
				let truncated = lastLine;
				while (
					ctx.measureText(truncated + '...').width > maxWidth &&
					truncated.length > 0
				) {
					truncated = truncated.slice(0, -1);
				}
				lines[lines.length - 1] = truncated + '...';
				return lines;
			}
		} else {
			currentLine = testLine;
		}
	}

	if (currentLine && lines.length < maxLines) {
		lines.push(currentLine);
	}

	return lines;
};

/**
 * Deep merge two objects, with source values overriding target values.
 *
 * @param {Object} target - The target object.
 * @param {Object} source - The source object to merge.
 * @return {Object} The merged object.
 */
const deepMerge = (target, source) => {
	const result = { ...target };
	for (const key of Object.keys(source)) {
		if (
			source[key] &&
			typeof source[key] === 'object' &&
			!Array.isArray(source[key])
		) {
			result[key] = deepMerge(target[key] || {}, source[key]);
		} else {
			result[key] = source[key];
		}
	}
	return result;
};

/**
 * Resolve platform sizes: use custom if provided, else defaults.
 *
 * @param {string} platformType    - Platform key.
 * @param {Object} [platformSizes] - Optional custom sizes (merged over defaults).
 * @return {Object} Config for the platform.
 */
function getPlatformConfig(platformType, platformSizes) {
	const sizes = platformSizes || DEFAULT_PLATFORM_SIZES;
	const config = sizes[platformType];
	if (!config) {
		throw new Error(`Unknown platform type: ${platformType}`);
	}
	return config;
}

/**
 * Render a social image to a canvas element.
 *
 * @param {Object}            opts                   - Render options.
 * @param {HTMLCanvasElement} opts.canvas            - The canvas element to render to.
 * @param {string}            opts.sourceImageUrl    - URL of the source image.
 * @param {string}            opts.title             - The title text to display.
 * @param {string}            [opts.platformType]    - The platform type key.
 * @param {Object}            [opts.layoutOverrides] - Optional layout overrides.
 * @param {string}            [opts.logoSrc]         - Optional URL of logo image/SVG.
 * @param {Object}            [opts.platformSizes]   - Optional custom platform sizes.
 * @return {Promise<void>} Resolves when rendering is complete.
 */
export const renderToCanvas = async (opts) => {
	const {
		canvas,
		sourceImageUrl,
		title,
		platformType = 'instagram',
		layoutOverrides = null,
		logoSrc = null,
		platformSizes = null,
	} = opts || {};
	const config = getPlatformConfig(platformType, platformSizes);
	const { width, height } = config;
	const layout = layoutOverrides
		? deepMerge(config.layout, layoutOverrides)
		: config.layout;

	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	await document.fonts.ready;

	ctx.fillStyle = layout.backgroundColor;
	ctx.fillRect(0, 0, width, height);

	try {
		const sourceImage = await loadImage(sourceImageUrl);
		const imgAspect = sourceImage.width / sourceImage.height;
		const imgWidth = width;
		const imgHeight = Math.min(
			imgWidth / imgAspect,
			layout.image.maxHeight
		);
		const imgX = 0;
		const imgY = layout.image.top;

		ctx.drawImage(sourceImage, imgX, imgY, imgWidth, imgHeight);

		const titleConfig = layout.title;
		ctx.font = `bold ${titleConfig.fontSize}px ${titleConfig.fontFamily}`;
		ctx.fillStyle = titleConfig.color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		const textMaxWidth = width - titleConfig.marginX * 2;
		const textX = width / 2;
		const textY = imgY + imgHeight + titleConfig.marginTop;

		const lines = wrapText(ctx, title, textMaxWidth, titleConfig.maxLines);
		const lineHeight = titleConfig.fontSize * titleConfig.lineHeight;

		lines.forEach((line, index) => {
			ctx.fillText(line, textX, textY + index * lineHeight);
		});

		if (logoSrc && layout.logo) {
			const logo = await loadImage(logoSrc);
			const logoConfig = layout.logo;
			const logoAspect = logo.width / logo.height;
			const logoHeight = logoConfig.height;
			const logoWidth = logoHeight * logoAspect;
			const logoX = (width - logoWidth) / 2;
			const logoY = height - logoConfig.marginBottom - logoHeight;
			ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
		}
	} catch (err) {
		ctx.fillStyle = '#666';
		ctx.font = '24px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('Image not available', width / 2, height / 2);
	}
};

/**
 * Generate a social image and return a PNG blob.
 *
 * @param {Object} opt                   - Generation options.
 * @param {string} opt.sourceImageUrl    - URL of the source image.
 * @param {string} opt.title             - The title to display.
 * @param {string} [opt.platformType]    - Platform key (default 'instagram').
 * @param {Object} [opt.layoutOverrides] - Optional layout overrides.
 * @param {string} [opt.logoSrc]         - Optional logo URL.
 * @param {Object} [opt.platformSizes]   - Optional custom platform sizes.
 * @return {Promise<Blob>} The generated image as a PNG blob.
 */
export const generateImage = async (opt) => {
	const {
		sourceImageUrl,
		title,
		platformType = 'instagram',
		layoutOverrides = null,
		logoSrc = null,
		platformSizes = null,
	} = opt || {};
	getPlatformConfig(platformType, platformSizes);

	const canvas = document.createElement('canvas');
	await renderToCanvas({
		canvas,
		sourceImageUrl,
		title,
		platformType,
		layoutOverrides,
		logoSrc,
		platformSizes,
	});

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error('Failed to generate image blob'));
			},
			'image/png',
			1.0
		);
	});
};

/**
 * Generate a social image and return it as a File.
 *
 * @param {Object} opts                   - Generation options.
 * @param {string} opts.sourceImageUrl    - URL of the source image.
 * @param {string} opts.title             - The title.
 * @param {string} opts.platformType      - Platform key.
 * @param {string} opts.filename          - Filename for the generated file.
 * @param {Object} [opts.layoutOverrides] - Optional layout overrides.
 * @param {string} [opts.logoSrc]         - Optional logo URL.
 * @param {Object} [opts.platformSizes]   - Optional custom platform sizes.
 * @return {Promise<File>} The generated image as a File object.
 */
export const generateImageFile = async (opts) => {
	const {
		sourceImageUrl,
		title,
		platformType,
		filename,
		layoutOverrides = null,
		logoSrc = null,
		platformSizes = null,
	} = opts || {};
	const blob = await generateImage({
		sourceImageUrl,
		title,
		platformType,
		layoutOverrides,
		logoSrc,
		platformSizes,
	});
	return new File([blob], filename, { type: 'image/png' });
};

export default generateImage;
