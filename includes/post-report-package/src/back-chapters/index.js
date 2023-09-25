/**
 * External Dependencies
 */
import { List } from 'react-movable';

/**
 * WordPress Dependencies
 */
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import ListItem from '../ListItem';
import PostSearchByEditUrlField from './PostSearchByEditUrlField';
import ExistingBackChapterToolbar from './ExistingBackChapterToolbar';

export default function BackChapters() {
	const ITEMS_TYPE = 'backChapters';
	const { backChapters, reorder, append, remove, updateItem, currentPostId } = usePostReportPackage();

	return (
		<PanelBody title="Back Chapters">
			<List
				lockVertically
				values={backChapters ?? []}
				onChange={({ oldIndex, newIndex }) =>
					reorder(oldIndex, newIndex, ITEMS_TYPE)
				}
				renderList={({ children, props }) => <div {...props}>{children}</div>}
				renderItem={({ value, props, index }) => (
					<div {...props}>
						<ListItem
							key={value.key}
							defaultLabel="Child Post"
							keyValue={value.postId}
							index={index}
							onRemove={() => remove(index, ITEMS_TYPE)}
						>
							{null === value.postId && (
								<PostSearchByEditUrlField
									hocOnChange={(postId) => updateItem(index, 'postId', postId, ITEMS_TYPE)}
								/>
							)}
							{null !== value.postId && (
								<ExistingBackChapterToolbar {...{
									postId: value.postId,
									currentPostId,
								}}/>
							)}
						</ListItem>
					</div>
				)}
			/>
			<Button
				variant="primary"
				onClick={() =>
					append(
						randomId(),
						{ postId: null },
						ITEMS_TYPE,
					)
				}
			>
				Add Back Chapter
			</Button>
		</PanelBody>
	);
}
