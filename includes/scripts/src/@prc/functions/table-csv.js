/**
 * Converts an HTML table element into a flat array of row arrays.
 *
 * @param {HTMLTableElement} table Table element.
 * @return {string[][]} Array of rows, each row an array of cell text.
 */
function tableToArray(table) {
	const rows = table.querySelectorAll('tr');
	const data = [];
	for (let i = 0; i < rows.length; i += 1) {
		const row = rows[i];
		const cols = row.querySelectorAll('td, th');
		const rowData = [];
		for (let j = 0; j < cols.length; j += 1) {
			const col = cols[j];
			rowData.push(col.innerText);
		}
		data.push(rowData);
	}
	return data;
}

/**
 * Converts array of arrays to CSV string, with optional leading/trailing metadata.
 *
 * @param {Array[]|string} objArray   Array of arrays (or JSON string).
 * @param {Object}         [metadata] Optional { title, subtitle, note, source, tag }.
 * @return {string|false} CSV string or false if empty/invalid.
 */
function arrayToCSV(objArray, metadata) {
	if (undefined === objArray || objArray.length === 0) return false;
	const array =
		'object' !== typeof objArray ? JSON.parse(objArray) : objArray;
	const checkIfEmpty = (str) => (str !== undefined ? str : '');
	let str = '';
	if (undefined !== metadata) {
		str += `${checkIfEmpty(metadata.title)}
			${checkIfEmpty(metadata.subtitle)}

			`;
	}
	for (let i = 0; i < array.length; i += 1) {
		let line = '';
		for (let j = 0; j < array[i].length; j += 1) {
			if (j > 0) line += ',';
			if (array[i][j].indexOf(',') > -1) {
				line += `"${array[i][j]}"`;
			} else {
				line += array[i][j];
			}
		}
		str += `${line}
		`;
	}
	if (undefined !== metadata) {
		str += `
		${checkIfEmpty(metadata.note)}
		${checkIfEmpty(metadata.source)}
		${checkIfEmpty(metadata.tag)}`;
	}
	return str;
}

export { tableToArray, arrayToCSV };
