/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useEntityRecords } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { POST_TYPE_REST_BASE, TAXONOMY } from '../constants';

/**
 * Retrieves all available block modules. Optionally excludes a single block module by id.
 *
 * @param {string} excludedId Block Module ID to exclude.
 *
 * @return {{ blockModules: Array, isResolving: boolean, hasResolved: boolean }} array of block modules.
 */
export default function useBlockModules( {
	blockAreaId = null,
	categoryId = null,
	ref = null,
	excludeId = null,
	enabled = false,
	args = {},
} ) {
	const queryArgs = {
		context: 'view',
		orderby: 'date',
		order: 'desc',
		per_page: 25,
	};
	if (null !== blockAreaId) {
		queryArgs[TAXONOMY] = [blockAreaId];
	}
	if (null !== categoryId) {
		queryArgs['categories'] = [categoryId];
	}
	if (blockAreaId && categoryId) {
		queryArgs['tax_relation'] = 'AND';
	}
	if (null !== ref) {
		queryArgs['include'] = [ref];
	}

	console.log('postStatus', queryArgs);

	const {hasResolved, isResolving, records, status} = useEntityRecords(
		'postType',
		POST_TYPE_REST_BASE,
		{ ...queryArgs, ...args },
		{ enabled }
	);

	// Filter out any block modules that have the same id as the excluded block module.
	const filteredBlockModules = useMemo( () => {
		if ( ! records ) {
			return [];
		}
		return (
			records.filter(
				( blockModule ) => blockModule.id !== excludeId
			) || []
		);
	}, [ records, excludeId ] );

	return {
		blockModules: filteredBlockModules,
		isResolving,
		hasResolved,
	};
}
