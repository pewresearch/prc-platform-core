export type Pie = {
	showCategoryLabels: boolean;
	hasPathStroke: boolean;
	pathStrokeWidth: number;
	pathStrokeColor: string;
	// Group-related properties for visually separating slices into groups
	groupGapAngle?: number; // Explode offset in pixels - how far to push groups outward (default: 10)
	showGroupArcs?: boolean; // Show arc separators tracing the circumference of each group
	groupArcStyle?: {
		stroke?: string;
		strokeWidth?: number;
		strokeDasharray?: string;
	};
};
