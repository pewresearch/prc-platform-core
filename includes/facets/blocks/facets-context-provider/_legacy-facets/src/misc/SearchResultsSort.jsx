/**
 * External Dependencies
 */
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';

function SearchResultsSort() {
	const { getCurrentUrl } = useFacets();
	const [processing, toggleProcessing] = useState(false);

	const currentSortValue = getQueryArg(window.location.href, '_ep_sort_by');
	const v = undefined !== currentSortValue ? currentSortValue : 'relevance';

	const options = [
		{
			key: `search-sort-relevancy`,
			text: 'Relevancy',
			value: 'relevance',
		},
		{
			key: `search-sort-date`,
			text: 'Most recent',
			value: 'date',
		},
	];

	const SortField = styled.div`
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 13px;
	`;

	const SortLabel = styled.div`
		margin-right: 0.25em;
		font-family: var(--wp--preset--font-family--sans-serif);
	`;

	const SortDropdown = styled(Dropdown)`
		min-width: 130px !important;
	`;

	const label = __('Sort by:', 'prc-facets');

	return (
		<SortField>
			<SortLabel>{label}</SortLabel>
			<SortDropdown
				placeholder={label}
				selection
				options={options}
				loading={processing}
				onChange={(e, { value }) => {
					toggleProcessing(true);
					setTimeout(() => {
						if ('date' === value) {
							window.location.href = addQueryArgs(getCurrentUrl(), {
								_ep_sort_by: value,
							});
						} else {
							window.location.href = getCurrentUrl();
						}
					}, 500);
				}}
				value={v}
			/>
		</SortField>
	);
}

export default SearchResultsSort;
