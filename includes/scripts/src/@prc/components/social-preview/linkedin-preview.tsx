/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { LinkedInPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family:
		-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Oxygen Sans', Cantarell,
		'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
		'Lucida Grande', Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #666666;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const PostContainer = styled.div`
	background: #ffffff;
	max-width: 552px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow:
		0 0 0 1px rgba(0, 0, 0, 0.08),
		0 2px 4px rgba(0, 0, 0, 0.08);
	overflow: hidden;
`;

const ProfileHeader = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 16px 0;
`;

const Avatar = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #e0e0e0;
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
	background: #0a66c2;
	color: white;
	font-size: 18px;
	font-weight: 700;
`;

const HeaderContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const DisplayName = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #000000;
	line-height: 1.33;
`;

const FollowerCount = styled.div`
	font-size: 12px;
	color: #666666;
	line-height: 1.33;
`;

const TimestampRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: #666666;
	line-height: 1.33;
`;

const GlobeIcon = styled.svg`
	width: 12px;
	height: 12px;
`;

const MoreButton = styled.button`
	background: none;
	border: none;
	padding: 4px;
	cursor: pointer;
	color: #666666;
	font-size: 20px;
	line-height: 1;
	margin-left: auto;
`;

const PostContent = styled.div`
	padding: 12px 16px;
	font-size: 14px;
	color: #000000;
	line-height: 1.43;
	white-space: pre-wrap;
	word-wrap: break-word;
`;

const PostLink = styled.a`
	color: #0a66c2;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

const LinkCard = styled.div`
	display: flex;
	background: #f3f2ef;
	border-top: 1px solid #e0e0e0;
	border-bottom: 1px solid #e0e0e0;
	cursor: pointer;
	&:hover {
		background: #e9e8e4;
	}
`;

const LinkCardThumbnail = styled.div`
	width: 128px;
	height: 128px;
	flex-shrink: 0;
	background: #e0e0e0;
	overflow: hidden;
`;

const LinkCardImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const LinkCardContent = styled.div`
	flex: 1;
	padding: 12px;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const LinkCardTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #000000;
	line-height: 1.43;
	margin-bottom: 4px;
	word-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const LinkCardDomain = styled.div`
	font-size: 12px;
	color: #666666;
`;

const ReactionsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 16px;
	border-bottom: 1px solid #e0e0e0;
`;

const ReactionsLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const ReactionIcons = styled.div`
	display: flex;
	align-items: center;
`;

const ReactionIcon = styled.div<{ color: string; zIndex: number }>`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: ${(props) => props.color};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	margin-left: -4px;
	border: 1px solid #ffffff;
	z-index: ${(props) => props.zIndex};
	&:first-of-type {
		margin-left: 0;
	}
`;

const ReactionCount = styled.span`
	font-size: 12px;
	color: #666666;
	margin-left: 4px;
`;

const EngagementStats = styled.div`
	font-size: 12px;
	color: #666666;
`;

const ActionButtonsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 4px 8px;
`;

const ActionButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	background: none;
	border: none;
	padding: 12px 8px;
	cursor: pointer;
	color: #666666;
	font-size: 14px;
	font-weight: 600;
	border-radius: 4px;
	transition: background-color 0.2s;
	flex: 1;

	&:hover {
		background-color: rgba(0, 0, 0, 0.08);
		color: #000000;
	}

	svg {
		width: 24px;
		height: 24px;
	}
`;

/**
 * LinkedIn post preview component
 * Displays how content will appear when shared on LinkedIn
 *
 * @param props                - LinkedInPreviewProps
 * @param props.title          - Title for the link card
 * @param props.description    - Description (unused, for compatibility)
 * @param props.url            - URL being shared
 * @param props.image          - Image URL for the link card
 * @param props.children       - Optional custom content for thumbnail
 * @param props.displayName    - Page/company display name
 * @param props.profilePicture - Avatar/logo URL
 * @param props.followers      - Follower count text
 * @param props.postText       - Post content text
 * @param props.timestamp      - Post timestamp
 * @param props.shortUrl       - Shortened URL to display
 * @param props.reactions      - Reaction count
 * @param props.comments       - Comment count
 * @param props.reposts        - Repost count
 */
export function LinkedInPreview({
	title,
	url,
	image,
	children,
	displayName = 'Pew Research Center',
	profilePicture,
	followers = '166,244 followers',
	postText,
	timestamp = '6h',
	shortUrl,
	reactions = 0,
	comments = 0,
	reposts = 0,
}: LinkedInPreviewProps): JSX.Element {
	const domain = React.useMemo(() => {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}, [url]);

	// Build engagement stats string
	const engagementParts: string[] = [];
	if (comments > 0) {
		engagementParts.push(`${comments} comment${comments !== 1 ? 's' : ''}`);
	}
	if (reposts > 0) {
		engagementParts.push(`${reposts} repost${reposts !== 1 ? 's' : ''}`);
	}
	const engagementText = engagementParts.join(' · ');

	// Display URL - use shortUrl if provided, otherwise use the actual url
	const displayUrl = shortUrl || url;

	return (
		<PreviewContainer>
			<Label>LinkedIn</Label>
			<PostContainer>
				<ProfileHeader>
					<Avatar>
						{profilePicture ? (
							<AvatarImage src={profilePicture} alt="" />
						) : (
							<AvatarPlaceholder>
								{displayName.charAt(0).toUpperCase()}
							</AvatarPlaceholder>
						)}
					</Avatar>
					<HeaderContent>
						<DisplayName>{displayName}</DisplayName>
						<FollowerCount>{followers}</FollowerCount>
						<TimestampRow>
							<span>{timestamp}</span>
							<span>·</span>
							<GlobeIcon viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z" />
							</GlobeIcon>
						</TimestampRow>
					</HeaderContent>
					<MoreButton aria-label="More options">···</MoreButton>
				</ProfileHeader>

				<PostContent>
					{postText}
					{postText && '\n\n'}
					Full analysis: <PostLink href={url}>{displayUrl}</PostLink>
				</PostContent>

				<LinkCard>
					{(image || children) && (
						<LinkCardThumbnail>
							{children || <LinkCardImage src={image} alt="" />}
						</LinkCardThumbnail>
					)}
					<LinkCardContent>
						<LinkCardTitle>{title}</LinkCardTitle>
						<LinkCardDomain>{domain}</LinkCardDomain>
					</LinkCardContent>
				</LinkCard>

				{(reactions > 0 || engagementText) && (
					<ReactionsRow>
						<ReactionsLeft>
							{reactions > 0 && (
								<>
									<ReactionIcons>
										<ReactionIcon color="#0a66c2" zIndex={2}>
											👍
										</ReactionIcon>
										<ReactionIcon color="#dfb71c" zIndex={1}>
											👏
										</ReactionIcon>
									</ReactionIcons>
									<ReactionCount>{reactions}</ReactionCount>
								</>
							)}
						</ReactionsLeft>
						{engagementText && (
							<EngagementStats>{engagementText}</EngagementStats>
						)}
					</ReactionsRow>
				)}

				<ActionButtonsRow>
					<ActionButton aria-label="Like">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.87V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z" />
						</svg>
						<span>Like</span>
					</ActionButton>

					<ActionButton aria-label="Comment">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L18 16a4.79 4.79 0 003-4.42z" />
						</svg>
						<span>Comment</span>
					</ActionButton>

					<ActionButton aria-label="Repost">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M13.96 5H6c-1.1 0-2 .9-2 2v5h2V7h7.96l-2.46 2.46 1.41 1.42L17.79 6l-4.88-4.88-1.41 1.42L13.96 5zM10.04 19H18c1.1 0 2-.9 2-2v-5h-2v5h-7.96l2.46-2.46-1.41-1.42L6.21 18l4.88 4.88 1.41-1.42L10.04 19z" />
						</svg>
						<span>Repost</span>
					</ActionButton>

					<ActionButton aria-label="Send">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z" />
						</svg>
						<span>Send</span>
					</ActionButton>
				</ActionButtonsRow>
			</PostContainer>
		</PreviewContainer>
	);
}

export default LinkedInPreview;
