/**
 * CSS Classes and Styling Forked from Gutenberg featured image component:
 * https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/editor/src/components/post-featured-image/index.js
 */

/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	DropZone,
	Flex,
	FlexBlock,
	FlexItem,
	ResponsiveWrapper,
	Spinner,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { uploadMedia } from '@wordpress/media-utils';

const ALLOWED_MEDIA_TYPES = ['image'];

const capitalize = (s) => {
	if ('string' !== typeof s) return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

const Label = ({ size, label }) => {
	const isChartArt = useSelect((select) =>
		select('prc/art').isChartArt(size)
	);
	const { toggleChartArt } = useDispatch('prc/art');
	return (
		<Flex
			style={{
				alignItems: 'center',
				borderTop: '1px solid #eaeaea',
				height: '45px',
			}}
		>
			<FlexBlock>
				<strong>{__(label)}</strong>
			</FlexBlock>

			<FlexItem>
				{('A2' === size || 'A3' === size || 'A4' === size) && (
					<Button
						icon="chart-pie"
						label={__(`Toggle Chart Art`)}
						isPressed={isChartArt}
						onClick={() => toggleChartArt(size)}
						text={__(`Chart`)}
					/>
				)}
			</FlexItem>
		</Flex>
	);
};

const Image = ({ imageId = false, size = 'A1' }) => {
	const [isUploading, setIsUploading] = useState(false);

	const { media } = useSelect((select) => {
		const { getMedia } = select('core');

		return {
			media: imageId ? getMedia(imageId) : null,
		};
	});

	const label = capitalize(size);

	const { storeImage } = useDispatch('prc/art');

	const onUpdateImage = (image) => {
		console.log(
			'interact with data store and update image selection',
			size,
			image
		);
		storeImage(image, size);
	};

	const onDropImage = (filesList) => {
		console.log('onDropImage', filesList);
		uploadMedia({
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList,
			onFileChange([image]) {
				console.log('onFileChange', image);
				if (!image.id) {
					console.log('waiting');
					setIsUploading(true);
				} else {
					console.log('found!', image);
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

	const instructions = (
		<p>
			{__(
				`To edit the ${size} image slot for this post you will need permission to upload media.`
			)}
		</p>
	);

	let mediaWidth;
	let mediaHeight;
	let mediaSourceUrl;
	if (media) {
		console.log('hasMedia!', media, imageId);
		if (has(media, ['media_details', 'sizes', size])) {
			// use size when available
			mediaWidth = media.media_details.sizes[size].width;
			mediaHeight = media.media_details.sizes[size].height;
			mediaSourceUrl = media.media_details.sizes[size].source_url;
		}
	}

	return (
		<div className="editor-post-featured-image">
			<Label size={size} label={label} />
			{media && (
				<div
					id={`editor-post-featured-image-${imageId}-describedby`}
					className="hidden"
				>
					{media.alt_text &&
						sprintf(
							// Translators: %s: The selected image alt text.
							__('Current image: %s'),
							media.alt_text
						)}
					{!media.alt_text &&
						sprintf(
							// Translators: %s: The selected image filename.
							__(
								'The current image has no alternative text. The file name is: %s'
							),
							media.media_details.sizes?.full?.file || media.slug
						)}
				</div>
			)}
			<MediaUploadCheck fallback={instructions}>
				<MediaUpload
					title={__(`${label} Image Slot`)}
					onSelect={onUpdateImage}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					value={imageId}
					render={({ open }) => (
						<div className="editor-post-featured-image__container">
							<Button
								className={
									!imageId
										? 'editor-post-featured-image__toggle' // Dropzone
										: 'editor-post-featured-image__preview' // Has Image
								}
								onClick={open}
								aria-label={
									!imageId
										? null
										: __('Edit or update the image')
								}
								aria-describedby={
									!imageId
										? null
										: `editor-post-featured-image-${imageId}-describedby`
								}
							>
								{!!imageId &&
									media &&
									false === isUploading && (
										<ResponsiveWrapper
											naturalWidth={mediaWidth}
											naturalHeight={mediaHeight}
											isInline
										>
											<img src={mediaSourceUrl} alt="" />
										</ResponsiveWrapper>
									)}
								{((!!imageId && !media) || isUploading) && (
									<ResponsiveWrapper
										naturalWidth={240}
										naturalHeight={139}
										isInline
									>
										<div
											style={{
												backgroundColor: '#f0f0f0',
											}}
										>
											<Spinner />
										</div>
									</ResponsiveWrapper>
								)}
								{!imageId && __(`Set ${label} Image`)}
							</Button>
							<DropZone onFilesDrop={onDropImage} />
						</div>
					)}
				/>
			</MediaUploadCheck>
			{/* <Toolbar /> */}
		</div>
	);
};

export default Image;
