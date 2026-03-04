import { useMemo } from 'react';
import { getRegressionFn } from './regression';
import type { RegressionLine } from '../types/regressionLine';

/**
 * Computes a single regression line dataset from voronoi scatter data.
 * Use this for the combined (non-per-category) mode.
 *
 * @param voronoiData      Array of data objects with numeric x/y properties.
 * @param regressionConfig The regression block attribute object.
 * @return regressionData — an array of [x, y] tuples suitable for LinePath.
 */
export function useRegressionLine(
	voronoiData: Array<{ x: any; y: any }>,
	regressionConfig: RegressionLine
): { regressionData: [number, number][] } {
	const regressionFn = useMemo(
		() => getRegressionFn(regressionConfig.type),
		[regressionConfig.type]
	);

	const regressionData = useMemo(
		() => regressionFn(voronoiData) as unknown as [number, number][],
		[regressionFn, voronoiData]
	);

	return { regressionData };
}

/**
 * Computes one regression line dataset per group from categorised voronoi
 * scatter data. Use this for per-category mode (e.g. Democrats + Republicans).
 *
 * Each group's data is filtered and regressed independently so that one series
 * does not influence another's trend line.
 *
 * @param voronoiData      Array of data objects with x, y, category, and optional colorGroup fields.
 * @param regressionConfig The regression block attribute object.
 * @param groupByKey       Which field to split on — 'category' for column-based series
 *                         (wide format), or 'colorGroup' for groupBreaksCategory mode
 *                         (long format where a column like 'Region' tags each row).
 *                         Defaults to 'category'.
 * @return regressionDataByCategory — map of group value → [x, y][] tuples.
 */
export function useRegressionLines(
	voronoiData: Array<{ x: any; y: any; category: string; colorGroup?: string }>,
	regressionConfig: RegressionLine,
	groupByKey: 'category' | 'colorGroup' = 'category'
): { regressionDataByCategory: Record<string, [number, number][]> } {
	const regressionFn = useMemo(
		() => getRegressionFn(regressionConfig.type),
		[regressionConfig.type]
	);

	const regressionDataByCategory = useMemo(() => {
		const groups = [
			...new Set(
				voronoiData
					.map((d) => (groupByKey === 'colorGroup' ? d.colorGroup : d.category))
					.filter((v): v is string => v !== undefined && v !== null && v !== '')
			),
		];
		const result: Record<string, [number, number][]> = {};
		for (const group of groups) {
			const groupPoints = voronoiData.filter((d) =>
				groupByKey === 'colorGroup' ? d.colorGroup === group : d.category === group
			);
			if (groupPoints.length >= 2) {
				result[group] = regressionFn(groupPoints) as unknown as [number, number][];
			}
		}
		return result;
	}, [regressionFn, voronoiData, groupByKey]);

	return { regressionDataByCategory };
}
