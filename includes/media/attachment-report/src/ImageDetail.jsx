/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { CopyText, UnstyledButton } from './utils';

const Figure = styled.figure`
	margin: 0;
	padding: 1em;
	box-sizing: border-box;
	width: 100%;
	display: flex;
	flex-direction: row;
	width: 600px;
`;

const Image = styled.div`
	flex-grow: 1;
	img {
		width: 100%;
		height: auto;
	}
	span {
		font-size: 0.8em;
		color: #999;
		font-family: monospace;
	}
`;

const Details = styled.div`
	min-width: 200px;
	margin-left: 1em;
	padding-left: 1em;
	border-left: 1px solid #ddd;
	background: #f7f7f7;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
`;

export default function ImageDetail({ image, displayDetails = false }) {
	const {
		title,
		caption,
		description,
		alt,
		mimeType,
		url,
		thumbnailUrl,
		squareUrl,
		width,
		height,
	} = image;

	return (
		<Figure>
			<Image>
				<UnstyledButton
					onClick={() => {
						window.open(url, '_blank');
					}}
				>
					<img src={url} alt={alt} />
				</UnstyledButton>
				<span>Click to open image in a new tab</span>
			</Image>
			{true === displayDetails && (
				<Details>
					{title && (
						<BaseControl id="image-title" label="Title">
							<div>
								<strong>
									<CopyText value={title} />
								</strong>
							</div>
						</BaseControl>
					)}
					{alt && (
						<BaseControl id="image-alt-text" label="Alt Text">
							<div>
								<CopyText value={alt} />
							</div>
						</BaseControl>
					)}
					{url && (
						<BaseControl id="image-url" label="URL">
							<div>
								<CopyText value={url} asInputField={true} />
							</div>
						</BaseControl>
					)}
				</Details>
			)}
		</Figure>
	);
}
