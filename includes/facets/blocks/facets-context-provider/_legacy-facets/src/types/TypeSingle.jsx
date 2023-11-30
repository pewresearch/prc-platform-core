/**
 * External Dependencies
 */
import { List } from 'semantic-ui-react';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import { FacetLabel } from '../labels';
import { MoreButton } from '../buttons';
import Item from './Item';

function TypeSingle({
	facetName,
	disableLabel = false,
	visibleThreshold = 5,
	disabled = false,
}) {
	const { data, selections, updateSelections, isMobile, isTaxonomy } =
		useFacets();

	if (isTaxonomy === facetName) {
		return null;
	}

	const thisFacet = data.facets[facetName];
	if (undefined === thisFacet) {
		return null;
	}
	const { choices, selected, label } = thisFacet;

	const hasActiveSelections = Object.prototype.hasOwnProperty.call(
		selections,
		facetName,
	);

	const [visibleChoices, setVisibleChoices] = useState([]);
	const [hiddenChoices, setHiddenChoices] = useState([]);
	const [isOpen, toggleIsOpen] = useState(false);
	const [mobileIsOpen, toggleMobileIsOpen] = useState(false);

	/**
	 * Move choices into visible or hidden arrays based on the visible threshold.
	 */
	useEffect(() => {
		const visible = [];
		const hidden = [];
		choices.forEach((choice, index) => {
			if (index + 1 <= visibleThreshold) {
				visible.push(choice);
			} else {
				hidden.push(choice);
			}
		});
		setVisibleChoices(visible);
		setHiddenChoices(hidden);

		hidden
			.map((item) => item.value)
			.forEach((item) => {
				if (selected.includes(item)) {
					toggleIsOpen(true);
				}
			});
	}, [choices, selected, visibleThreshold]);

	/**
	 * Handle "radio" like selection logic.
	 * @param {*} choice
	 */
	const onChange = (choice) => {
		const tmp = { ...selections };
		// if tmp[facetName] contains choice.value, remove it
		if (hasActiveSelections && tmp[facetName].includes(choice.value)) {
			tmp[facetName] = tmp[facetName].filter((val) => val !== choice.value);
		} else {
			tmp[facetName] = [choice.value];
		}
		updateSelections({ ...tmp });
	};

	if (0 === visibleChoices.length) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <Fragment />;
	}

	return (
		<div>
			{true !== disableLabel && (
				<FacetLabel
					facetName={facetName}
					label={label}
					onClear={() => {
						toggleIsOpen(false);
					}}
					mobileOnClick={() => {
						toggleMobileIsOpen(!mobileIsOpen);
					}}
					isOpen={mobileIsOpen}
				/>
			)}
			{(disableLabel || mobileIsOpen || !isMobile) && (
				<List link relaxed>
					{visibleChoices.map((choice) => (
						<Item
							label={choice.label}
							value={choice.value}
							count={choice.count}
							active={
								hasActiveSelections
									? selections[facetName].includes(choice.value)
									: false
							}
							onChange={() => onChange(choice)}
							disabled={disabled}
						/>
					))}
					{0 < hiddenChoices.length && (
						<List.Item>
							<MoreButton isOpen={isOpen} onClick={toggleIsOpen} />
						</List.Item>
					)}
					{isOpen &&
						0 < hiddenChoices.length &&
						hiddenChoices.map((choice) => (
							<Item
								label={choice.label}
								value={choice.value}
								count={choice.count}
								active={
									hasActiveSelections
										? selections[facetName].includes(choice.value)
										: false
								}
								onChange={() => onChange(choice)}
								disabled={disabled}
							/>
						))}
				</List>
			)}
		</div>
	);
}

export default TypeSingle;
