/**
 * Drawing types for chart annotations/drawings layer
 */

// Drawing shape types
type DrawingType = 'line' | 'arrow' | 'lollipop' | 'circle' | 'rect' | 'path';

// Breakpoint for angled/polyline mode
interface Breakpoint {
	x: number;
	y: number;
}

// Line mode: straight, curved (bezier), or angled (polyline)
type LineMode = 'straight' | 'curved' | 'angled';

// Base drawing properties shared by all types
interface BaseDrawing {
	id: string;
	type: DrawingType;
	stroke: string;
	strokeWidth: number;
	strokeDasharray?: string; // e.g., "5 5", "10 5 2 5"
	fill?: string;
	opacity?: number;
	fillOpacity?: number;
	positioningContext?: 'chart' | 'inner';
}

// Line drawing (straight, curved, or angled)
interface LineDrawing extends BaseDrawing {
	type: 'line';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	// Line mode
	lineMode?: LineMode;
	// Curved mode: control point for quadratic bezier
	bendX?: number;
	bendY?: number;
	// Angled mode: intermediate breakpoints
	breakpoints?: Breakpoint[];
}

// Arrow drawing (line with arrowhead, optionally curved or angled)
interface ArrowDrawing extends BaseDrawing {
	type: 'arrow';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	arrowSize?: number;
	// Line mode
	lineMode?: LineMode;
	// Curved mode: control point for quadratic bezier
	bendX?: number;
	bendY?: number;
	// Angled mode: intermediate breakpoints
	breakpoints?: Breakpoint[];
}

// Lollipop drawing (line with dot at end)
interface LollipopDrawing extends BaseDrawing {
	type: 'lollipop';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	dotRadius?: number; // Size of the end dot (default: 6)
	// Line mode
	lineMode?: LineMode;
	// Curved mode: control point for quadratic bezier
	bendX?: number;
	bendY?: number;
	// Angled mode: intermediate breakpoints
	breakpoints?: Breakpoint[];
}

// Circle drawing
interface CircleDrawing extends BaseDrawing {
	type: 'circle';
	cx: number;
	cy: number;
	r: number;
}

// Rectangle drawing
interface RectDrawing extends BaseDrawing {
	type: 'rect';
	x: number;
	y: number;
	width: number;
	height: number;
	rx?: number;
}

// Freehand path drawing
interface PathDrawing extends BaseDrawing {
	type: 'path';
	d: string;
}

// Union type for all drawings
type Drawing =
	| LineDrawing
	| ArrowDrawing
	| LollipopDrawing
	| CircleDrawing
	| RectDrawing
	| PathDrawing;

// Config for drawings layer
interface DrawingsConfig {
	active: boolean;
	items: Drawing[];
}

export type {
	DrawingType,
	LineMode,
	Breakpoint,
	BaseDrawing,
	LineDrawing,
	ArrowDrawing,
	LollipopDrawing,
	CircleDrawing,
	RectDrawing,
	PathDrawing,
	Drawing,
	DrawingsConfig,
};
