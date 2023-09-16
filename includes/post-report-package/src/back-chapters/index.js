/**
 * External Dependencies
 */
import { List } from 'react-movable';
import { ListStoreItem } from '@prc/components';
/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import { Button, PanelBody, withNotices } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

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
	const { postId } = useSelect(
		(select) => ({
			postId: select('core/editor').getCurrentPostId(),
		}),
		[],
	);

	const [meta, setMeta] = useEntityProp('postType', 'post', 'meta', postId);
	const {multiSectionReport} = meta;
	const [backChapters, setBackChapters] = useState(multiSectionReport);

	useEffect(() => {
		setMeta({ ...meta, multiSectionReport: backChapters });
	}, [backChapters]);

	const reorder = (oldIndex, newIndex) => {
		const newOrder = [...backChapters];
		const item = newOrder[oldIndex];
		newOrder.splice(oldIndex, 1);
		newOrder.splice(newIndex, 0, item);
		setBackChapters(newOrder);
	};

	const append = (key, termId) => {
		const newItems = [...backChapters];
		newItems.push({ key, termId });
		setBackChapters(newItems);
	};

	const remove = (index) => {
		const newItems = [...backChapters];
		newItems.splice(index, 1);
		setBackChapters(newItems);
	};

	const updateItem = (index, key, value) => {
		const newItems = [...backChapters];
		newItems[index][key] = value;
		setBackChapters(newItems);
	};

	return (
		<PanelBody title="Back Chapters">
			<List
				lockVertically
				values={backChapters}
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
							defaultLabel="Child Post"
							keyValue={value.postId}
							index={index}
							onRemove={() => remove(index)}
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
