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
import { Fragment } from '@wordpress/element';
import { FormToggle, PanelRow } from '@wordpress/components';

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
				<SearchContainer>
					<WPEntitySearch
						placeholder={__('Add new byline…', 'prc-platform-core')}
						entityType="taxonomy"
						entitySubType="bylines"
						onSelect={(item) => {
							append(randomId(), item.id, true);
						}}
						clearOnSelect={true}
					>
						<ListWrapper>
							<List
								lockVertically
								values={bylineItems}
								onChange={({ oldIndex, newIndex }) =>
									reorder(oldIndex, newIndex)
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
												remove(index, true);
											}}
											lastItem={
												index === bylineItems.length - 1
											}
										/>
									</div>
								)}
							/>
						</ListWrapper>
					</WPEntitySearch>
				</SearchContainer>
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
