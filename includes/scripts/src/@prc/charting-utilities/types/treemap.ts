export type TreemapTileMethod =
	| 'squarify'
	| 'binary'
	| 'dice'
	| 'slice'
	| 'sliceDice'
	| 'resquarify';

export type Treemap = {
	tile: TreemapTileMethod;
	/** Stroke color for treemap rectangles */
	rectStroke: string;
	/** Stroke width for treemap rectangles */
	rectStrokeWidth: number;
	/** Minimum area (in px²) a rectangle must have to display its label */
	labelMinArea: number;
	/** Padding between sibling nodes (inner padding) in pixels */
	paddingInner: number;
	/** Padding between parent and child nodes (outer padding) in pixels */
	paddingOuter: number;
	/** Whether to show group header labels */
	showGroupLabels: boolean;
	/** Whether to scale opacity within a group based on leaf values */
	scaleOpacity: boolean;
	/** Minimum opacity when scaleOpacity is enabled (0–1) */
	opacityRange: [number, number];
	/** Corner radius for treemap rectangles */
	borderRadius: number;
	/** Whether to show the numeric value inside each rectangle */
	showValues: boolean;
};
