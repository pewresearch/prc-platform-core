/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { List } from 'react-movable';
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { CardDivider, PanelRow } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from './utils';
import { useBylines } from './context';
import BylineItem from './byline-item';

const SearchContainer = styled.div`
	width: 100%;
	display: block;
	& > div:first-of-type {
		width: 100%;
	}
`;

const ListWrapper = styled.div`
	width: 100%;
	padding-top: 1em;
`;

function Acknowledgements() {
	const { acknowledgementItems, reorder, remove, append } = useBylines();
	return (
		<PanelRow>
			<div>
				<CardDivider />
				<p>
					{__(
						`Acknowledgements will not appear on the post. People associated here will have this post listed on their staff bio page.`,
						'prc-platform-core'
					)}
				</p>
				<SearchContainer>
					<WPEntitySearch
						placeholder="Add new acknowledgement..."
						entityType="taxonomy"
						entitySubType="bylines"
						onSelect={(entity) => {
							append(randomId(), entity.entityId, false);
						}}
						clearOnSelect={true}
					>
						<ListWrapper>
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
											lastItem={
												index ===
												acknowledgementItems.length - 1
											}
										/>
									</div>
								)}
							/>
						</ListWrapper>
					</WPEntitySearch>
				</SearchContainer>
			</div>
		</PanelRow>
	);
}

export default Acknowledgements;
