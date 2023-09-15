/**
 * External Dependencies
 */
import { ListStoreItem } from '@prc-app/shared';
import { randomId } from '@prc-app/shared';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	Button,
	Icon,
	IconButton,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import { TypeSelect, types } from './type-select';

const Item = ({ type, url, attachmentId, label, icon, index }) => {
	const [popoverVisible, toggleVisibility] = useState(false);
	const { setItemProp, remove, insert } = useDispatch('prc/report');

	const UploadFileButton = ({ title, value }) => {
		const ALLOWED_MEDIA_TYPES = [
			'image',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.ms-powerpoint',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		];
		return (
			<MediaUploadCheck>
				<MediaUpload
					title={`Upload ${title}`}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					value={value}
					onSelect={(img) => {
						// setItemProp(index, 'type', input)
						setItemProp(index, 'url', img.url);
						setItemProp(index, 'attachmentId', img.id);
					}}
					render={({ open }) => {
						return (
							<Button isDefault onClick={open}>
								{__(
									null === value
										? `Upload ${title}`
										: `Change ${title}`
								)}
							</Button>
						);
					}}
				/>
			</MediaUploadCheck>
		);
	};

	const getLabel = () => {
		const t = types.find((x) => x.value === type);
		if (undefined !== t) {
			return t.label;
		}
		return '';
	};

	const icons = {
		detailedTable: 'editor-table',
		link: 'admin-links',
		presentation: 'format-gallery',
		pressRelease: 'media-document',
		promo: 'star-empty',
		qA: 'clipboard',
		questionnaire: 'editor-help',
		report: 'analytics',
		supplemental: 'welcome-add-page',
		topline: 'editor-ul',
	};

	const getValue = () => {
		const t = types.find((x) => x.value === type);
		if (undefined !== t) {
			return t.value;
		}
		return '';
	};

	return (
		<ListStoreItem label={getLabel()} index={index} storeName="report">
			<div
				style={{
					paddingTop: '10px',
				}}
			>
				{[
					'report',
					'questionnaire',
					'detailedTable',
					'powerpoint',
					'presentation',
					'pressRelease',
					'topline',
				].includes(type) && (
					<UploadFileButton title={getLabel()} value={attachmentId} />
				)}
				{['presentation', 'pressRelease'].includes(type) && (
					<Fragment>
						<TextControl
							autoComplete={false}
							label="URL"
							value={url}
							onChange={(u) => setItemProp(index, 'url', u)}
						/>
					</Fragment>
				)}
				{['link', 'promo', 'qA', 'supplemental'].includes(type) && (
					<Fragment>
						<TextControl
							autoComplete={false}
							label="Label"
							value={label}
							onChange={(c) => setItemProp(index, 'label', c)}
						/>
						<TextControl
							autoComplete={false}
							label="URL"
							value={url}
							onChange={(u) => setItemProp(index, 'url', u)}
						/>
						{'link' === type && (
							<SelectControl
								label="Icon"
								value={icon}
								options={types}
								onChange={(t) => {
									console.log(t);
									setItemProp(index, 'icon', t);
								}}
							/>
						)}
						{'promo' === type && (
							<MediaUploadCheck>
								<MediaUpload
									title="Upload Promo Icon"
									value={attachmentId} // If we actually have data we should pass it in here.
									onSelect={(img) => {
										setItemProp(index, 'icon', img.url);
										setItemProp(
											index,
											'attachmentId',
											img.id
										);
									}}
									render={({ open }) => {
										return (
											<Button onClick={open}>
												Upload Icon
											</Button>
										);
									}}
								/>
							</MediaUploadCheck>
						)}
					</Fragment>
				)}
				<Button
					isLarge
					onClick={() => {
						toggleVisibility(true);
						console.log('toggleVisibility');
					}}
					style={{ height: 'auto' }}
				>
					<Icon
						icon={icons[getValue()]}
						style={{ marginLeft: '5px' }}
					/>
				</Button>
				{popoverVisible && (
					<TypeSelect
						type={type}
						onChange={(t) => {
							remove(index);
							insert(index, {
								key: randomId(),
								type: t,
								attachmentId: 0,
								url: '',
								label: '',
								icon: '',
							});
							toggleVisibility(false);
						}}
						toggleVisibility={toggleVisibility}
					/>
				)}
			</div>
		</ListStoreItem>
	);
};

export default Item;
