/**
 * External Dependencies
 */
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { removeQueryArgs, getQueryArg, addQueryArgs } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import { ClearAllButton } from '../buttons';

function QueriedFacets() {
	const { firstLoadSelections, isMobile } = useFacets();

	const formatLabel = (l) =>
		l
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	const onClear = (facetName, item) => {
		const { location } = window;
		const { origin, pathname, href } = location;
		// if pathname contains /page/x then remove it
		const path = pathname.replace(/\/page\/\d+/, '');

		const facetArgKey = `_${facetName}`;
		const currentQueryArg = getQueryArg(href, facetArgKey);
		// split currentQueryArg into an array on comma
		const currentQueryArgArray = currentQueryArg.split(',');
		// remove the item from the array
		const newQueryArgArray = currentQueryArgArray.filter((i) => i !== item);
		let newQueryArg = '';
		// if the array is not empty, join it with a comma
		if (0 < newQueryArgArray.length) {
			newQueryArg = newQueryArgArray.join(',');
		}
		// remove the facet arg from the url
		let newUrl = removeQueryArgs(href, [facetArgKey]);
		// if the newQueryArg is not empty, add it to the url
		if ('' !== newQueryArg && 'ALL' !== item) {
			newUrl = addQueryArgs(`${origin}${path}`, { [facetArgKey]: newQueryArg });
		}

		// redirect to the new url
		window.location.href = newUrl;
	};

	const FilteringBy = styled.div`
		margin-right: 0.5em;
		min-width: fit-content;
	`;

	const ActiveFacets = styled.div`
		font-family: var(--wp--preset--font-family--sans-serif);
		font-size: var(--wp--preset--font-size--small-label);
		font-weight: 400;
		display: flex;
		flex-direction: row;
		margin-top: 1em;
		> div:first-of-type {
			display: flex;
			flex-direction: row;
			flex-grow: 1;
			${!isMobile && 'flex-wrap: wrap;'}
			${isMobile && 'overflow-x: scroll;'}
		}
	`;

	const ActiveFacet = styled.button`
		display: flex;
		align-items: center;
		border: none;
		cursor: pointer;
		background-color: #e8e8e8;
		border-radius: 0.2857142857rem;
		color: rgba(0, 0, 0, 0.6);
		font-weight: 700;
		font-size: 0.9em;
		line-height: 1;
		padding: 0.5833em 0.833em;
		text-transform: none;
		transition: background 0.1s ease;
		margin-right: 0.3em;
		margin-bottom: 0.3em;
		min-width: fit-content;
		&:last-child {
			margin-right: 0;
		}
	`;

	const StyledIcon = styled(Icon)`
		margin-left: 0.5em !important;
		margin-right: 0 !important;
	`;

	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<Fragment>
			{0 < Object.keys(firstLoadSelections).length && (
				<ActiveFacets
					role="listbox"
					aria-roledescription="Clicking on any of these items will result in a immediate refresh of the page with your selected option removed."
				>
					<div>
						<FilteringBy>{__(`Filtering by: `, 'prc-facets')}</FilteringBy>
						{Object.keys(firstLoadSelections).map((facetName) => {
							if ('date_range' === facetName) {
								const dateRange = firstLoadSelections[facetName];
								// get first item and second item as a string
								const minDate = dateRange[0].toString().substring(0, 4);
								const maxDate = dateRange[1].toString().substring(0, 4);

								return (
									<ActiveFacet
										key="date-range"
										role="listitem"
										onClick={() => onClear(facetName, 'ALL')}
									>
										{`${minDate} to ${maxDate}`}{' '}
										<StyledIcon name="circle remove" />
									</ActiveFacet>
								);
							}

							return firstLoadSelections[facetName].map((item) => {
								const itemLabel = formatLabel(item);
								return (
									<ActiveFacet
										key={item}
										role="listitem"
										onClick={() => onClear(facetName, item)}
									>
										{itemLabel} <StyledIcon name="circle remove" />
									</ActiveFacet>
								);
							});
						})}
					</div>
					{0 !== Object.keys(firstLoadSelections).length && (
						<ClearAllButton label="Reset" />
					)}
				</ActiveFacets>
			)}
		</Fragment>
	);
}

export default QueriedFacets;
