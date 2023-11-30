/**
 * WordPress Dependencies
 */
import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function useFacetWPSettings() {
	const [ settings, setSettings ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	const reduceSettings = newSettings => {
		const { facets } = newSettings;
		const newFacets = {};
		Object.keys(facets).forEach( facetKey => {
			const name = facets[facetKey].name;
			newFacets[name] = {
				name,
				label: facets[facetKey].label,
				source: facets[facetKey].source,
				type: facets[facetKey].type,
				// These are all optional below:
				show_expanded: facets[facetKey]?.show_expanded,
				limit: facets[facetKey]?.count, // I dont like the "count" property in FacetWP to describe what is meant to be a "hard limit" as opposed to the soft limit, I'll refer to this as just "limit".
				soft_limit: facets[facetKey]?.soft_limit,
				label_any: facets[facetKey]?.label_any,
				format: facets[facetKey]?.format,
				hierarchical: facets[facetKey]?.hierarchical,
			}
		});
		return newFacets;
	}

	useEffect( () => {
		apiFetch( { path: '/prc-api/v3/facets/get-settings' } )
			.then( ( settings ) => {
				const newFacets = reduceSettings(settings);
				setSettings( newFacets );
				setIsLoading( false );
			} )
			.catch( ( error ) => {
				setSettings( null );
				setIsLoading( false );
			} );
	}, [] );

	return useMemo( () => {
		return {
			settings,
			isLoading,
		};
	}, [ settings, isLoading ] );
}
