/* eslint-disable camelcase */
/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { List } from 'react-movable';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { Card, CardBody } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';

/**
 * Internal Dependencies
 */
import './store';
import ListStoreItem from './ListStoreItem';

function randomId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_${Math.random().toString(36).substr(2, 9)}`;
}

function SearchItem({ item, onSelect }) {
	console.log('<SearchItem>', item);
	if (!item) {
		return null;
	}

	const { status, title } = item;

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<Card
			onClick={() => {
				console.log('SELECTED', item);
				onSelect(item);
			}}
			size="small"
			style={{
				cursor: 'pointer',
				':hover': {
					'background-color': '#f3f4f5',
				},
			}}
		>
			<CardBody
				style={{
					display: 'flex',
				}}
			>
				<div>
					<strong>
						{title.rendered ? title.rendered : title}
						{'draft' === status ? ` (draft)` : null}
					</strong>
				</div>
			</CardBody>
		</Card>
	);
}

function RelatedPostsPanel() {
	const { append, reorder } = useDispatch('prc/related-posts');

	const { items, postType } = useSelect(
		(select) => ({
			items: select('prc/related-posts').getItems(),
			postType: select('core/editor').getCurrentPostType(),
		}),
		[],
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	useEffect(() => {
		if (0 !== items.length) {
			console.log('<RelatedPostsPanel> Meta Save...', items);
			setMeta({ ...meta, relatedPosts: items });
		}
	}, [items]);

	return (
		<PluginDocumentSettingPanel name="prc-related-posts" title="Related Posts">
			<WPEntitySearch
				placeholder={__('Enter URL or search for post', 'prc-platform-core')}
				entityType="postType"
				entitySubType="post"
				onSelect={(item) => {
					console.log('ITEM', item);
					append({
						key: randomId(),
						link: item.canonical_url,
						postId: item.id,
						title: item.title.rendered,
						date: item.date,
						label: item.label,
					});
				}}
				clearOnSelect={true}
			>
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
								value={value}
								label={value.title}
								defaultLabel="Related Post"
								index={index}
								storeName="related-posts"
								lastItem={index === items.length - 1}
							/>
						</div>
					)}
				/>
			</WPEntitySearch>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('prc-related-posts', {
	render: RelatedPostsPanel,
	icon: null,
});
