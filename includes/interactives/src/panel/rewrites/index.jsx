/**
 * External Dependencies
 */
import { List } from 'react-movable';

/**
 * WordPress Dependencies
 */
import { Fragment, useMemo, useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { BaseControl, Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import {STORE_NAME, registerStore} from './store';
import ListStoreItem from './list-store-item';

registerStore();

function randomId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_${Math.random().toString(36).substr(2, 9)}`;
}

export default function RewritesPanel({
	postType,
	postId,
	postSlug,
}) {
	const { append, reorder } = useDispatch(STORE_NAME);
	const items = useSelect((select) => select(STORE_NAME).getItems());

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	useEffect(() => {
		if (0 !== items.length) {
			console.log('<RewritesPanel> Meta Save...', items);
			setMeta({ ...meta, _interactive_rewrites: items });
		}
	}, [items]);

	return (
		<BaseControl help={__('You can add rewrites to your interactive by using the `{myVar}` syntax to indicate URL parameters that you want to be accessible in the `prcPlatformInteractives` window namespace.')}>
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
							pattern={value?.pattern || ''}
							label="Rewrite Schema"
							index={index}
							lastItem={index === items.length - 1}
						/>
					</div>
				)}
			/>
			<Button variant="primary" onClick={() => {
				append({
					key: randomId(),
					pattern: '{myNewParam}/{myOtherNewParam}',
				});
			}}>
				Add New Rewrite
			</Button>
		</BaseControl>
	);
}
