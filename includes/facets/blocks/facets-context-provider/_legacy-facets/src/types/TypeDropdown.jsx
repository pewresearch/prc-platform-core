/**
 * External Dependencies
 */
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';

function TypeDropdown({ facetName, inline = false, disabled = false }) {
	const {
		data,
		selections,
		clearFacetSelection,
		updateSelections,
		isTaxonomy,
	} = useFacets();

	if (isTaxonomy === facetName) {
		return null;
	}

	const thisFacet = data.facets[facetName];
	if (undefined === thisFacet) {
		return null;
	}
	const { choices, label, type } = thisFacet;
	const [options, setOptions] = useState(false);
	const [loading, toggleLoading] = useState(true);

	/**
	 * Transforms the choices data into a dropdown options array.
	 */
	useEffect(() => {
		const tmp = [];
		choices.forEach((choice, index) => {
			const text =
				'yearly' === type ? choice.value : decodeEntities(choice.label);
			tmp.push({
				key: `dropdown-${index}`,
				text: `${text} (${choice.count})`,
				value: choice.value,
			});
		});
		setOptions([...tmp]);
		toggleLoading(false);
	}, [data]);

	const onChange = ({ _reactName, code }, { value }) => {
		if ('' === value) {
			clearFacetSelection(facetName);
			return;
		}

		if (
			('onKeyDown' === _reactName && 'Enter' === code) ||
			'onClick' === _reactName
		) {
			const tmp = { ...selections };
			tmp[facetName] = [value];
			updateSelections({ ...tmp });
		}
	};

	const Container = styled.div`
		${!inline && 'margin-bottom: 1em;'}
	`;

	return (
		<Container>
			<Dropdown
				placeholder={__(label, 'prc-facets')}
				fluid
				search
				selection
				clearable
				options={options}
				loading={loading}
				onChange={onChange}
				value={selections[facetName] ? selections[facetName][0] : null}
				disabled={disabled}
			/>
		</Container>
	);
}

export default TypeDropdown;
