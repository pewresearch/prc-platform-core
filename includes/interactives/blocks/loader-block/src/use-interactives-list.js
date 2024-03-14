/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function useInteractivesList(researchArea, year) {
	const [interactives, setInteractives] = useState([]);

	useEffect(() => {
		apiFetch({ path: '/prc-api/v3/interactive/get-assets' }).then(
			(data) => {
				setInteractives(data);
			}
		);
	}, []);

	return {
		interactives,
	};
}
