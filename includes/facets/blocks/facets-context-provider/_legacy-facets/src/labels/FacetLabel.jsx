/**
 * External Dependencies
 */
import { Divider, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import { Label, LabelButton } from './primitives';

function FacetLabel({
	facetName,
	label,
	onClear = false,
	mobileOnClick = false,
	isOpen = false,
	disableDividerOnMobile = false,
}) {
	const { selections, clearFacetSelection, isMobile } = useFacets();
	const hasActiveSelections = Object.prototype.hasOwnProperty.call(
		selections,
		facetName,
	);
	// Or if facetName is an array of facet names (like the DateTime facet group), check if any of them are active.
	const hasActiveSelectionsInArray =
		Array.isArray(facetName) &&
		facetName.some((f) => Object.prototype.hasOwnProperty.call(selections, f));

	const ClearButton = styled.button`
		background: none;
		border: none;
		cursor: pointer;
		color: black;
		float: right;
	`;

	return (
		<Fragment>
			{(!disableDividerOnMobile || !isMobile) && <Divider />}
			<Label>
				{isMobile && (
					<LabelButton onClick={mobileOnClick}>
						{`${label} `}
						<i
							aria-hidden="true"
							className={classnames('outline circle icon', {
								plus: !isOpen,
								minus: isOpen,
							})}
						/>
					</LabelButton>
				)}
				{!isMobile && `${label} `}
				{(hasActiveSelections || hasActiveSelectionsInArray) && (
					<ClearButton
						type="button"
						onClick={() => {
							clearFacetSelection(facetName);
							if (false !== onClear) {
								onClear();
							}
						}}
					>
						<Icon name="circle remove" />
					</ClearButton>
				)}
			</Label>
		</Fragment>
	);
}

export default FacetLabel;
