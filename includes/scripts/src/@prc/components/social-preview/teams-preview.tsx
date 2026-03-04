/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { SocialPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family:
		'Segoe UI',
		-apple-system,
		BlinkMacSystemFont,
		Roboto,
		'Helvetica Neue',
		sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #605e5c;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const Card = styled.div`
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	background: #ffffff;
	max-width: 500px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	position: relative;
`;

const ContentWrapper = styled.div`
	display: flex;
	gap: 16px;
	padding: 12px;
`;

const Thumbnail = styled.div`
	flex-shrink: 0;
	width: 160px;
	height: 100px;
	border-radius: 4px;
	overflow: hidden;
	background: #f3f2f1;
`;

const ThumbnailImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const FaviconPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f3f2f1;
	color: #605e5c;
	font-size: 32px;
	font-weight: 600;
`;

const CloseButton = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #605e5c;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;

	&:hover {
		background: #f3f2f1;
	}
`;

const TextContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const Title = styled.div`
	font-size: 15px;
	font-weight: 600;
	color: #323130;
	line-height: 1.4;
	margin-bottom: 4px;
	word-wrap: break-word;
`;

const Description = styled.div`
	font-size: 14px;
	color: #605e5c;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
`;

const Domain = styled.div`
	font-size: 12px;
	color: #605e5c;
	display: flex;
	align-items: center;
	gap: 6px;
`;

const Favicon = styled.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`;

/**
 * Microsoft Teams link preview component
 * Displays how content will appear when shared on Microsoft Teams
 *
 * @param props             - SocialPreviewProps
 * @param props.title
 * @param props.description
 * @param props.url
 * @param props.image
 * @param props.favicon
 * @param props.siteName
 * @param props.children
 */
export function TeamsPreview({
	title,
	description,
	url,
	image,
	favicon,
	siteName,
	children,
}: SocialPreviewProps): JSX.Element {
	const domain = React.useMemo(() => {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}, [url]);

	const truncatedTitle =
		title.length > 60 ? `${title.slice(0, 57)}...` : title;
	const truncatedDescription =
		description.length > 200
			? `${description.slice(0, 197)}...`
			: description;

	const displayDomain = siteName || domain;

	return (
		<PreviewContainer>
			<Label>Microsoft Teams</Label>
			<Card>
				<ContentWrapper>
					<Thumbnail>
						{children ||
							(image ? (
								<ThumbnailImage src={image} alt="" />
							) : (
								<FaviconPlaceholder>
									{displayDomain.charAt(0).toUpperCase()}
								</FaviconPlaceholder>
							))}
					</Thumbnail>
					<TextContent>
						<Title>{truncatedTitle}</Title>
						<Description>{truncatedDescription}</Description>
						<Domain>
							{favicon && <Favicon src={favicon} alt="" />}
							<span>{displayDomain}</span>
						</Domain>
					</TextContent>
				</ContentWrapper>
			</Card>
		</PreviewContainer>
	);
}

export default TeamsPreview;
