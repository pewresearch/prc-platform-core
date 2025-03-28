/* eslint-disable max-lines */
/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { getEntityRecord } from '@wordpress/core-data';

function ifMatchSetAttribute(
	needle,
	haystack,
	attrKey,
	attrValue,
	setAttributes
) {
	if (needle === haystack) {
		setAttributes({ [attrKey]: attrValue });
	}
}

function randomId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_${Math.random().toString(36).substr(2, 9)}`;
}

function getTermsByLetter(taxonomy, letter) {
	return new Promise((resolve) => {
		apiFetch({
			path: `/prc-api/v2/blocks/helpers/get-taxonomy-by-letter/?taxonomy=${taxonomy}&letter=${letter}`,
		}).then((terms) => {
			resolve(terms);
		});
	});
}

function getTerms(taxonomy, perPage = 25) {
	return new Promise((resolve) => {
		const data = {};
		apiFetch({
			path: `/wp/v2/${taxonomy}?per_page=${perPage}`,
		}).then((terms) => {
			for (let index = 0; index < terms.length; index++) {
				const slug = terms[index].slug.replace(
					`${taxonomy.toLowerCase()}_`,
					''
				);
				data[terms[index].id] = {
					id: terms[index].id,
					name: terms[index].name,
					parent: terms[index].parent,
					slug,
				};
			}
			resolve(data);
		});
	});
}

function getTermsAsOptions(
	taxonomy,
	perPage,
	termValue = 'slug',
	sortByLabel = true
) {
	return new Promise((resolve) => {
		getTerms(taxonomy, perPage).then((data) => {
			const labelOptions = [];

			Object.keys(data).forEach((key) => {
				const termObj = data[key];

				const value = termObj[termValue];

				let label = termObj.name;
				if (undefined !== termObj.parent && 0 !== termObj.parent) {
					label = ` -- ${label}`;
				}

				labelOptions.push({
					value,
					label,
				});
			});

			if (false !== sortByLabel) {
				labelOptions.sort((a, b) => (a.label > b.label ? 1 : -1));
			}

			resolve(labelOptions);
		});
	});
}

function getTermsAsTree(taxonomy) {
	return new Promise((resolve) => {
		getTerms(taxonomy).then((data) => {
			const treeData = [];
			// Convert data from object of objects to array of objects.
			const convertedData = Object.keys(data).map((i) => data[i]);
			// Filter out the parent terms first
			const parentTerms = convertedData.filter((e) => 0 === e.parent);
			parentTerms.forEach((e) => {
				// Get children by filtering for terms with parent matching this id in loop.
				const c = convertedData.filter((f) => f.parent === e.id);
				const children = [];
				// Construct children array.
				c.forEach((cT) => {
					children.push({
						name: cT.name,
						id: cT.id,
					});
				});
				// Finally, push the fully structured parent -> child relationship to the tree data.
				treeData.push({
					name: e.name,
					id: e.id,
					children,
				});
			});

			resolve(treeData);
		});
	});
}

// convert an html table into a flat array of arrays
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

// cnovert array of arrays to formatted csv, with optional metadata
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
		// if a value has a comma in it, wrap it in quotes
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

function wpRestApiTermsToTree(terms, restrictTo = []) {
	console.log('wpRestApiTermsToTree', terms, restrictTo);
	const getTopLevel = (termId) => {
		const term = terms.find((t) => t.id === termId);
		if (0 === term.parent) {
			return term;
		}
		return getTopLevel(term.parent, terms);
	};

	const treeData = [];
	if (!terms) {
		return treeData;
	}
	// Convert data from object of objects to array of objects.
	const convertedData = Object.keys(terms).map((i) => terms[i]);
	// Filter out the parent terms first
	const parentTerms = convertedData.filter((e) => 0 === e.parent);
	parentTerms.forEach((e) => {
		// Get children by filtering for terms with parent matching this id in loop.
		const c = convertedData.filter((f) => f.parent === e.id);
		const children = [];
		// Construct children array.
		c.forEach((cT) => {
			children.push({
				name: cT.name,
				id: cT.id,
				meta: cT.meta,
			});
		});
		// sort children by name
		children.sort((a, b) => (a.name > b.name ? 1 : -1));
		// Finally, push the fully structured parent -> child relationship to the tree data.
		treeData.push({
			name: e.name,
			id: e.id,
			meta: e.meta,
			children,
		});
	});

	let r = treeData;

	if (0 < restrictTo.length) {
		const restrictedTreeData = [];
		restrictTo.forEach((termId) => {
			const topLevel = getTopLevel(termId);
			const topLevelIndex = treeData.findIndex(
				(t) => t.id === topLevel.id
			);
			restrictedTreeData.push(treeData[topLevelIndex]);
		});
		r = restrictedTreeData;
	}

	return r;
}

async function getPostByUrl(url) {
	try {
		const resp = await apiFetch({
			path: addQueryArgs('/prc-api/v3/utils/postid-by-url', {
				url,
			}),
			method: 'GET',
		});
		const type = 'post' === resp?.postType ? 'posts' : resp?.postType;
		const postSearchPath = addQueryArgs(`/wp/v2/${type}/${resp?.postId}`, {
			context: 'view',
		});
		console.log('postSearchPath', postSearchPath);
		const post = await apiFetch({
			path: postSearchPath,
			method: 'GET',
		});
		console.log('GOT THE POST', post);
		return post;
	} catch (err) {
		throw err;
	}
}

function hexToRgb(hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.toString().replace(shorthandRegex, (m, r, g, b) => {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) {
		return 'black';
	}

	const rgb = [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
	];
	return rgb;
}

function getContrastingColorFromHex(
	color,
	outputLight = '#ffffff',
	outputDark = '#2a2a2a'
) {
	const rgb = hexToRgb(color);
	// set determine color contrast per W3 guidelines: https://www.w3.org/TR/AERT/#color-contrast
	// Color brightness = ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
	// The range for color brightness difference is 125.
	const brightness = Math.round(
		(rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	);
	const fill = brightness > 125 ? outputDark : outputLight;
	return fill;
}

export {
	getTerms,
	getTermsByLetter,
	getTermsAsOptions,
	getTermsAsTree,
	ifMatchSetAttribute,
	randomId,
	tableToArray,
	arrayToCSV,
	wpRestApiTermsToTree,
	getPostByUrl,
	getContrastingColorFromHex,
};
