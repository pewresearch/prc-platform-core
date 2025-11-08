// shared hooks
import { getAria } from './aria';
import { getAxisProps } from './axes';
import { getGridProps } from './grid';
import { getLabelFormat, getLabelProps, positionBarLabel } from './labels';
import { getLegendProps } from './legend';
import { getLineProps } from './line';
import { getChartDimensions } from './size';
import {
	getLocalPoint,
	getTooltipFormat,
	getTooltipHeaderFormat,
	getTooltipVisible,
	getTooltipMapDeemphasisProps,
} from './tooltips';
import { getVoronoiProps } from './voronoi';
import type { FlatData } from '../types/flatData';
import type { TableData } from '../types/tableData';
import type { BaseConfig } from '../types/configTypes';
import type { Size } from '../types/windowSize';
import { getTextVisible } from './text';
import {
	getFlattenedData,
	getGroupedData,
	getGroupPositioningHorizontal,
	getGroupPositioningVertical,
} from './data';

type SharedProps = {
	config: BaseConfig;
	data: FlatData | any;
	size: Size;
	tableData?: TableData;
	chartType: string;
	dependentScale?: any;
	independentScale?: any;
	actualContentHeight?: number;
};

const getSharedProps = ({
	config,
	data,
	size,
	tableData,
	chartType,
	dependentScale,
	independentScale,
	actualContentHeight,
}: SharedProps) => {
	const {
		dependentAxis,
		independentAxis,
		layout,
		tooltip,
		annotations,
		labels,
		legend,
		diffColumn,
		voronoi,
		metadata,
	} = config;
	const { chartWidth, innerWidth, innerHeight } = getChartDimensions(
		size,
		layout,
		diffColumn
	);
	const { alt } = metadata;

	// Use actualContentHeight for grid height if provided (for grouped charts)
	const gridHeight = actualContentHeight || innerHeight;

	return {
		ariaProps: getAria({ chartType: chartType, data, tableData, alt: alt }),
		labelProps: getLabelProps(labels),
		legendProps: getLegendProps(legend),
		voronoiProps: getVoronoiProps(voronoi),
		dependentAxisProps: getAxisProps(
			dependentAxis,
			dependentScale,
			layout.theme,
			config.dataRender.yFormat
		),
		independentAxisProps: getAxisProps(
			independentAxis,
			independentScale,
			layout.theme,
			config.dataRender.xFormat
		),
		dependentGridProps: getGridProps(
			dependentAxis,
			dependentScale,
			innerWidth,
			gridHeight
		),
		independentGridProps: getGridProps(
			independentAxis,
			independentScale,
			innerWidth,
			gridHeight
		),
		tooltipVisible: getTooltipVisible(layout, chartWidth, tooltip),
		annotationsVisible: getTextVisible(layout, chartWidth, annotations),
		chartWidth,
		innerWidth,
		innerHeight,
		actualContentHeight: gridHeight,
	};
};

export {
	getSharedProps,
	getAria,
	getAxisProps,
	getGridProps,
	getLabelFormat,
	getLabelProps,
	positionBarLabel,
	getLegendProps,
	getLineProps,
	getChartDimensions,
	getLocalPoint,
	getTooltipFormat,
	getTooltipHeaderFormat,
	getTooltipVisible,
	getTextVisible,
	getVoronoiProps,
	getFlattenedData,
	getGroupedData,
	getGroupPositioningHorizontal,
	getGroupPositioningVertical,
	getTooltipMapDeemphasisProps,
};
