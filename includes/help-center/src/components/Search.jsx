import { SearchControl } from '@wordpress/components';

const Search = ({ value, onChange }) => {
	<div className="help-center__search-bar">
		<SearchControl
			__nextHasNoMarginBottom
			hideLabelFromVision={false}
			label="Search the PRC Wiki"
			value={value}
			onChange={onChange}
			placeholder="Search ..."
		/>
	</div>;
};

export default Search;
