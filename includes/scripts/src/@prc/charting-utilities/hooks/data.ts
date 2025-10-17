// TYPES
import type { FlatData } from '../types/flatData';
import type { DataRender } from '../types/dataRender';
import { ascending, descending } from 'd3-array';

const getFlattenedData = (data: any) => {
	return data
		.reduce((acc: any, curr: any) => {
			return acc.concat(curr);
		}, [])
		.map((row: any) => {
			return Object.keys(row).reduce((acc, key) => {
				const value =
					row[key] === '' ||
					isNaN(row[key]) ||
					typeof row[key] === 'boolean'
						? row[key]
						: parseFloat(row[key]);
				return {
					...acc,
					[key]: value,
				};
			}, {});
		}) as FlatData[];
};

type GroupedData = {
	group: string | null;
	data: FlatData[];
};

const getGroupedData = (
	flattenedData: FlatData[],
	dataRender: DataRender
): GroupedData[] => {
	if (!dataRender.groupBreaksActive || !dataRender.groupBreaksCategory) {
		// If no grouping, apply sorting to entire dataset
		const sortedData = [...flattenedData];
		sortedData.sort((a: FlatData, b: FlatData) => {
			if (dataRender.sortOrder === 'ascending') {
				return ascending(a[dataRender.sortKey], b[dataRender.sortKey]);
			}
			if (dataRender.sortOrder === 'descending') {
				return descending(a[dataRender.sortKey], b[dataRender.sortKey]);
			}
			return 0;
		});
		return [{ group: null, data: sortedData }];
	}

	// Group by the specified category
	const groups = new Map<string, FlatData[]>();
	flattenedData.forEach((item: FlatData) => {
		const groupKey = item[dataRender.groupBreaksCategory!];
		if (!groups.has(groupKey)) {
			groups.set(groupKey, []);
		}
		groups.get(groupKey)!.push(item);
	});

	// Sort within each group
	const sortedGroups = Array.from(groups.entries()).map(([group, data]) => {
		const sortedData = [...data];
		sortedData.sort((a: FlatData, b: FlatData) => {
			if (dataRender.sortOrder === 'ascending') {
				return ascending(a[dataRender.sortKey], b[dataRender.sortKey]);
			}
			if (dataRender.sortOrder === 'descending') {
				return descending(a[dataRender.sortKey], b[dataRender.sortKey]);
			}
			return 0;
		});
		return { group, data: sortedData };
	});

	// If groupBreaksCategoryValues is defined, use it to order the groups
	if (
		dataRender.groupBreaksCategoryValues &&
		dataRender.groupBreaksCategoryValues.length > 0
	) {
		const orderedGroups: GroupedData[] = [];
		dataRender.groupBreaksCategoryValues.forEach(
			(groupName: string | number) => {
				// let's sanitize the groupName for case insensitivity
				const sanitizedGroupName =
					typeof groupName === 'string'
						? groupName.toLowerCase()
						: groupName;
				const found = sortedGroups.find(
					({ group }) => group?.toLowerCase() === sanitizedGroupName
				);
				if (found) {
					orderedGroups.push(found);
				}
			}
		);
		// Add any groups that aren't in groupBreaksCategoryValues at the end
		sortedGroups.forEach((group) => {
			if (!orderedGroups.find((g) => g.group === group.group)) {
				orderedGroups.push(group);
			}
		});
		return orderedGroups;
	}

	return sortedGroups;
};

type GroupPositioning = {
	group: string | null;
	data: FlatData[];
	startY: number;
	height: number;
	breakHeight: number;
	startX: number;
	width: number;
	breakWidth: number;
};

/**
 * Calculate group positioning for horizontal charts
 * (Bars grow vertically, groups stack vertically with dynamic height)
 */
const getGroupPositioningHorizontal = (
	groupedData: GroupedData[],
	dataRender: DataRender,
	independentScale: any,
	innerHeight: number
): {
	groupPositioning: GroupPositioning[];
	actualContentHeight: number;
} => {
	if (!dataRender.groupBreaksActive) {
		const positioning = groupedData.map(({ group, data }) => ({
			group,
			data,
			startY: 0,
			height: innerHeight,
			breakHeight: 0,
			startX: 0,
			width: 0,
			breakWidth: 0,
		}));
		return {
			groupPositioning: positioning,
			actualContentHeight: innerHeight,
		};
	}

	const breakHeight = dataRender.groupBreaks?.breakStyles?.height || 20;
	const itemHeight = independentScale.step();
	let cumulativeOffset = 0;

	const positioning = groupedData.map(({ group, data }, groupIndex) => {
		const groupHeight = data.length * itemHeight;
		const result = {
			group,
			data,
			startY: cumulativeOffset,
			height: groupHeight,
			breakHeight: groupIndex > 0 ? breakHeight : 0,
			startX: 0,
			width: 0,
			breakWidth: 0,
		};
		cumulativeOffset +=
			groupHeight +
			(groupIndex < groupedData.length - 1 ? breakHeight : 0);
		return result;
	});

	return {
		groupPositioning: positioning,
		actualContentHeight: cumulativeOffset,
	};
};

/**
 * Calculate group positioning for vertical charts
 * (Bars grow horizontally, groups stack horizontally with proportional width)
 */
const getGroupPositioningVertical = (
	groupedData: GroupedData[],
	dataRender: DataRender,
	independentScale: any,
	innerWidth: number
): {
	groupPositioning: GroupPositioning[];
	actualContentWidth: number;
} => {
	if (!dataRender.groupBreaksActive) {
		const positioning = groupedData.map(({ group, data }) => ({
			group,
			data,
			startY: 0,
			height: 0,
			breakHeight: 0,
			startX: 0,
			width: innerWidth,
			breakWidth: 0,
		}));
		return {
			groupPositioning: positioning,
			actualContentWidth: innerWidth,
		};
	}

	const breakWidth = dataRender.groupBreaks?.breakStyles?.height || 20;
	const numGroups = groupedData.length;
	const totalBreakWidth = (numGroups - 1) * breakWidth;
	const availableWidth = innerWidth - totalBreakWidth;

	// Calculate total items for proportional width distribution
	const totalItems = groupedData.reduce(
		(sum, { data }) => sum + data.length,
		0
	);

	let cumulativeOffset = 0;
	const positioning = groupedData.map(({ group, data }, groupIndex) => {
		// Proportional width based on number of items in group
		const groupWidth = (data.length / totalItems) * availableWidth;
		const result = {
			group,
			data,
			startY: 0,
			height: 0,
			breakHeight: 0,
			startX: cumulativeOffset,
			width: groupWidth,
			breakWidth: groupIndex > 0 ? breakWidth : 0,
		};
		cumulativeOffset +=
			groupWidth + (groupIndex < numGroups - 1 ? breakWidth : 0);
		return result;
	});

	return {
		groupPositioning: positioning,
		actualContentWidth: cumulativeOffset,
	};
};

export {
	getFlattenedData,
	getGroupedData,
	getGroupPositioningHorizontal,
	getGroupPositioningVertical,
};
export type { GroupedData, GroupPositioning };
