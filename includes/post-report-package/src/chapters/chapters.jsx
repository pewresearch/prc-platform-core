/**
 * External Dependencies
 */
import { List } from 'react-movable';
// import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { BaseControl, Button, ExternalLink, CardDivider } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import ListItem from '../list-item';
import ExistingChapterToolbar from './existing-chapter-toolbar';
import PostSearchByEditUrlField from './post-search-by-edit-url-field';

export default function Chapters() {
	const ITEMS_TYPE = 'chapters';
	const {
		chapters,
		reorder,
		append,
		remove,
		updateItem,
		postId,
		allowEditing,
		parentPost,
		parentPostTitle,
		isChild,
	} = usePostReportPackage();

	return (
		<Fragment>
			{isChild && (
				<BaseControl label="Parent Post" id="parent-post">
					<ExternalLink href="#">{`${parentPostTitle}`}</ExternalLink>
					<CardDivider />
				</BaseControl>
			)}
			<BaseControl label="Chapters" id="chapters-list">
				<List
					lockVertically
					values={chapters ?? []}
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
								postId={value.postId}
								index={index}
								onRemove={() => remove(index, ITEMS_TYPE)}
							>
								{null === value.postId && (
									<PostSearchByEditUrlField
										hocOnChange={(_postId) =>
											updateItem(
												index,
												'postId',
												_postId,
												ITEMS_TYPE
											)
										}
									/>
								)}
								{null !== value.postId && allowEditing && (
									<ExistingChapterToolbar
										{...{
											postId: value.postId,
											currentPostId: postId,
										}}
									/>
								)}
							</ListItem>
						</div>
					)}
				/>
				<Button
					variant="primary"
					onClick={() =>
						append(randomId(), { postId: null }, ITEMS_TYPE)
					}
					disabled={!allowEditing}
				>
					Add Chapter
				</Button>
			</BaseControl>
		</Fragment>
	);
}
