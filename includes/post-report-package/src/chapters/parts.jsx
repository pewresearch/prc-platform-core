/**
 * External Dependencies
 */
import { List } from 'react-movable';
import { usePostIdsAsOptions, LoadingIndicator } from '@prc/hooks';
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { BaseControl, Button, SelectControl } from '@wordpress/components';
import { select } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import ListItem from '../list-item';

const StyledSelect = styled(SelectControl)`
	option {
		overflow-y: hidden;
		padding: 0.5em;
		&:hover {
			background: #f1f1f1;
		}
	}
`;

const StyledBaseControl = styled(BaseControl)`
	margin-top: 1em;
`;

export default function Parts() {
	const ITEMS_TYPE = 'parts';
	const {
		parts,
		reorder,
		append,
		remove,
		updateItem,
		chapters,
		isResolving,
		postType,
		allowEditing,
	} = usePostReportPackage();

	const postIds = useMemo(
		() =>
			!isResolving
				? chapters
						.filter((chapter) => chapter.postId)
						.map((chapter) => chapter.postId)
				: [],
		[chapters, isResolving]
	);

	return (
		<StyledBaseControl label="Parts" id="parts-list">
			<List
				lockVertically
				values={parts ?? []}
				onChange={({ oldIndex, newIndex }) =>
					reorder(oldIndex, newIndex, ITEMS_TYPE)
				}
				renderList={({ children, props }) => (
					<div {...props}>{children}</div>
				)}
				renderItem={({ value, props, index }) => {
					let options = postIds.map((postId) => {
						const post = select('core').getEntityRecord(
							'postType',
							postType,
							postId
						);
						if (!post) {
							// Don't return anything... the post is not loaded yet
							return null;
						}
						return {
							value: postId,
							label: decodeEntities(post.title.rendered),
						};
					});
					options = options.filter((option) => option !== null);
					console.log("renderItem", options, value);
					return (
						<div {...props}>
							<ListItem
								key={value.key}
								defaultLabel="Part"
								label={value.label}
								displayLabelAsInput
								onLabelUpdate={(newLabel) =>
									updateItem(
										index,
										'label',
										newLabel,
										ITEMS_TYPE
									)
								}
								index={index}
								onRemove={() => remove(index, ITEMS_TYPE)}
							>
								<div>
									<p>Chapters</p>
									<StyledSelect
										multiple
										label={'Chapters'}
										value={value.items ?? []} // e.g: value = [ 'a', 'c' ]
										onChange={(selectedChapters) => {
											console.log("Chapter selected", selectedChapters);
											updateItem(
												index,
												'items',
												selectedChapters,
												ITEMS_TYPE
											);
										}}
										options={options}
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>
								</div>
							</ListItem>
						</div>
					);
				}}
			/>
			<Button
				variant="primary"
				disabled={!allowEditing}
				onClick={() =>
					append(
						randomId(),
						{
							label: '',
						},
						ITEMS_TYPE
					)
				}
			>
				Add Part
			</Button>
		</StyledBaseControl>
	);
}
