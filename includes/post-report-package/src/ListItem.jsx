/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { Icon, IconButton } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';

export default function ListItem({
	label,
	defaultLabel,
	keyValue,
	index,
	children,
	onRemove = false,
	lastItem = false,
	icon = false,
}) {
	const [labelText, setLabelText] = useState(
		undefined !== label ? label : defaultLabel,
	);

	const getPostTitleByKey = (postId) => {
		const { api } = window.wp;
		const post = new api.models.Post({ id: postId });
		if (null === postId) {
			setLabelText(defaultLabel);
		} else {
			post.fetch().then((matched) => {
				console.log(matched);
				setLabelText(
					`${decodeEntities(matched.title.rendered)} (${matched.id})`,
				);
			});
		}
	};

	useEffect(() => {
		console.log(
			'getPostTitleByKey',
			label,
			defaultLabel,
			keyValue,
			index,
		);
		if (undefined === label && undefined !== keyValue) {
			getPostTitleByKey(keyValue);
		}
	}, [keyValue]);

	return (
		<div
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
					<span>{labelText}</span>
				</div>
				<div style={{ display: 'flex' }}>
					<IconButton
						icon="no-alt"
						onClick={() => {
							if (false !== onRemove && 'function' === typeof onRemove) {
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
