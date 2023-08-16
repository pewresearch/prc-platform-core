/* eslint-disable import/prefer-default-export */
/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { useState, useRef } from '@wordpress/element';
import { Popover as WPComPopover } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import ImageDetail from './ImageDetail';

const Thumbnail = ({ imageUrl, thumbnailRef, onClick, isActive = false }) => {
	const ThumbnailWrapper = styled.div`
		position: relative;
		width: 100%;
		padding-bottom: 100%;
		background-image: url(${imageUrl});
		background-size: cover;
		background-position: center;
		cursor: pointer;
		border: 2px solid white;
		${isActive &&
		`
			border: 2px solid #007cba;
		`}
	`;

	const ThumbnailImage = styled.div`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;

	return (
		<ThumbnailWrapper onClick={onClick} ref={thumbnailRef}>
			<ThumbnailImage />
		</ThumbnailWrapper>
	);
};

const Popover = styled(WPComPopover)`
	& .components-popover__content {
		width: max-content;
		box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.6);
	}
`;

export default function ImagePopover({
	image,
	placement = 'right',
	displayDetails = false,
}) {
	const { mimeType, url, thumbnailUrl, squareUrl } = image;

	const [isActive, setIsActive] = useState(false);
	const thumbnailRef = useRef();
	const toggleIsActive = () => setIsActive(!isActive);

	return (
		<>
			<Thumbnail
				onClick={toggleIsActive}
				imageUrl={squareUrl}
				thumbnailRef={thumbnailRef}
				isActive={isActive}
			/>
			{isActive && (
				<Popover
					// placement={placement}
					anchorRef={thumbnailRef}
					noArrow={false}
					onClose={() => setIsActive(false)}
				>
					<ImageDetail
						image={image}
						displayDetails={displayDetails}
					/>
				</Popover>
			)}
		</>
	);
}
