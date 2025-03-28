/* eslint-disable react/forbid-prop-types */
/**
 * External Dependencies
 */
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { FormTokenField, Spinner } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';
import { isEmpty } from 'lodash';

const TermSelectControl = styled('div')`
	& .components-spinner {
		position: absolute;
		margin-top: -32px;
		right: 12px;
	}
`;

function TermSelect({ className, onChange, taxonomy, value, maxTerms, label }) {
	const l = label !== undefined ? label : `Select a ${taxonomy} term`;

	const [searchTerm, setSearchTerm] = useState('');
	const debounceSearchTerm = useDebounce(setSearchTerm, 500);

	const { records, isResolving, hasResolved } = useEntityRecords(
		'taxonomy',
		taxonomy,
		{
			per_page: 10,
			context: 'view',
			search: searchTerm,
		}
	);

	const suggestions = useMemo(() => {
		if (hasResolved && records) {
			console.log('Processing records...', records);
			return records.map((record) => record.name);
		}
		return [];
	}, [records, hasResolved]);

	useEffect(() => {
		console.log('Search Term Changed!', searchTerm);
	}, [searchTerm]);

	return (
		<TermSelectControl className={className}>
			<FormTokenField
				value={value}
				suggestions={suggestions}
				onInputChange={debounceSearchTerm}
				displayTransform={(token) => decodeEntities(token)}
				onChange={(e) => {
					// @TODO: need to build in support for selecting multiple terms.
					console.log('Changing... <TermSelect/>', e);
					if (isEmpty(e)) {
						onChange({});
						return;
					}
					const termToMatch = e[e.length - 1];
					const selectedTerm = records.find(
						(record) => record.name === termToMatch
					);

					if (selectedTerm) {
						// Clean the selected term so it only contains the properties we need.
						const filteredTerm = Object.keys(selectedTerm)
							.filter((key) =>
								[
									'id',
									'name',
									'slug',
									'taxonomy',
									'parent',
									'link',
								].includes(
									key
									// eslint-disable-next-line prettier/prettier
								))
							.reduce(
								(obj, key) => ({
									...obj,
									[key]: selectedTerm[key],
								}),
								{}
							);
						onChange(filteredTerm);
					}
				}}
				label={l}
				maxLength={maxTerms}
				__experimentalShowHowTo={false}
			/>
			{isResolving && <Spinner />}
		</TermSelectControl>
	);
}

TermSelect.defaultProps = {
	className: '',
	maxTerms: 1,
	onChange: (term) => {
		console.log('Selected Term: ', term);
	},
	taxonomy: 'topic',
	value: [],
};

TermSelect.propTypes = {
	className: PropTypes.string,
	maxTerms: PropTypes.number,
	onChange: PropTypes.func,
	taxonomy: PropTypes.string,
	value: PropTypes.array,
};

export default TermSelect;
