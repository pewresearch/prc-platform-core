export type RegressionLineStyle = {
	stroke: string;
	strokeWidth: number;
	strokeDasharray: string;
};

export type RegressionLine = {
	active: boolean;
	type:
		| 'linear'
		| 'exponential'
		| 'polynomial'
		| 'logarithmic'
		| 'power'
		| 'quadratic'
		| 'loess';
	strokeDasharray: string;
	strokeWidth: number;
	stroke: string;
	/** When true, render one regression line per group break (or per category column in wide format). */
	perGroupBreak: boolean;
	/**
	 * Per-group style overrides, keyed by group value (e.g. "Democrats") or category
	 * column name (e.g. "y1") depending on whether groupBreaksCategory is active.
	 * Falls back to the shared stroke/strokeWidth/strokeDasharray defaults.
	 */
	groupBreakStyles: Record<string, Partial<RegressionLineStyle>>;
};
