import { Legend } from '../types/legend';

export const getLegendProps = (config: Legend) => {
	const { orientation, markerStyle, margin } = config;

	const marginString = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`;
	return {
		style: {
			display: 'flex',
			flexFlow: `${orientation} wrap`,
		},
		shape: markerStyle,
		shapeWidth: 9,
		shapeHeight: 9,
		direction: orientation,
		alignItems: 'flex-start',
		margin: marginString,
		legendLabelProps: {
			style: {
				lineHeight: 1.1,
			},
		},
		shapeStyle: () => ({
			strokeWidth: 3,
			transform: markerStyle === 'line' ? 'translate(0, 1.5px)' : 'none',
		}),
	};
};
