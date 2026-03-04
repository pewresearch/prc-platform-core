/**
 * Default platform size definitions for social media image generation.
 * Each platform defines dimensions and layout configuration.
 * Uses generic web-safe fonts; consumers can override via platformSizes prop.
 */

/**
 * External Dependencies
 */
import { Icon } from '@prc/icons';

const DEFAULT_FONT = 'Georgia, "Times New Roman", Times, serif';

export const DEFAULT_PLATFORM_SIZES = {
	instagram: {
		name: 'Instagram',
		icon: <Icon icon="instagram" library="brands" size="12px" />,
		width: 1121,
		height: 1920,
		layout: {
			backgroundColor: '#000000',
			image: {
				top: 50,
				maxHeight: 850,
			},
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 72,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 80,
				marginX: 80,
				maxLines: 4,
			},
			logo: {
				height: 80,
				marginBottom: 80,
			},
		},
	},
	threads: {
		name: 'Threads',
		icon: <Icon icon="threads" library="brands" size="12px" />,
		width: 1080,
		height: 1920,
		layout: {
			backgroundColor: '#000000',
			image: { top: 50, maxHeight: 850 },
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 68,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 80,
				marginX: 70,
				maxLines: 4,
			},
			logo: { height: 75, marginBottom: 80 },
		},
	},
	twitter: {
		name: 'Twitter',
		icon: <Icon icon="twitter" library="brands" size="12px" />,
		width: 1200,
		height: 675,
		layout: {
			backgroundColor: '#000000',
			image: { top: 0, maxHeight: 400 },
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 48,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 30,
				marginX: 60,
				maxLines: 3,
			},
			logo: { height: 50, marginBottom: 30 },
		},
	},
	bluesky: {
		name: 'Bluesky',
		icon: <Icon icon="bluesky" library="brands" size="12px" />,
		width: 1200,
		height: 630,
		layout: {
			backgroundColor: '#000000',
			image: { top: 0, maxHeight: 380 },
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 44,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 25,
				marginX: 60,
				maxLines: 3,
			},
			logo: { height: 45, marginBottom: 25 },
		},
	},
	facebook: {
		name: 'Facebook',
		icon: <Icon icon="facebook" library="brands" size="12px" />,
		width: 1200,
		height: 630,
		layout: {
			backgroundColor: '#000000',
			image: { top: 0, maxHeight: 380 },
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 44,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 25,
				marginX: 60,
				maxLines: 3,
			},
			logo: { height: 45, marginBottom: 25 },
		},
	},
	linkedin: {
		name: 'LinkedIn',
		icon: <Icon icon="linkedin" library="brands" size="12px" />,
		width: 1200,
		height: 627,
		layout: {
			backgroundColor: '#000000',
			image: { top: 0, maxHeight: 375 },
			title: {
				fontFamily: DEFAULT_FONT,
				fontSize: 44,
				lineHeight: 1.2,
				color: '#ffffff',
				marginTop: 25,
				marginX: 60,
				maxLines: 3,
			},
			logo: { height: 45, marginBottom: 25 },
		},
	},
};

export const PLATFORM_NAMES = Object.keys(DEFAULT_PLATFORM_SIZES);

export default DEFAULT_PLATFORM_SIZES;
