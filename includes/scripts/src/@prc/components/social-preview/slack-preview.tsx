/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { SlackPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family: Slack-Lato, Lato, appleLogo, sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #616061;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const MessageContainer = styled.div`
	background: #ffffff;
	max-width: 500px;
	padding: 8px 16px;
`;

const MessageHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 4px;
`;

const Avatar = styled.div`
	width: 36px;
	height: 36px;
	border-radius: 4px;
	overflow: hidden;
	flex-shrink: 0;
	background: #e8e8e8;
`;

const AvatarImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #4a154b;
	color: white;
	font-size: 14px;
	font-weight: 700;
`;

const HeaderInfo = styled.div`
	display: flex;
	align-items: baseline;
	gap: 6px;
`;

const DisplayName = styled.span`
	font-size: 15px;
	font-weight: 900;
	color: #1d1c1d;
`;

const Timestamp = styled.span`
	font-size: 12px;
	color: #616061;
`;

const MessageText = styled.div`
	font-size: 15px;
	color: #1d1c1d;
	line-height: 1.46668;
	margin-bottom: 4px;
	margin-left: 44px;
	word-wrap: break-word;
`;

const MessageLink = styled.a`
	color: #1264a3;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

const UnfurlCard = styled.div`
	margin-left: 44px;
	margin-top: 4px;
	border-left: 4px solid #e0e0e0;
	padding-left: 12px;
	max-width: 400px;
`;

const UnfurlHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 4px;
`;

const Favicon = styled.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`;

const FaviconPlaceholder = styled.div`
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 700;
	color: #616061;
`;

const SiteName = styled.span`
	font-size: 13px;
	font-weight: 700;
	color: #1d1c1d;
`;

const UnfurlTitle = styled.a`
	display: block;
	font-size: 15px;
	font-weight: 700;
	color: #1264a3;
	line-height: 1.375;
	margin-bottom: 4px;
	text-decoration: none;
	word-wrap: break-word;
	&:hover {
		text-decoration: underline;
	}
`;

const UnfurlDescription = styled.div`
	font-size: 15px;
	color: #1d1c1d;
	line-height: 1.46668;
	margin-bottom: 8px;
	word-wrap: break-word;
`;

const MetadataGrid = styled.div`
	display: flex;
	gap: 40px;
	margin-bottom: 8px;
`;

const MetadataItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const MetadataLabel = styled.span`
	font-size: 13px;
	font-weight: 700;
	color: #1d1c1d;
`;

const MetadataValue = styled.span`
	font-size: 13px;
	color: #1d1c1d;
`;

const UnfurlImage = styled.div`
	width: 100%;
	max-width: 360px;
	border-radius: 8px;
	overflow: hidden;
	background: #f8f8f8;
`;

const UnfurlImageImg = styled.img`
	width: 100%;
	height: auto;
	display: block;
`;

/**
 * Slack message with link unfurl preview component
 * Displays how content will appear when shared in Slack
 *
 * @param props                - SlackPreviewProps
 * @param props.title          - Title for the unfurl card
 * @param props.description    - Description for the unfurl card
 * @param props.url            - URL being shared
 * @param props.image          - Image URL for the unfurl card
 * @param props.favicon        - Favicon URL for the site
 * @param props.siteName       - Site name to display
 * @param props.children       - Optional custom content for image
 * @param props.displayName    - User display name
 * @param props.profilePicture - User avatar URL
 * @param props.messageText    - Message text content
 * @param props.timestamp      - Message timestamp
 * @param props.readingTime    - Estimated reading time
 * @param props.author         - Article author name
 */
export function SlackPreview({
	title,
	description,
	url,
	image,
	favicon,
	siteName,
	children,
	displayName = 'Slack User',
	profilePicture,
	messageText,
	timestamp = '1:36 PM',
	readingTime,
	author,
}: SlackPreviewProps): JSX.Element {
	const displaySiteName = React.useMemo(() => {
		if (siteName) {
			return siteName;
		}
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return 'Pew Research Center';
		}
	}, [siteName, url]);

	// Combine message text with URL, or just show URL
	const fullMessageText = messageText ? `${messageText} ` : '';

	// Check if we have any metadata to show
	const hasMetadata = readingTime || author;

	return (
		<PreviewContainer>
			<Label>Slack</Label>
			<MessageContainer>
				<MessageHeader>
					<Avatar>
						{profilePicture ? (
							<AvatarImage src={profilePicture} alt="" />
						) : (
							<AvatarPlaceholder>
								{displayName.charAt(0).toUpperCase()}
							</AvatarPlaceholder>
						)}
					</Avatar>
					<HeaderInfo>
						<DisplayName>{displayName}</DisplayName>
						<Timestamp>{timestamp}</Timestamp>
					</HeaderInfo>
				</MessageHeader>

				<MessageText>
					{fullMessageText}
					<MessageLink href={url}>{url}</MessageLink>
				</MessageText>

				<UnfurlCard>
					<UnfurlHeader>
						{favicon ? (
							<Favicon src={favicon} alt="" />
						) : (
							<FaviconPlaceholder>
								{displaySiteName.charAt(0).toUpperCase()}
							</FaviconPlaceholder>
						)}
						<SiteName>{displaySiteName}</SiteName>
					</UnfurlHeader>

					<UnfurlTitle href={url}>{title}</UnfurlTitle>

					<UnfurlDescription>{description}</UnfurlDescription>

					{hasMetadata && (
						<MetadataGrid>
							{readingTime && (
								<MetadataItem>
									<MetadataLabel>
										Est. reading time
									</MetadataLabel>
									<MetadataValue>{readingTime}</MetadataValue>
								</MetadataItem>
							)}
							{author && (
								<MetadataItem>
									<MetadataLabel>Written by</MetadataLabel>
									<MetadataValue>{author}</MetadataValue>
								</MetadataItem>
							)}
						</MetadataGrid>
					)}

					{(image || children) && (
						<UnfurlImage>
							{children || <UnfurlImageImg src={image} alt="" />}
						</UnfurlImage>
					)}
				</UnfurlCard>
			</MessageContainer>
		</PreviewContainer>
	);
}

export default SlackPreview;
