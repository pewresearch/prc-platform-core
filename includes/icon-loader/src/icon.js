import { memo, useMemo } from '@wordpress/element';

const AVAILABLE_LIBRARIES = [
	'brands',
	'duotone',
	'light',
	'regular',
	'sharp',
	'sharp-solid',
	'sharp-regular',
	'sharp-light',
	'sharp-thin',
	'solid',
	'thin',
	'custom-icons',
];

// Module-level cache for icon sources
const iconSourceCache = new Map();

// Memoize the base URL path
const getBaseIconPath = (() => {
	const basePath = `${window.location.origin}/wp-content/plugins/prc-icon-library/build/icons/sprites`;
	return (library) => `${basePath}/${library}.svg`;
})();

const VALID_UNITS = [
	'px',
	'em',
	'rem',
	'%',
	'vw',
	'vh',
	'vmin',
	'vmax',
	'ex',
	'ch',
	'cm',
	'mm',
	'in',
	'pt',
	'pc',
];

function hasUnit(value) {
	return VALID_UNITS.some((unit) => value.endsWith(unit));
}

const Icon = memo(({ library = 'solid', icon, size = 1, color = null }) => {
	// Validate library first
	const validLibrary = AVAILABLE_LIBRARIES.includes(library)
		? library
		: 'solid';

	// Get or create the xlinkHref value using the module-level cache
	const xlinkHref = useMemo(() => {
		const cacheKey = `${validLibrary}#${icon}`;
		if (!iconSourceCache.has(cacheKey)) {
			iconSourceCache.set(
				cacheKey,
				`${getBaseIconPath(validLibrary)}#${icon}`
			);
		}
		return iconSourceCache.get(cacheKey);
	}, [validLibrary, icon]);

	const sizeUnit = useMemo(() => {
		if (typeof size === 'number') {
			return `${size}em`;
		}
		if (typeof size === 'string') {
			return hasUnit(size) ? size : `${size}em`;
		}
		return undefined;
	}, [size]);

	const colorStyle = useMemo(() => {
		if (color) {
			return { color: `${color} !important` };
		}
		return {};
	}, [color]);

	const style = useMemo(() => {
		return {
			width: sizeUnit,
			height: sizeUnit,
			...colorStyle,
		};
	}, [sizeUnit, colorStyle]);

	if (!icon || typeof icon !== 'string') {
		return null;
	}

	return (
		<i className="icon">
			<svg style={style}>
				<use xlinkHref={xlinkHref}></use>
			</svg>
		</i>
	);
});

Icon.displayName = 'Icon';

export default Icon;
