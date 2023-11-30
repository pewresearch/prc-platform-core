/** External Dependencies */
import { List, Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

function Count({ count }) {
	let c = count;
	if (250 <= parseFloat(c)) {
		c = '250+';
	}
	return <span>({c})</span>;
}

/**
 * Displays a radio or checkbox facet item.
 * @param {Object} props
 * @param {string} props.label  - The label of facet.
 * @param {string} props.value  - The value of the facet.
 * @param {string} props.count  - The count of the facet.
 * @param {string} props.active - A flag if the facet is active.
 * @param {string} props.allowMultiple - A flag if multiple facets can be selected. (Enables checkboxes)
 * @param {string} props.onChange - A function to call when the facet is changed.
 * @returns
 */
function Item({
	label = '',
	value = '',
	count = 0,
	active = false,
	allowMultiple = false,
	onChange = () => {},
	disabled = false,
}) {
	const d = disabled || 0 === parseFloat(count);
	const l = decodeEntities(label);

	const StyledItem = styled(List.Item)`
		cursor: pointer;
	`;

	return (
		<StyledItem active={active} disabled={d} onClick={onChange}>
			{true === allowMultiple && (
				<Fragment>
					<Checkbox checked={active} disabled={d} label={l} value={value} />{' '}
				</Fragment>
			)}
			{true !== allowMultiple && <Fragment>{l} </Fragment>}
			<Count count={count} />
		</StyledItem>
	);
}

export default Item;
