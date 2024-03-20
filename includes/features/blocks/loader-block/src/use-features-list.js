/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function useFeaturesList(researchArea, year) {
	const [features, setFeatures] = useState([]);

	useEffect(() => {
		apiFetch({ path: '/prc-api/v3/feature/get-assets' }).then((data) => {
			console.log({ data });
			setFeatures(data);
		});
	}, []);

	return {
		features,
	};
}
