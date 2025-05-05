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

const Icon = memo(({ library = 'solid', icon, size = 1 }) => {
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
		if (typeof size === 'string') {
			return size;
		}
		if (typeof size === 'number') {
			return `${size}em`;
		}
	}, [size]);

	if (!icon || typeof icon !== 'string') {
		return null;
	}

	return (
		<i className="icon">
			<svg style={{ width: sizeUnit, height: sizeUnit }}>
				<use xlinkHref={xlinkHref}></use>
			</svg>
		</i>
	);
});

Icon.displayName = 'Icon';

export default Icon;
