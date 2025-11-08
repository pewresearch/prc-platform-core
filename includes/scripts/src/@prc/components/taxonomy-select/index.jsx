/**
 * External Dependencies
 */
import { MultiSelectControl } from '@codeamp/block-components';
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useMemo } from '@wordpress/element';

const MultiSelectWrapper = styled('div')`
	& .components-button.has-icon {
		padding: 0px !important;
	}
`;

export default function TaxonomySelect({
	className,
	value,
	onChange,
	allowMultiple = false,
	restrictToTaxonomies = [
		'category',
		'formats',
		'regions-countries',
		'research-teams',
		'collection',
	],
}) {
	const [currentValue, setCurrentValue] = useState(value);

	const { records } = useSelect((select) => {
		const { getEntitiesConfig } = select('core');
		const taxonomies = getEntitiesConfig('taxonomy');
		// filter out any duplicate objects in thiis array, use the name property to compare
		const filteredTaxonomies = taxonomies.filter(
			(taxonomy, index, self) =>
				index === self.findIndex((t) => t.name === taxonomy.name)
		);
		return {
			records: filteredTaxonomies,
		};
	}, []);

	const [tokens, setTokens] = useState([]);

	useEffect(() => {
		if (0 < records.length && 0 === tokens.length) {
			const newTokens = records.map((taxonomy) => ({
				label: taxonomy.label,
				value: taxonomy.name,
				baseUrl: taxonomy.baseURL,
			}));
			if (0 < restrictToTaxonomies.length) {
				const filteredTokens = newTokens.filter((token) =>
					restrictToTaxonomies.includes(token.value)
				);
				setTokens(filteredTokens);
			} else {
				setTokens(newTokens);
			}
		}
	}, [records]);

	useEffect(() => {
		if (currentValue) {
			onChange(currentValue);
		}
	}, [currentValue]);

	const hasTokens = useMemo(() => {
		return tokens ? 0 <= tokens.length : false;
	}, [tokens]);

	const label = __('Select a taxonomy', 'prc-components');

	return (
		<div className={className}>
			{!hasTokens && <Spinner />}
			{hasTokens && !allowMultiple && (
				<SelectControl
					label={label}
					value={currentValue}
					options={tokens}
					onChange={(newValue) => {
						setCurrentValue(newValue);
					}}
					__nextHasNoMarginBottom
				/>
			)}
			{hasTokens && allowMultiple && (
				<MultiSelectWrapper>
					<MultiSelectControl
						label={label}
						value={currentValue}
						options={tokens}
						onChange={(newValue) => {
							setCurrentValue(newValue);
						}}
					/>
				</MultiSelectWrapper>
			)}
		</div>
	);
}
