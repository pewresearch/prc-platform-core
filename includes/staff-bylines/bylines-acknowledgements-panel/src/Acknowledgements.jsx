/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { CardDivider, PanelRow } from '@wordpress/components';

/**
 * 3rd Party Dependencies
 */
import { List } from 'react-movable';

/**
 * Internal Dependencies
 */
import { ObjectSearchField } from '../_shared';
import { randomId } from './utils';
import { useBylines } from './context';
import BylineItem from './BylineItem';

function Acknowledgements() {
	const { acknowledgementItems, reorder, remove, append } = useBylines();
	return (
		<PanelRow>
			<div>
				<CardDivider />
				<p>
					{__(
						`Acknowledgements will not appear on the post. People associated here will have this post listed on their staff page.`,
						'prc-block-plugins',
					)}
				</p>
				<ObjectSearchField
					placeholder="Add new acknowledgement..."
					entityType="taxonomy"
					entitySubType="bylines"
					onSelect={(item) => {
						append(randomId(), item.id, false);
					}}
				>
					<div style={{ width: '100%', paddingTop: '1em' }}>
						<List
							lockVertically
							values={acknowledgementItems}
							onChange={({ oldIndex, newIndex }) =>
								reorder(oldIndex, newIndex, false)
							}
							renderList={({ children, props }) => (
								<div {...props}>{children}</div>
							)}
							renderItem={({ value, props, index }) => (
								<div {...props}>
									<BylineItem
										key={value.key}
										value={value}
										onRemove={() => {
											remove(index, false);
										}}
										lastItem={index === acknowledgementItems.length - 1}
									/>
								</div>
							)}
						/>
					</div>
				</ObjectSearchField>
			</div>
		</PanelRow>
	);
}

export default Acknowledgements;
