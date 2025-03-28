// TODO: Should probably move this and the one in core-table block to prc scripts

/**
  External Dependencies
 */
import CSV from 'comma-separated-values';

/**
 * Utilities for managing core/table data
 */

function convertToRow(d, tag = 'td') {
	return d.map((content) => ({
		content,
		tag,
	}));
}

function convertJSONToAttributes(d, tag = 'td') {
	if ('th' === tag) {
		return convertToRow(d, tag);
	}
	return d.map((row) => ({ cells: convertToRow(row, tag) }));
}

function parseCSV(csvInput, attribute, setItems, setAttributes, onChange) {
	const opts = {
		header: false,
	};
	const csv = new CSV(csvInput, opts);
	const parsed = csv.parse();
	const headerData = convertJSONToAttributes(parsed.shift(), 'th');
	const bodyData = convertJSONToAttributes(parsed);

	// create an object with the data
	// make a new array for each row
	// each row is an object with the header as the key and the value as the content

	const data = parsed.reduce((acc, row) => {
		const rowObj = {};
		row.forEach((cell, i) => {
			rowObj[headerData[i].content] = cell;
		});
		// additionally, add a key called "value" and a key called "label", and set them to the first column
		rowObj.value = rowObj[headerData[0].content]
			.toLowerCase()
			.replace(/\s/g, '-')
			.replace(/[^a-zA-Z0-9-]/g, '');
		rowObj.label = rowObj[headerData[0].content];
		acc.push(rowObj);
		return acc;
	}, []);
	console.log({ data });
	setItems(data);
	if (typeof onChange === 'function') {
		onChange(data);
	} else if (typeof setAttributes === 'function') {
		setAttributes({
			[attribute]: data
				.filter((i) => !i.disabled)
				.map((i) => ({
					label: i.label,
					value: i.value,
				})),
		});
	}
	return data;
}

export default function handleCSV(
	files,
	attribute,
	setItems,
	setAtttibutes,
	onChange
) {
	// eslint-disable-next-line no-undef
	const reader = new FileReader();
	reader.onload = () => {
		parseCSV(reader.result, attribute, setItems, setAtttibutes, onChange);
	};
	Array.from(files).forEach((file) => reader.readAsBinaryString(file));
}
