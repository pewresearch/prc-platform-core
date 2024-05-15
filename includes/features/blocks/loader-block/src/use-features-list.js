/**
 * WordPress Dependencies
 */
import { useEffect, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function useFeaturesList() {
	const [features, setFeatures] = useState([]);

	useEffect(() => {
		apiFetch({ path: '/prc-api/v3/feature/get-assets' }).then((data) => {
			console.log('features->get_assets->', { data });
			setFeatures(data);
		});
	}, []);

	return {
		features,
	};
}
