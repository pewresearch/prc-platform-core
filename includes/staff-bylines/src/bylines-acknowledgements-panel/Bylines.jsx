/**
 * External Dependencies
 */

import { randomId } from '@prc-app/shared';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { FormToggle, PanelRow } from '@wordpress/components';

/**
 * 3rd Party Dependencies
 */
import { List } from 'react-movable';

/**
 * Internal Dependencies
 */
import { ObjectSearchField } from '../_shared';
import { useBylines } from './context';
import BylineItem from './BylineItem';

function Bylines() {
	const {
		bylineItems,
		reorder,
		remove,
		append,
		displayBylines,
		toggleBylinesDisplay,
	} = useBylines();

	return (
		<Fragment>
			<PanelRow>
				<ObjectSearchField
					placeholder="Add new byline..."
					entityType="taxonomy"
					entitySubType="bylines"
					onSelect={(item) => {
						append(randomId(), item.id, true);
					}}
				>
					<div style={{ width: '100%', paddingTop: '1em' }}>
						<List
							lockVertically
							values={bylineItems}
							onChange={({ oldIndex, newIndex }) => reorder(oldIndex, newIndex)}
							renderList={({ children, props }) => (
								<div {...props}>{children}</div>
							)}
							renderItem={({ value, props, index }) => (
								<div {...props}>
									<BylineItem
										key={value.key}
										value={value}
										onRemove={() => {
											remove(index, true);
										}}
										lastItem={index === bylineItems.length - 1}
									/>
								</div>
							)}
						/>
					</div>
				</ObjectSearchField>
			</PanelRow>
			<PanelRow>
				<label>Display Bylines</label>
				<FormToggle
					checked={displayBylines}
					onChange={() => {
						toggleBylinesDisplay();
					}}
				/>
			</PanelRow>
		</Fragment>
	);
}

export default Bylines;
