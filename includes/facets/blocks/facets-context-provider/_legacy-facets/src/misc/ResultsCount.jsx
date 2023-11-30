/* eslint-disable camelcase */
/**
 * External Dependencies
 */
import styled from 'styled-components';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';

function ResultsCount() {
	const { data } = useFacets();
	const { pager } = data;
	const { page, per_page, total_rows } = pager;
	// define x where x is the lower bound of the current range
	const x = (page - 1) * per_page + 1;
	// define y where y is the upper bound of the current range
	const y = page * per_page < total_rows ? page * per_page : total_rows;

	const Results = styled.div`
		font-family: var(--wp--preset--font-family--sans-serif);
		font-size: var(--wp--preset--font-size--small-label);
		line-height: 1;
		font-weight: 400;
		font-size: 14px;
		color: #767676;
	`;

	return (
		<Results>
			<span>{`Displaying ${x} - ${y} of ${total_rows} results`}</span>
		</Results>
	);
}

export default ResultsCount;
