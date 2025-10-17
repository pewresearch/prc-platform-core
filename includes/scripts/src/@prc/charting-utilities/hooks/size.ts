import { DiffColumn } from '../types/diffColumn';
import type { Size } from '../types/windowSize';
import { Layout } from '../types/layout';

type OverflowType = 'scroll' | 'hidden';

export type ChartDimensions = {
	chartWidth: number;
	innerWidth: number;
	innerHeight: number;
	chartHeight: number;
	overflow: OverflowType;
};

const getOverflowX = (layout: Layout) => {
	if (layout.overflowX === 'scroll') {
		return 'scroll';
	}
	if (layout.overflowX === 'scroll-fixed-y-axis') {
		return 'scroll';
	}
	return 'hidden';
};

const getChartDimensions = (
	size: Size,
	layout: Layout,
	diffColumn?: DiffColumn
): ChartDimensions => {
	const horizPadding = layout.padding.left + layout.padding.right;
	const vertPadding = layout.padding.top + layout.padding.bottom;
	const overflow = getOverflowX(layout) as OverflowType;
	// 0th, lets check to see if the overflowX is set to 'scroll', if so, we need to return the layout width as the chart width
	if (
		layout.overflowX === 'scroll' ||
		layout.overflowX === 'scroll-fixed-y-axis'
	) {
		return {
			chartWidth: layout.width,
			innerWidth: layout.width - horizPadding,
			innerHeight: layout.height - vertPadding,
			chartHeight: layout.height,
			overflow,
		};
	}
	// first, check if a diff column is active.
	// if so, it will impact the inner chart width
	const diffColumnTotalWidth =
		diffColumn && diffColumn.active
			? diffColumn.style.width + diffColumn.style.marginLeft
			: 0;

	const willResize =
		size.width !== undefined &&
		size.width !== 0 &&
		size.width < layout.width;

	// Ensure a concrete numeric width for calculations
	const effectiveChartWidth: number =
		willResize && typeof size.width === 'number'
			? size.width
			: layout.width;

	if (layout.overflowX === 'preserve-aspect-ratio') {
		const heightToWidthRatio = layout.height / layout.width;
		const chartHeight =
			willResize && typeof size.width === 'number'
				? size.width * heightToWidthRatio
				: layout.height;
		// @ts-ignore
		return {
			chartWidth: effectiveChartWidth,
			chartHeight,
			innerWidth: effectiveChartWidth - horizPadding,
			innerHeight: layout.height - vertPadding,
			overflow,
		};
	}
	// if chart width exists, is not 0, and is less than the layout width, use it
	// otherwise, use the layout width
	return {
		chartWidth: effectiveChartWidth,
		innerWidth: effectiveChartWidth - horizPadding - diffColumnTotalWidth,
		innerHeight: layout.height - vertPadding,
		chartHeight: layout.height,
		overflow,
	};
};

export { getChartDimensions };
