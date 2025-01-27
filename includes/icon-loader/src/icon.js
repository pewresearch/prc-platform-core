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

const Icon = ({ library = 'solid', icon, size = 1 }) => {
	if (!icon && typeof icon !== 'string') {
		return;
	}
	if (AVAILABLE_LIBRARIES.indexOf(library) === -1) {
		library = 'solid';
	}
	console.log('Icon', { library, icon, size });
	return (
		<i className="icon">
			<svg
				style={{
					width: `${size}em`,
					height: `${size}em`,
				}}
			>
				<use
					xlinkHref={`${window.location.origin}/wp-content/plugins/prc-icon-library/build/icons/sprites/${library}.svg#${icon}`}
				></use>
			</svg>
		</i>
	);
};

export default Icon;
