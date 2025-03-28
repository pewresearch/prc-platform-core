/**
 * External Dependencies
 */
import { has } from 'lodash';
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { DropZone } from '@wordpress/components';
import { Fragment, useCallback, useState, useMemo } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { uploadMedia } from '@wordpress/media-utils';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal Dependencies
 */
import Overlay from './overlay';

const ALLOWED_MEDIA_TYPES = ['image'];

const ImageSlot = styled.div`
	background: inherit;
	position: relative;
`;

const ImageSlotContainer = styled.div`
	background: var(--wp--preset--color--ui-gray-very-light);
`;

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ClearFix = styled.div`
	clear: both;
	width: ${(props) => props.aspectWidth}px;
	height: ${(props) => props.aspectHeight}px;
	max-width: 100%;
	max-height: 100%;
`;

export default function MediaImageSlot({
	id,
	size = 'A1',
	labels = {
		label: 'Edit A1 Image Slot',
		title: 'Select A1 Image',
		update: 'Update A1 Image Slot',
		dropzone: 'Drop A1 Image Here',
	},
	onClick,
	onUpdate = (image) => {
		console.log('onUpdate', image);
	},
	overlayActive = false,
	allowedTypes = ALLOWED_MEDIA_TYPES,
}) {
	const [isUploading, setIsUploading] = useState(false);

	const { media, postId } = useSelect(
		(select) => {
			const { getMedia } = select('core');
			return {
				media: id ? getMedia(id) : null,
				postId: select(editorStore).getCurrentPostId(),
			};
		},
		[id]
	);

	const { hasMedia, width, height, src } = useMemo(() => {
		const x = {
			width: 249,
			height: 139,
			src: null,
			hasMedia: false,
		};
		// If this does have an id and media and isn't uploading then set
		// the properties accordingly.
		if (!!id && media && !isUploading) {
			if (has(media, ['media_details', 'sizes', size])) {
				// use size when available
				x.width = media.media_details.sizes[size].width;
				x.height = media.media_details.sizes[size].height;
				x.src = media.media_details.sizes[size].source_url;
				x.hasMedia = true;
			}
		}
		return x;
	}, [id, media, size, isUploading]);

	const onUpdateImage = (image) => {
		onUpdate(image);
	};

	const onDropImage = (filesList) => {
		uploadMedia({
			allowedTypes,
			filesList,
			additionalData: {
				post: postId,
			},
			onFileChange([image]) {
				if (!image.id) {
					setIsUploading(true);
				} else {
					image.sizes = image.media_details.sizes;
					onUpdateImage(image);
					setIsUploading(false);
				}
			},
			onError(message) {
				console.error(message);
			},
		});
	};

	const onClickHandler = useCallback(
		(func) => {
			if (undefined !== onClick) {
				onClick();
			} else {
				func();
			}
		},
		[onClick]
	);

	return (
		<ImageSlot>
			<MediaUploadCheck>
				<MediaUpload
					title={labels.title}
					onSelect={onUpdateImage}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					value={id}
					modalClass="prc-platform-art-direction__modal"
					render={({ open }) => (
						<ImageSlotContainer>
							<Overlay
								{...{
									onClickHandler: () => onClickHandler(open),
									width,
									height,
									isActive: !!id
										? overlayActive || !hasMedia
										: true,
									label: !!id ? labels.update : labels.label,
									icon: labels.icon || false,
									spinner: !!id ? !hasMedia : false,
								}}
							>
								<Fragment>
									{!!id && hasMedia && (
										<Img
											src={src}
											alt={labels.update}
											width={width}
											height={height}
										/>
									)}
									{(!hasMedia || !id) && (
										<ClearFix
											{...{
												aspectWidth: width,
												aspectHeight: height,
											}}
										/>
									)}
								</Fragment>
							</Overlay>
							<DropZone
								onFilesDrop={onDropImage}
								label={labels?.dropzone || labels?.label}
							/>
						</ImageSlotContainer>
					)}
				/>
			</MediaUploadCheck>
		</ImageSlot>
	);
}
