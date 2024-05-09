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
];

const Icon = ({ library = 'solid', icon, size = 1 }) => {
	if (!icon && typeof icon !== 'string') {
		return;
	}
	if (AVAILABLE_LIBRARIES.indexOf(library) === -1) {
		library = 'solid';
	}
	return (
		<i className="icon">
			<svg
				style={{
					width: `${size}em`,
					height: `${size}em`,
				}}
			>
				{/*  TODO: pre-launch, update the href to the correct path by removing pewresearch-org */}
				<use
					href={`${window.location.origin}/pewresearch-org/wp-content/plugins/prc-icon-library/build/icons/sprites/${library}.svg#${icon}`}
				></use>
			</svg>
		</i>
	);
};

export default Icon;
