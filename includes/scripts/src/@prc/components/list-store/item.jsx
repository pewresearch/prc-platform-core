/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { Icon, IconButton } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';

/**
 * List Store Item
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.defaultLabel
 * @param {string} props.keyValue
 * @param {number} props.index
 * @param {object} props.children
 * @param {function} props.onRemove
 * @param {string} props.storeName
 * @param {boolean} props.lastItem
 * @param {boolean} props.icon
 * @returns {JSX.Element}
 */
function ListStoreItem({
	label,
	defaultLabel,
	keyValue,
	index,
	children,
	onRemove = false,
	storeName = null,
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
			storeName,
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
							if ( null !== storeName ) {
								const { remove } = dispatch(`prc/${storeName}`);
								remove(index);
							}
						}}
					/>
				</div>
			</div>
			{children}
		</div>
	);
}

export default ListStoreItem;
