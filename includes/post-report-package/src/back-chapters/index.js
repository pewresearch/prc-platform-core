/**
 * External Dependencies
 */
import { List } from 'react-movable';
// import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import ListItem from '../list-item';
import ExistingBackChapterToolbar from './existing-back-chapter-toolbar';
import PostSearchByEditUrlField from './post-search-by-edit-url-field';

export default function BackChapters() {
	const ITEMS_TYPE = 'backChapters';
	const { backChapters, reorder, append, remove, updateItem, currentPostId } =
		usePostReportPackage();
	const [addChildModalOpen, toggleAddChildModal] = useState(false);

	return (
		<PanelBody title="Back Chapters">
			<List
				lockVertically
				values={backChapters ?? []}
				onChange={({ oldIndex, newIndex }) =>
					reorder(oldIndex, newIndex, ITEMS_TYPE)
				}
				renderList={({ children, props }) => (
					<div {...props}>{children}</div>
				)}
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
								// <WPEntitySearch
								// 	{...{
								// 		placeholder:
								// 			'Search for a post by URL or title',
								// 		onSelect: (entity) => {
								// 			console.log('onSELECT:::', entity);
								// 			updateItem(
								// 				index,
								// 				'postId',
								// 				entity.entityId,
								// 				ITEMS_TYPE
								// 			);
								// 		},
								// 		showExcerpt: true,
								// 		clearOnSelect: true,
								// 		entityType: 'postType',
								// 		entitySubType: 'post',
								// 		showType: false,
								// 		hideChildren: false,
								// 	}}
								// />
								<PostSearchByEditUrlField
									hocOnChange={(postId) =>
										updateItem(
											index,
											'postId',
											postId,
											ITEMS_TYPE
										)
									}
								/>
							)}
							{null !== value.postId && (
								<ExistingBackChapterToolbar
									{...{
										postId: value.postId,
										currentPostId,
									}}
								/>
							)}
						</ListItem>
					</div>
				)}
			/>
			<Button
				variant="primary"
				onClick={() => append(randomId(), { postId: null }, ITEMS_TYPE)}
			>
				Add Back Chapter
			</Button>
		</PanelBody>
	);
}
