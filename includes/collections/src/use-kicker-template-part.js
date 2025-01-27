/**
 * WordPress Dependencies
 */
import { useEntityRecords } from '@wordpress/core-data';
import { useMemo } from 'react';

export default function useKickerTemplatePart({
	kickerSlug,
	setKickerSlug = () => {},
}) {
	// Fetch all template parts.
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{
			per_page: -1,
		}
	);

	// Filter the template parts for those in the 'kicker' area.
	const kickerOptions = useMemo(() => {
		if (!records || !records.length) {
			return [];
		}
		const selectedKicker = records.find((item) => item.slug === kickerSlug);
		if (selectedKicker) {
			return [
				{
					label: selectedKicker.title.rendered,
					value: selectedKicker.slug,
				},
			];
		}
		return records
			.filter(
				(item) =>
					item.area === 'kicker' ||
					item.title.rendered.includes('kicker')
			)
			.map((item) => ({
				label: item.title.rendered,
				value: item.slug,
			}));
	}, [kickerSlug, records]);

	const hasKickers = useMemo(() => kickerOptions.length > 0, [kickerOptions]);
	const selectedKickerAndExists = useMemo(
		() =>
			kickerSlug &&
			kickerOptions?.length &&
			kickerOptions.some((item) => item.value === kickerSlug),
		[kickerSlug, kickerOptions]
	);
	const kickerId = useMemo(() => {
		if (!kickerSlug || !hasResolved || !records || !records.length) {
			return;
		}
		const r =
			hasResolved &&
			records &&
			records.find((item) => item.slug === kickerSlug);
		if (r.theme && r.slug) {
			return `${r.theme}//${r.slug}`;
		}
	}, [kickerSlug, hasResolved, records]);

	console.log(
		'useKickerTemplatePart',
		kickerOptions,
		hasKickers,
		selectedKickerAndExists,
		records,
		kickerId
	);

	return {
		kickerOptions,
		hasKickers,
		selectedKickerAndExists,
		kickerId,
		setKickerSlug,
	};
}
