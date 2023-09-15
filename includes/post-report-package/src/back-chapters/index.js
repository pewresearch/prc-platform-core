/**
 * External Dependencies
 */
import { List } from 'react-movable';
import { ListStoreItem } from '@prc/components';
/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { Button, PanelBody, withNotices } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './store';
import { randomId } from '../utils';
import PostSearchByEditUrlField from './post-search-field';

function BackChapters({
	noticeOperations,
	noticeUI,
}) {
	const { append, reorder, setItemProp } = useDispatch(
		'prc/multi-section-report',
	);

	const { items } = useSelect(
		(select) => ({
			items: select('prc/multi-section-report')?.getItems(),
		}),
		[],
	);

	return (
		<PanelBody title="Back Chapters">
			<List
				lockVertically
				values={items}
				onChange={({ oldIndex, newIndex }) =>
					reorder({
						from: oldIndex,
						to: newIndex,
					})
				}
				renderList={({ children, props }) => <div {...props}>{children}</div>}
				renderItem={({ value, props, index }) => (
					<div {...props}>
						<ListStoreItem
							key={value.key}
							keyValue={value.postId}
							defaultLabel="Child Post"
							index={index}
							storeName="multi-section-report"
						>
							{null === value.postId && (
								<PostSearchByEditUrlField
									hocOnChange={(postId) => setItemProp(index, 'postId', postId)}
								/>
							)}
						</ListStoreItem>
					</div>
				)}
			/>
			<Button
				variant="primary"
				onClick={() => {
					append({
						key: randomId(),
						postId: null,
					});
				}}
			>
				Add Post
			</Button>
		</PanelBody>
	);
}

export default withNotices(BackChapters);
