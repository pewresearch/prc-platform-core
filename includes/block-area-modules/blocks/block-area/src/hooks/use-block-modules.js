/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { useEntityRecords } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { POST_TYPE_REST_BASE, TAXONOMY } from '../constants';

/**
 * Retrieves all available block modules. Optionally excludes a single block module by id.
 * @param {Object}  options                Options object.
 * @param {number}  options.blockAreaId    The block area id.
 * @param {number}  options.taxonomyTermId The term id.
 * @param {string}  options.taxonomy       The taxonomy name.
 * @param {number}  options.ref            The block module id to include.
 * @param {number}  options.excludeId      The block module id to exclude.
 * @param {boolean} options.enabled        Whether the hook is enabled.
 * @param {Object}  options.args           Additional query arguments.
 * @param           options.categoryId
 * @param           options.taxonomyName
 * @return {Object} The block modules and related data.
 */
export default function useBlockModules({
	blockAreaId = null,
	taxonomyTermId = null,
	taxonomyName = null,
	ref = null,
	excludeId = null,
	enabled = false,
	args = {},
}) {
	const queryArgs = {
		context: 'view',
		orderby: 'date',
		order: 'desc',
		per_page: 25,
	};
	if (null !== blockAreaId) {
		queryArgs[TAXONOMY] = [blockAreaId];
	}
	if (null !== taxonomyTermId) {
		let taxName = taxonomyName;
		if (taxonomyName === 'category') {
			taxName = 'categories';
		}
		queryArgs[taxName] = [taxonomyTermId];
	}
	if (blockAreaId && taxonomyTermId) {
		queryArgs.tax_relation = 'AND';
	}
	if (null !== ref) {
		queryArgs.include = [ref];
	}

	console.log('postStatus', queryArgs, {taxonomyName, taxonomyTermId, blockAreaId});

	const { hasResolved, isResolving, records, status } = useEntityRecords(
		'postType',
		POST_TYPE_REST_BASE,
		{ ...queryArgs, ...args },
		{ enabled }
	);

	// Filter out any block modules that have the same id as the excluded block module.
	const filteredBlockModules = useMemo(() => {
		if (!records) {
			return [];
		}
		return (
			records.filter((blockModule) => blockModule.id !== excludeId) || []
		);
	}, [records, excludeId]);

	return {
		blockModules: filteredBlockModules,
		isResolving,
		hasResolved,
	};
}
