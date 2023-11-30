/**
 * External Dependencies
 */
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Interanl Dependencies
 */
import { useFacets } from '../context';

function TypeRange({ facetName, dataSource = 'yr', disabled = false }) {
	const { data, selections, updateSelections } = useFacets();
	const [rawData, setRawData] = useState(false);
	const [loading, toggleLoading] = useState(true);
	const [minOptions, setMinOptions] = useState([]);
	const [maxOptions, setMaxOptions] = useState([]);

	const min = useMemo(() => {
		if (Array.isArray(selections[facetName])) {
			return selections[facetName][0];
		}
		return null;
	}, [selections, facetName]);

	const max = useMemo(() => {
		if (Array.isArray(selections[facetName])) {
			return selections[facetName][1];
		}
		return null;
	}, [selections, facetName]);

	/**
	 * Initializes the source data to be used for two dropdowns (min and max).
	 */
	useEffect(() => {
		if (window.prcFacets.debug.enabled) {
			console.log('<TypeRange> -> useEffect()', data);
		}

		const tmp = [];
		data.facets[dataSource].choices.forEach((choice, index) => {
			const text =
				'yearly' === data.facets[dataSource].type
					? choice.value
					: decodeEntities(choice.label);
			const value =
				'yearly' === data.facets[dataSource].type
					? `${choice.value}-01-01`
					: choice.value;
			tmp.push({
				key: `range-${index}`,
				text,
				value,
			});
		});

		setRawData([...tmp]);
		toggleLoading(false);
	}, [data, dataSource]);

	useEffect(() => {
		if (false !== rawData) {
			let mn = rawData;
			let mx = rawData;

			// Sort tmp by value lowest to highest.
			mn.sort((a, b) => a.value - b.value);
			if (null !== min) {
				// restrict max options to be greater than the min
				mx = mx.filter((option) => option.value >= min);
			}

			// Sort tmp by value highest to lowest
			mx.sort((a, b) => b.value - a.value);
			if (null !== max) {
				// restrict min options to be less than the max
				mn = mn.filter((option) => option.value <= max);
			}

			setMaxOptions([...mx]);
			setMinOptions([...mn]);
		}
	}, [rawData]);

	const Range = styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		> div {
			flex-grow: 1;
		}
		> div:first-child {
			margin-right: 0.25em;
		}
		> div:last-child {
			margin-left: 0.25em;
		}
	`;

	return (
		<Range>
			<Dropdown
				placeholder={__('Start', 'prc-facets')}
				fluid
				search
				selection
				clearable
				options={minOptions}
				loading={loading}
				onChange={(e, { value }) => {
					updateSelections((prevState) => ({
						...prevState,
						...{
							[facetName]: [value, max],
						},
					}));
				}}
				value={min}
				disabled={disabled}
			/>
			<Dropdown
				placeholder={__('End', 'prc-facets')}
				fluid
				search
				selection
				clearable
				options={maxOptions}
				loading={loading}
				onChange={(e, { value }) => {
					updateSelections((prevState) => ({
						...prevState,
						...{
							[facetName]: [min, value],
						},
					}));
				}}
				value={max}
				disabled={disabled}
			/>
		</Range>
	);
}

export default TypeRange;
