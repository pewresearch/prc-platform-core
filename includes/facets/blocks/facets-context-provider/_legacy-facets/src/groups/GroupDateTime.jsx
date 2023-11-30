/**
 * External Dependencies
 */
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import { FacetLabel } from '../labels';
import { TypeSingle, TypeDropdown, TypeRange } from '../types';

function YearsComboFacet({ disabled = false }) {
	const [displayRange, toggleDisplayRange] = useState(false);
	const [didLoad, toggleDidLoad] = useState(false);
	const { selections } = useFacets();
	const min =
		Array.isArray(selections.date_range) && selections.date_range[0]
			? selections.date_range[0]
			: null;
	const max =
		Array.isArray(selections.date_range) && selections.date_range[1]
			? selections.date_range[1]
			: null;

	const YearsCombo = styled.div`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 1em;

		> div:first-child {
			flex-grow: 1;
		}
	`;

	const ComboToggle = styled.button`
		background: none;
		border: none;
		cursor: pointer;
		color: var(--wp--preset--color--link-color);
		line-height: 1.1428571429em;
		transition: color 0.1s ease;
		font-family: var(--wp--preset--font-family--sans-serif);
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding-left: 0.5em;
	`;

	useEffect(() => {
		if (false === didLoad) {
			if (false === displayRange && null !== min && null !== max) {
				toggleDisplayRange(true);
				toggleDidLoad(true);
			}
		}
	}, [didLoad, selections]);

	return (
		<YearsCombo>
			{!displayRange && (
				<Fragment>
					<TypeDropdown facetName="yr" inline disabled={disabled} />
					<ComboToggle type="button" onClick={() => toggleDisplayRange(true)}>
						{__('Range of Years', 'prc-facets')}
					</ComboToggle>
				</Fragment>
			)}
			{displayRange && (
				<Fragment>
					<TypeRange
						facetName="date_range"
						dataSource="yr"
						disabled={disabled}
						defaultMin={min}
						defaultMax={max}
					/>
					<ComboToggle type="button" onClick={() => toggleDisplayRange(false)}>
						{__('Single Year', 'prc-facets')}
					</ComboToggle>
				</Fragment>
			)}
		</YearsCombo>
	);
}

/**
 * A group of date time facets.
 * @returns {JSX.Element}
 */
function GroupDateTime() {
	const { selections, isMobile } = useFacets();
	const [disableCombo, toggleDisableCombo] = useState(false);
	const [disableTimeSince, toggleDisableTimeSince] = useState(false);
	const [isOpen, toggleOpen] = useState(false);

	/**
	 * If selections has `time_since` then disable the years-range combo box.
	 */
	useEffect(() => {
		// Disable the years-range combo box if time_since is selected.
		toggleDisableCombo(
			Object.prototype.hasOwnProperty.call(selections, 'time_since'),
		);
		// Disable the time since facet if yr or date_range is selected.
		toggleDisableTimeSince(
			Object.prototype.hasOwnProperty.call(selections, 'date_range') ||
				Object.prototype.hasOwnProperty.call(selections, 'yr'),
		);
	}, [selections]);

	return (
		<Fragment>
			<FacetLabel
				facetName={['yr', 'date_range', 'time_since']}
				label="Date"
				mobileOnClick={() => {
					toggleOpen(!isOpen);
				}}
				isOpen={isOpen}
				disableDividerOnMobile
			/>
			{(isOpen || !isMobile) && (
				<Fragment>
					<TypeSingle
						facetName="time_since"
						disableLabel
						disabled={disableTimeSince}
					/>
					<YearsComboFacet disabled={disableCombo} />
				</Fragment>
			)}
		</Fragment>
	);
}

export default GroupDateTime;
