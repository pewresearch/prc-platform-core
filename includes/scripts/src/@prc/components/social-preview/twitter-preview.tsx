/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { TwitterPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
		sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #536471;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const TweetContainer = styled.div`
	background: #ffffff;
	max-width: 500px;
	padding: 12px 16px;
	border: 1px solid #cfd9de;
	border-radius: 16px;
`;

const ProfileHeader = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 4px;
`;

const Avatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #cfd9de;
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
	background: #1d9bf0;
	color: white;
	font-size: 18px;
	font-weight: 700;
`;

const HeaderContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const NameRow = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 4px;
	line-height: 1.25;
`;

const DisplayName = styled.span`
	font-size: 15px;
	font-weight: 700;
	color: #0f1419;
`;

const VerifiedBadge = styled.svg`
	width: 18px;
	height: 18px;
	flex-shrink: 0;
`;

const HandleAndTime = styled.span`
	font-size: 15px;
	color: #536471;
`;

const MoreButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	color: #536471;
	cursor: pointer;
	margin-left: auto;
	font-size: 18px;
	line-height: 1;
`;

const TweetText = styled.div`
	font-size: 15px;
	color: #0f1419;
	line-height: 1.4;
	margin-bottom: 12px;
	word-wrap: break-word;
	white-space: pre-wrap;
`;

const LinkCard = styled.div`
	border: 1px solid #cfd9de;
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.03);
	}
`;

const CardImageContainer = styled.div`
	width: 100%;
	height: 0;
	padding-bottom: 52.25%; /* Twitter card aspect ratio */
	position: relative;
	overflow: hidden;
	background: #f7f9f9;
`;

const CardImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const TitleOverlay = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.77);
	padding: 8px 12px;
`;

const OverlayTitle = styled.div`
	font-size: 15px;
	font-weight: 400;
	color: #ffffff;
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const DomainText = styled.div`
	padding: 12px;
	font-size: 13px;
	color: #536471;
`;

const EngagementRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 12px;
	max-width: 425px;
`;

const ActionButton = styled.button`
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	color: #536471;
	font-size: 13px;
	transition: color 0.2s;

	&:hover {
		color: #1d9bf0;
	}

	svg {
		width: 18.75px;
		height: 18.75px;
	}
`;

const ActionGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

/**
 * Twitter/X post preview component
 * Displays how content will appear when shared on Twitter/X
 *
 * @param props                - TwitterPreviewProps
 * @param props.title          - Title for the link card
 * @param props.description    - Description (fallback for tweet text)
 * @param props.url            - URL for the shared link
 * @param props.image          - Image URL for the link card
 * @param props.children       - Optional custom content for image container
 * @param props.displayName    - Display name shown in header
 * @param props.username       - Twitter handle
 * @param props.profilePicture - Avatar image URL
 * @param props.tweetText      - Actual tweet content
 * @param props.verified       - Show verified badge
 * @param props.timestamp      - Relative timestamp
 * @param props.likes          - Number of likes
 * @param props.replies        - Number of replies
 */
export function TwitterPreview({
	title,
	description,
	url,
	image,
	children,
	displayName = 'Pew Research Center',
	username = 'pewresearch',
	profilePicture,
	tweetText,
	verified = true,
	timestamp = '1m',
	likes = 0,
	replies = 0,
}: TwitterPreviewProps): JSX.Element {
	const domain = React.useMemo(() => {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}, [url]);

	const truncatedTitle =
		title.length > 70 ? `${title.slice(0, 67)}...` : title;

	// Use tweetText if provided, otherwise fall back to description for tweet content
	const displayTweetText = tweetText || description;

	// Format the handle (add @ if not present)
	const formattedHandle = username.startsWith('@')
		? username
		: `@${username}`;

	return (
		<PreviewContainer>
			<Label>Twitter / X</Label>
			<TweetContainer>
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
						<NameRow>
							<DisplayName>{displayName}</DisplayName>
							{verified && (
								<VerifiedBadge
									viewBox="0 0 22 22"
									aria-label="Verified account"
								>
									<path
										fill="#1d9bf0"
										d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
									/>
								</VerifiedBadge>
							)}
							<HandleAndTime>
								{formattedHandle} · {timestamp}
							</HandleAndTime>
						</NameRow>
					</HeaderContent>
					<MoreButton aria-label="More">···</MoreButton>
				</ProfileHeader>

				<TweetText>{displayTweetText}</TweetText>

				<LinkCard>
					{(image || children) && (
						<CardImageContainer>
							{children || <CardImage src={image} alt="" />}
							<TitleOverlay>
								<OverlayTitle>{truncatedTitle}</OverlayTitle>
							</TitleOverlay>
						</CardImageContainer>
					)}
					<DomainText>From {domain}</DomainText>
				</LinkCard>

				<EngagementRow>
					<ActionButton aria-label="Reply">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
								fill="currentColor"
							/>
						</svg>
						{replies > 0 && <span>{replies}</span>}
					</ActionButton>

					<ActionButton aria-label="Repost">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
								fill="currentColor"
							/>
						</svg>
					</ActionButton>

					<ActionButton aria-label="Like">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
								fill="currentColor"
							/>
						</svg>
						{likes > 0 && <span>{likes}</span>}
					</ActionButton>

					<ActionButton aria-label="View analytics">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"
								fill="currentColor"
							/>
						</svg>
					</ActionButton>

					<ActionGroup>
						<ActionButton aria-label="Bookmark">
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"
									fill="currentColor"
								/>
							</svg>
						</ActionButton>
						<ActionButton aria-label="Share">
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
									fill="currentColor"
								/>
							</svg>
						</ActionButton>
					</ActionGroup>
				</EngagementRow>
			</TweetContainer>
		</PreviewContainer>
	);
}

export default TwitterPreview;
