/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	Button,
	ButtonGroup,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import { TypeSelect, getLabel, getOptions } from './type-select';
import { usePostReportPackage } from '../context';
import ListItem from '../lite-item';

const ALLOWED_MEDIA_TYPES = [
	'image',
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.ms-powerpoint',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const ICONS = {
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

const Item = ({ type, url, attachmentId, label, icon, index }) => {
	const ITEMS_TYPE = 'materials';
	const { allowEditing, updateItem, remove } = usePostReportPackage();
	const [popoverVisible, toggleVisibility] = useState(false);

	const UploadFileButton = ({ title, value }) => {
		return (
			<MediaUploadCheck>
				<MediaUpload
					title={__(
						null === value
							? `Upload ${title}`
							: `Change ${title}`
					)}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					value={value}
					onSelect={(img) => {
						updateItem(index, 'url', img.url, ITEMS_TYPE);
						updateItem(index, 'attachmentId', img.id, ITEMS_TYPE);
					}}
					render={({ open }) => {
						return (
							<Button variant="secondary" disabled={!allowEditing} onClick={open}>
								{__(
									null === value
										? `Upload File`
										: `Change File`
								)}
							</Button>
						);
					}}
				/>
			</MediaUploadCheck>
		);
	};

	const UploadIconButton = ({ title, value }) => {
		return(
			<MediaUploadCheck>
				<MediaUpload
					title={__(
						null === value
							? `Upload ${title}`
							: `Change ${title}`
					)}
					value={value}
					onSelect={(img) => {
						updateItem(index, 'icon', img.url, ITEMS_TYPE);
						updateItem(
							index,
							'attachmentId',
							img.id,
							ITEMS_TYPE
						);
					}}
					render={({ open }) => {
						return (
							<Button variant="secondary" disabled={!allowEditing} onClick={open}>
								{__(
									null === value
										? `Upload Icon`
										: `Change Icon`
								)}
							</Button>
						);
					}}
				/>
			</MediaUploadCheck>
		);
	}

	return (
		<ListItem label={getLabel(type)} index={index} onRemove={() => remove(index, ITEMS_TYPE)}>
			<div
				style={{
					paddingTop: '10px',
				}}
			>
				{['presentation', 'pressRelease'].includes(type) && (
					<Fragment>
						<TextControl
							autoComplete={false}
							label="URL"
							value={url}
							onChange={(u) => updateItem(index, 'url', u, ITEMS_TYPE)}
							disabled={!allowEditing}
						/>
					</Fragment>
				)}
				{['link', 'promo', 'qA', 'supplemental'].includes(type) && (
					<Fragment>
						<TextControl
							autoComplete={false}
							label="Label"
							value={label}
							onChange={(c) => updateItem(index, 'label', c, ITEMS_TYPE)}
							disabled={!allowEditing}
						/>
						<TextControl
							autoComplete={false}
							label="URL"
							value={url}
							onChange={(u) => updateItem(index, 'url', u, ITEMS_TYPE)}
							disabled={!allowEditing}
						/>
						{'link' === type && (
							<SelectControl
								label="Icon"
								value={icon}
								options={getOptions()}
								onChange={(t) => {
									console.log(t);
									updateItem(index, 'icon', t, ITEMS_TYPE);
								}}
								disabled={!allowEditing}
							/>
						)}
					</Fragment>
				)}
				<ButtonGroup>
					{[
						'report',
						'questionnaire',
						'detailedTable',
						'powerpoint',
						'presentation',
						'pressRelease',
						'topline',
					].includes(type) && (
						<UploadFileButton title={getLabel(type)} value={attachmentId} />
					)}
					{'promo' === type && (
						<UploadIconButton title={getLabel(type)} value={attachmentId} />
					)}
					<Button
						variant="secondary"
						onClick={() => {
							toggleVisibility(true);
						}}
						disabled={!allowEditing}
					>
						Change Type
					</Button>
					{popoverVisible && (
						<TypeSelect
							type={type}
							onChange={(newType) => {
								// Set up the new type
								updateItem(index, 'type', newType, ITEMS_TYPE);
								// Reset everything else
								updateItem(index, 'attachmentId', null, ITEMS_TYPE);
								updateItem(index, 'url', '', ITEMS_TYPE);
								updateItem(index, 'label', '', ITEMS_TYPE);
								updateItem(index, 'icon', '', ITEMS_TYPE);
								toggleVisibility(false);
							}}
							toggleVisibility={toggleVisibility}
						/>
					)}
				</ButtonGroup>
			</div>
		</ListItem>
	);
};

export default Item;
