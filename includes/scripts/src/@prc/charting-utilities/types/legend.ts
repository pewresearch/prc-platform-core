export type Legend = {
	active: boolean;
	orientation: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	title: string;
	offsetX: number;
	offsetY: number;
	alignment: 'flex-start' | 'flex-end' | 'center' | 'none';
	markerStyle: 'rect' | 'circle' | 'line';
	borderStroke: string;
	fill: string;
	fontSize: number;
	margin: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}; // CSS margin string (computed from margin object in chart-builder)
	categories: string[];
	labelDelimiter: string;
	labelLower: string;
	labelUpper: string;
};
