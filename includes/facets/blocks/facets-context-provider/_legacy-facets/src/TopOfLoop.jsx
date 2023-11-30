/**
 * External Dependencies
 */
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */

import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from './context';
import { QueriedFacets, ResultsCount, SearchResultsSort } from './misc';

function TopOfLoop() {
	const { isSearch } = useFacets();

	const SearchResultsCountAndSort = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
	`;

	const SearchResultsCount = styled.div`
		flex-grow: 1;
	`;

	return (
		<Fragment>
			{!isSearch && <ResultsCount />}
			{isSearch && (
				<SearchResultsCountAndSort>
					<SearchResultsCount>
						<ResultsCount />
					</SearchResultsCount>
					<SearchResultsSort />
				</SearchResultsCountAndSort>
			)}
			<QueriedFacets />
			<Divider />
		</Fragment>
	);
}

export default TopOfLoop;
