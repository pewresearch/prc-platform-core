import type { FlatData } from '../types/flatData';
import { TableData } from '../types/tableData';

type AriaProps = {
	chartType: string;
	data: FlatData;
	tableData?: TableData;
	alt: string;
};

const isValidArray = (arr: unknown): arr is unknown[] => {
	return Array.isArray(arr) && arr.length > 0;
};

const filterValidItems = <T>(items: T[]): T[] => {
	return items.filter((item) => item !== null && item !== undefined);
};

const filterInternalKeys = (
	keys: string[]
): { filteredKeys: string[]; indexesToRemove: number[] } => {
	const indexesToRemove: number[] = [];
	const filteredKeys = keys.filter((key, index) => {
		if (key.startsWith('__')) {
			indexesToRemove.push(index);
			return false;
		}
		return true;
	});

	return { filteredKeys, indexesToRemove };
};

const formatDataValues = (
	items: unknown[],
	indexesToRemove: number[] = []
): string => {
	return items
		.map((item) => {
			const values = Object.values(item as object);
			const filteredValues = values.filter(
				(_, index) => !indexesToRemove.includes(index)
			);
			return `[${filteredValues.join(', ')}]`;
		})
		.join(', ');
};

const formatRowValues = (
	rows: string[][],
	indexesToRemove: number[] = []
): string => {
	return rows
		.map((row) => {
			const filteredRow = row.filter(
				(_, index) => !indexesToRemove.includes(index)
			);
			return `[${filteredRow.join(', ')}]`;
		})
		.join(', ');
};

const createAriaAttributes = (
	chartType: string,
	keys: string,
	values: string,
	alt: string
) => {
	if (keys.length === 0 || values.length === 0) {
		return {};
	}

	return {
		role: 'img',
		'aria-label': alt,
		'aria-datavariables': keys,
		'aria-datavaluearray': values,
		'aria-roledescription': chartType,
	};
};

const processDataArray = (chartType: string, data: FlatData, alt: string) => {
	if (!isValidArray(data) || !data[0]) {
		return {};
	}

	const allKeys = Object.keys(data[0]);
	const { filteredKeys, indexesToRemove } = filterInternalKeys(allKeys);
	const keys = filteredKeys.join(', ');
	const validData = filterValidItems(data);
	const values = formatDataValues(validData, indexesToRemove);

	return createAriaAttributes(chartType, keys, values, alt);
};

const processTableData = (
	chartType: string,
	tableData: TableData,
	alt: string
) => {
	const { header, rows } = tableData;

	if (!isValidArray(header) || !isValidArray(rows)) {
		return {};
	}

	const { filteredKeys: filteredHeader, indexesToRemove } =
		filterInternalKeys(header);
	const keys = filteredHeader.join(', ');
	const validRows = filterValidItems(rows).filter((row) => isValidArray(row));
	const values = formatRowValues(validRows as string[][], indexesToRemove);

	return createAriaAttributes(chartType, keys, values, alt);
};

export const getAria = (props: AriaProps) => {
	const { chartType, data, tableData, alt } = props;

	// Return empty object if no data is available
	if (!data && !tableData) {
		return {};
	}

	// Use table data if available, otherwise fall back to processed data
	if (tableData) {
		return processTableData(chartType, tableData, alt);
	}

	return processDataArray(chartType, data, alt);
};
