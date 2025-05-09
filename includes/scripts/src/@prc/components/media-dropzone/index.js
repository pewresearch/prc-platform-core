/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { has } from 'underscore';
import { __ } from '@wordpress/i18n';
import { Button as WPComButton, DropZone } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { uploadMedia } from '@wordpress/media-utils';

const DEFAULT_IMAGE_SIZE = 'full';

const Button = styled(WPComButton)`
	margin: 0 !important;
`;

const MediaControls = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
`;

const OpenButton = styled.button`
	cursor: pointer;
	background: none;
	border: none;
	margin: 0;
`;

const OpenAction = styled.div`
	cursor: pointer;
	background: none;
	border: none;
	margin: 0;
`;

function MediaDropZone({
	attachmentId = false,
	disabled = false,
	onUpdate = (attachment) => {
		console.warn(
			'Media DropZone Attachment, use onUpdate prop when using <MediaDropZone/>: ',
			attachment
		);
	},
	onClear = false,
	allowedTypes = ['image'],
	mediaSize = DEFAULT_IMAGE_SIZE,
	label = null,
	singularLabel = __('image'),
	editButtonLabel = __('Edit image'),
	className = '',
	mediaType, // @TODO: mark deprecated.
	children,
}) {
	const fallbackInstructions = __(
		`Drop a ${singularLabel} here, or click to replace.`,
		'prc-block-library'
	);
	const l = null !== label ? label : `Set ${singularLabel}`;

	const [id, setId] = useState(attachmentId);
	const [isUploading, setIsUploading] = useState(false);

	const allowedMediaTypes = !mediaType ? allowedTypes : mediaType;

	/**
	 * When id (attachmentId) changes update the media and get its src, dimensions, and type.
	 */
	const { media, src, width, height, type } = useSelect(
		(select) => {
			const m = id ? select('core').getMedia(id) : false;
			console.warn('get M media', m);
			if (undefined === m || false === m) {
				return {
					media: false,
					src: false,
					width: false,
					height: false,
					type: undefined === m ? 'not-found' : false,
				};
			}

			let mediaSourceUrl = false;
			let mediaWidth = false;
			let mediaHeight = false;

			if (has(m, ['media_details', 'sizes', mediaSize])) {
				// use mediaSize when available
				mediaWidth = m.media_details.sizes[mediaSize].width;
				mediaHeight = m.media_details.sizes[mediaSize].height;
				mediaSourceUrl = m.media_details.sizes[mediaSize].source_url;
			} else {
				// get fallbackMediaSize if mediaSize is not available
				const fallbackMediaSize = DEFAULT_IMAGE_SIZE;
				if (has(m, ['media_details', 'sizes', fallbackMediaSize])) {
					// use fallbackMediaSize when mediaSize is not available
					mediaWidth = m.media_details.sizes[fallbackMediaSize].width;
					mediaHeight =
						m.media_details.sizes[fallbackMediaSize].height;
					mediaSourceUrl =
						m.media_details.sizes[fallbackMediaSize].source_url;
				} else {
					// use full image size when mediaFallbackSize and mediaSize are not available
					mediaWidth = m.media_details.width;
					mediaHeight = m.media_details.height;
					mediaSourceUrl = m.source_url;
				}
			}

			return {
				media: m,
				src: mediaSourceUrl,
				width: mediaWidth,
				height: mediaHeight,
				type: false !== m ? m?.media_type : false,
			};
		},
		[id]
	);

	const onMediaUpdate = (m) => {
		if (m.id !== id) {
			setId(m.id);
			onUpdate(m);
		}
		setIsUploading(false);
	};

	const onDropFile = (filesList) => {
		uploadMedia({
			allowedTypes: allowedMediaTypes,
			filesList,
			onFileChange([file]) {
				console.log('onFileChange', file);
				if (!file.id) {
					setIsUploading(true);
				} else {
					file.sizes = file.media_details.sizes;
					onMediaUpdate(file);
				}
			},
			onError(message) {
				console.error(message);
			},
		});
	};

	const isUploaded =
		false !== id &&
		false !== media &&
		false !== src &&
		false === isUploading;

	const displayClearButton = false !== type;

	return (
		<MediaUploadCheck fallback={fallbackInstructions}>
			<MediaUpload
				title={`${singularLabel.charAt(0).toUpperCase() + singularLabel.slice(1)} Upload`}
				onSelect={onMediaUpdate}
				allowedTypes={allowedMediaTypes}
				value={id}
				render={({ open }) => {
					const onClick = () => {
						if (true !== disabled) {
							open();
						}
					};
					return (
						<MediaControls className={className}>
							{isUploaded && (
								<Fragment>
									{!children && 'image' === type && (
										<OpenButton
											type="button"
											onClick={onClick}
										>
											<img
												alt={fallbackInstructions}
												src={src}
												width={`${width}px`}
												height={`${height}px`}
											/>
										</OpenButton>
									)}
									{!children && 'image' !== type && (
										<Button
											variant="secondary"
											onClick={onClick}
										>
											{editButtonLabel}
										</Button>
									)}
									{children && (
										<OpenAction onClick={onClick}>
											{children}
										</OpenAction>
									)}
								</Fragment>
							)}
							{false !== onClear && displayClearButton && (
								<Button
									variant="link"
									isSmall
									onClick={() => {
										if ('function' === typeof onClear) {
											onClear();
										}
										setId(false);
									}}
								>
									Clear {singularLabel}
								</Button>
							)}
							{!isUploaded && isUploading && (
								<Button variant="secondary" isBusy>
									{__('Loading…')}
								</Button>
							)}
							{!isUploaded && !isUploading && (
								<Button variant="primary" onClick={onClick}>
									{l}
								</Button>
							)}
							<DropZone onFilesDrop={onDropFile} />
						</MediaControls>
					);
				}}
			/>
		</MediaUploadCheck>
	);
}

export default MediaDropZone;
