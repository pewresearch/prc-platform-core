/**
 * External Dependencies
 */
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import { TypeDropdown } from '../types';
import { ExpandButton } from '../buttons';

const ADVANCED_FACETS = ['bylines', 'research_teams'];

/**
 * A group of "advanced" facets, like Bylines and Research Teams.
 * @returns {JSX.Element}
 */
function GroupAdvanced() {
	const { data } = useFacets();
	// If there are no ADVANCED_FACETS in the facets data then return null.
	if (!ADVANCED_FACETS.some((faceName) => data.facets[faceName])) {
		return null;
	}
	const [isOpen, setIsOpen] = useState(false);

	const Advanced = styled.div`
		margin-top: 1em;
	`;

	return (
		<Fragment>
			<Divider />
			<ExpandButton
				isOpen={isOpen}
				onClick={() => setIsOpen(!isOpen)}
				label="Advanced"
			>
				<Advanced>
					{ADVANCED_FACETS.map((facetName) => (
						<TypeDropdown facetName={facetName} />
					))}
				</Advanced>
			</ExpandButton>
		</Fragment>
	);
}

export default GroupAdvanced;
