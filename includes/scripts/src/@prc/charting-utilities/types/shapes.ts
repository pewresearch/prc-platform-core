/**
 * Shapes configuration type.
 *
 * Defines custom styling for individual chart shapes (bars, circles, paths, etc.)
 */

export type ShapeCustomStyle = {
	fill?: string;
	stroke?: string;
	opacity?: number;
	strokeWidth?: number;
	pattern?: 'solid' | 'striped' | 'dotted' | 'crosshatch';
};

/**
 * Segment-specific custom styling for line chart segments.
 */
export type SegmentCustomStyle = {
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	strokeDasharray?: string;
};

export type Shapes = {
	customStyles: {
		[key: string]: ShapeCustomStyle;
	};
	segmentStyles?: {
		[key: string]: SegmentCustomStyle;
	};
	segmentsActive?: boolean;
};
