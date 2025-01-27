/**
 * WordPress Dependencies
 */
import { useMemo, useRef, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { Icon, IconButton, TextControl } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';
import { useEntityProp } from '@wordpress/core-data';

export default function ListItem({
	label,
	defaultLabel,
	postId,
	index,
	children,
	displayLabelAsInput,
	onLabelUpdate,
	onRemove = false,
	lastItem = false,
	icon = false,
}) {
	const [postTitle] = useEntityProp('postType', 'post', 'title', postId);
	const labelText = useMemo(() => {
		if (
			undefined === label &&
			undefined !== postTitle &&
			'' !== postTitle
		) {
			return decodeEntities(postTitle);
		}
		if (undefined !== label && '' !== label) {
			return label;
		}
		return defaultLabel;
	}, [postTitle, label, defaultLabel]);

	const divRef = useRef(null);

	return (
		<div
			ref={divRef}
			style={{
				background: 'white',
				paddingBottom: '1em',
				marginBottom: '1em',
				borderBottom: lastItem ? 'none' : '1px solid #EAEAEA',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex' }}>
					<Icon icon={dragHandle} />
				</div>
				<div
					style={{
						display: 'flex',
						flexGrow: '1',
						paddingLeft: '1em',
					}}
				>
					{false !== icon && { icon }}
					{displayLabelAsInput ? (
						<TextControl
							value={label}
							placeholder="Edit label..."
							onChange={(newLabel) => onLabelUpdate(newLabel)}
						/>
					) : (
						<span>{labelText}</span>
					)}
				</div>
				<div style={{ display: 'flex' }}>
					<IconButton
						icon="no-alt"
						onClick={() => {
							if (
								false !== onRemove &&
								'function' === typeof onRemove
							) {
								onRemove();
							}
						}}
					/>
				</div>
			</div>
			{children}
		</div>
	);
}
