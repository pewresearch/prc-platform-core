/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Fetches taxonomy terms whose name starts with a given letter.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @param {string} letter   Single letter (e.g. "a").
 * @return {Promise<Array>} Terms from API.
 */
function getTermsByLetter(taxonomy, letter) {
	return new Promise((resolve) => {
		apiFetch({
			path: `/prc-api/v2/blocks/helpers/get-taxonomy-by-letter/?taxonomy=${taxonomy}&letter=${letter}`,
		}).then((terms) => {
			resolve(terms);
		});
	});
}

/**
 * Fetches taxonomy terms and returns an object keyed by term id.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @param {number} perPage  Number of terms to fetch.
 * @return {Promise<Object>} Object of { id: { id, name, parent, slug } }.
 */
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

/**
 * Fetches terms and returns options for select controls.
 *
 * @param {string}  taxonomy    Taxonomy slug.
 * @param {number}  perPage     Number of terms.
 * @param {string}  termValue   Value field: 'slug' or 'id'.
 * @param {boolean} sortByLabel Whether to sort options by label.
 * @return {Promise<Array<{value, label}>>} Options array.
 */
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

/**
 * Fetches terms and returns a parent/children tree structure.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @return {Promise<Array>} Tree of { name, id, children: [{ name, id }] }.
 */
function getTermsAsTree(taxonomy) {
	return new Promise((resolve) => {
		getTerms(taxonomy).then((data) => {
			const treeData = [];
			const convertedData = Object.keys(data).map((i) => data[i]);
			const parentTerms = convertedData.filter((e) => 0 === e.parent);
			parentTerms.forEach((e) => {
				const c = convertedData.filter((f) => f.parent === e.id);
				const children = c.map((cT) => ({
					name: cT.name,
					id: cT.id,
				}));
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

/**
 * Converts WP REST API terms (object or array) to a tree with optional restriction.
 *
 * @param {Object|Array} terms      Terms keyed by id or array of terms.
 * @param {number[]}     restrictTo Optional list of term IDs to include (with ancestors).
 * @return {Array} Tree of { name, id, meta, children }.
 */
function wpRestApiTermsToTree(terms, restrictTo = []) {
	const treeData = [];
	if (!terms) {
		return treeData;
	}

	const convertedData = Array.isArray(terms)
		? terms
		: Object.keys(terms).map((i) => terms[i]);

	const getTopLevel = (termId) => {
		const term = convertedData.find((t) => t.id === termId);
		if (!term) return null;
		if (0 === term.parent) {
			return term;
		}
		return getTopLevel(term.parent);
	};
	const parentTerms = convertedData.filter((e) => 0 === e.parent);

	parentTerms.forEach((e) => {
		const c = convertedData.filter((f) => f.parent === e.id);
		const children = c.map((cT) => ({
			name: cT.name,
			id: cT.id,
			meta: cT.meta,
		}));
		children.sort((a, b) => (a.name > b.name ? 1 : -1));
		treeData.push({
			name: e.name,
			id: e.id,
			meta: e.meta,
			children,
		});
	});

	if (0 < restrictTo.length) {
		const restrictedTreeData = [];
		restrictTo.forEach((termId) => {
			const topLevel = getTopLevel(termId);
			if (topLevel) {
				const topLevelIndex = treeData.findIndex(
					(t) => t.id === topLevel.id
				);
				if (topLevelIndex > -1) {
					restrictedTreeData.push(treeData[topLevelIndex]);
				}
			}
		});
		return restrictedTreeData;
	}

	return treeData;
}

export {
	getTerms,
	getTermsByLetter,
	getTermsAsOptions,
	getTermsAsTree,
	wpRestApiTermsToTree,
};
