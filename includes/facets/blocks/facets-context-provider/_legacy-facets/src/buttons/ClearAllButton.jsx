/**
 * External Dependencies
 */
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';

function ClearAllButton({ label = 'Clear All', updateContextOnClick = false }) {
	const { clearFacetSelection } = useFacets();

	const onResetAll = () => {
		if (true === updateContextOnClick) {
			clearFacetSelection('ALL');
		} else {
			const { location } = window;
			const { origin, pathname } = location;
			// if pathname contains /page/x then remove it
			const path = pathname.replace(/\/page\/\d+/, '');

			window.location.href = `${origin}${path}`;
		}
	};

	const ClearAllFacets = styled.button`
		background: none !important;
		min-width: fit-content;
		display: flex;
		align-items: center;
		border: none;
		cursor: pointer;
		color: var(--wp--preset--color--link-color);
		font-weight: 700;
		font-size: 11px;
		line-height: 1;
		text-transform: none;
		margin: 0;
	`;

	const StyledIcon = styled(Icon)`
		margin-right: 0 !important;
		margin-left: 0.5em !important;
	`;

	return (
		<ClearAllFacets role="listitem" onClick={() => onResetAll()}>
			{`${label} `}
			<StyledIcon name="circle remove" />
		</ClearAllFacets>
	);
}

export default ClearAllButton;
