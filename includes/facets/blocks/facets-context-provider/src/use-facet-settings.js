/**
 * WordPress Dependencies
 */
import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export default function useFacetSettings(templateSlug) {
	const [settings, setSettings] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const reduceSettings = (newSettings) => {
		const newFacets = {};
		Object.keys(newSettings).forEach((taxonomy) => {
			const { name, label, facet_type } = newSettings[taxonomy];
			const type = facet_type;
			newFacets[name] = {
				name,
				label,
				type,
			};
		});
		return newFacets;
	};

	useEffect(() => {
		apiFetch({
			path: addQueryArgs('/prc-api/v3/facets/get-settings', {
				templateSlug,
			}),
		})
			.then((newSettings) => {
				console.log('/prc-api/v3/facets/get-settings', {
					newSettings,
					templateSlug,
				});
				const newFacets = reduceSettings(newSettings);
				setSettings(newFacets);
				setIsLoading(false);
			})
			.catch((error) => {
				setSettings(null);
				setIsLoading(false);
			});
	}, []);

	return useMemo(() => {
		return {
			settings,
			isLoading,
		};
	}, [settings, isLoading]);
}
