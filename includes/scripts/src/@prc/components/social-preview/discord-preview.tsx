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
	font-family: Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #72767d;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const Embed = styled.div`
	border-left: 4px solid #5865f2;
	border-radius: 4px;
	background: #2f3136;
	max-width: 520px;
	overflow: hidden;
`;

const ContentWrapper = styled.div`
	display: flex;
	gap: 16px;
	padding: 12px 8px 12px 12px;
`;

const Thumbnail = styled.div`
	flex-shrink: 0;
	width: 80px;
	height: 80px;
	border-radius: 4px;
	overflow: hidden;
	background: #202225;
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
	background: #202225;
	color: #72767d;
	font-size: 24px;
	font-weight: 600;
`;

const TextContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const Title = styled.div`
	font-size: 16px;
	font-weight: 600;
	color: #ffffff;
	line-height: 1.375;
	margin-bottom: 4px;
	word-wrap: break-word;
`;

const Description = styled.div`
	font-size: 14px;
	color: #dcddde;
	line-height: 1.375;
	margin-bottom: 8px;
	word-wrap: break-word;
`;

const Footer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 8px;
`;

const Favicon = styled.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`;

const Domain = styled.div`
	font-size: 12px;
	color: #72767d;
	font-weight: 500;
`;

/**
 * Discord embed preview component
 * Displays how content will appear when shared on Discord
 *
 * @param props - SocialPreviewProps
 */
export function DiscordPreview({
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
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}, [url]);

	const truncatedTitle =
		title.length > 256 ? `${title.slice(0, 253)}...` : title;
	const truncatedDescription =
		description.length > 2048 ? `${description.slice(0, 2045)}...` : description;

	const displayDomain = siteName || domain;

	return (
		<PreviewContainer>
			<Label>Discord</Label>
			<Embed>
				<ContentWrapper>
				<Thumbnail>
					{children || (image ? (
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
						<Footer>
							{favicon && <Favicon src={favicon} alt="" />}
							<Domain>{displayDomain}</Domain>
						</Footer>
					</TextContent>
				</ContentWrapper>
			</Embed>
		</PreviewContainer>
	);
}

export default DiscordPreview;
