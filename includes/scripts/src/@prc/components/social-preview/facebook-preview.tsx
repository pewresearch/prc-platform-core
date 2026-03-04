/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { FacebookPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family: Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #65676b;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const PostContainer = styled.div`
	background: #ffffff;
	max-width: 500px;
	border: 1px solid #dadde1;
	border-radius: 8px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`;

const ProfileHeader = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 16px 0;
`;

const Avatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #e4e6eb;
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
	background: #0866ff;
	color: white;
	font-size: 16px;
	font-weight: 700;
`;

const HeaderContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const NameRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const DisplayName = styled.span`
	font-size: 15px;
	font-weight: 600;
	color: #050505;
	line-height: 1.33;
`;

const VerifiedBadge = styled.svg`
	width: 15px;
	height: 15px;
	flex-shrink: 0;
`;

const TimestampRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	color: #65676b;
	line-height: 1.23;
`;

const GlobeIcon = styled.svg`
	width: 12px;
	height: 12px;
`;

const MoreButton = styled.button`
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	color: #65676b;
	font-size: 20px;
	line-height: 1;
	margin-left: auto;
	border-radius: 50%;
	&:hover {
		background-color: #f0f2f5;
	}
`;

const PostContent = styled.div`
	padding: 4px 16px 12px;
	font-size: 15px;
	color: #050505;
	line-height: 1.33;
	word-wrap: break-word;
`;

const PostText = styled.span`
	white-space: pre-wrap;
`;

const SeeMore = styled.span`
	font-weight: 600;
	color: #050505;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

const ImageContainer = styled.div`
	width: 100%;
	background: #f0f2f5;
`;

const PostImage = styled.img`
	width: 100%;
	height: auto;
	display: block;
`;

const ReactionsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 16px;
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

const ReactionIcon = styled.div<{ bg: string; zIndex: number }>`
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: ${(props) => props.bg};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	margin-left: -4px;
	border: 2px solid #ffffff;
	z-index: ${(props) => props.zIndex};
	&:first-of-type {
		margin-left: 0;
	}
`;

const ReactionCount = styled.span`
	font-size: 15px;
	color: #65676b;
	margin-left: 4px;
`;

const EngagementStats = styled.div`
	font-size: 15px;
	color: #65676b;
`;

const ActionButtonsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 4px 8px;
	border-top: 1px solid #dadde1;
`;

const ActionButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	background: none;
	border: none;
	padding: 12px 4px;
	cursor: pointer;
	color: #65676b;
	font-size: 15px;
	font-weight: 600;
	border-radius: 4px;
	transition: background-color 0.2s;
	flex: 1;

	&:hover {
		background-color: #f0f2f5;
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

/**
 * Facebook post preview component
 * Displays how content will appear when shared on Facebook
 *
 * @param props                - FacebookPreviewProps
 * @param props.description    - Description (fallback for postText)
 * @param props.image          - Image URL
 * @param props.children       - Optional custom content for image
 * @param props.displayName    - Page display name
 * @param props.profilePicture - Avatar URL
 * @param props.postText       - Post content text
 * @param props.timestamp      - Post timestamp
 * @param props.verified       - Show verified badge
 * @param props.reactions      - Reaction count
 * @param props.comments       - Comment count
 * @param props.shares         - Share count
 */
export function FacebookPreview({
	description,
	image,
	children,
	displayName = 'Pew Research Center',
	profilePicture,
	postText,
	timestamp = '5h',
	verified = true,
	reactions = 0,
	comments = 0,
	shares = 0,
}: FacebookPreviewProps): JSX.Element {
	// Use postText if provided, otherwise use description
	const displayText = postText || description;

	// Truncate text and show "See more" if needed
	const maxLength = 200;
	const shouldTruncate = displayText.length > maxLength;
	const truncatedText = shouldTruncate
		? displayText.slice(0, maxLength)
		: displayText;

	// Build engagement stats string
	const engagementParts: string[] = [];
	if (comments > 0) {
		engagementParts.push(`${comments} comment${comments !== 1 ? 's' : ''}`);
	}
	if (shares > 0) {
		engagementParts.push(`${shares} share${shares !== 1 ? 's' : ''}`);
	}
	const engagementText = engagementParts.join('   ');

	// Check if we should show the reactions row
	const showReactionsRow = reactions > 0 || engagementText;

	return (
		<PreviewContainer>
			<Label>Facebook</Label>
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
						<NameRow>
							<DisplayName>{displayName}</DisplayName>
							{verified && (
								<VerifiedBadge
									viewBox="0 0 16 16"
									aria-label="Verified"
								>
									<circle
										cx="8"
										cy="8"
										r="8"
										fill="#0866ff"
									/>
									<path
										d="M6.53 9.97L4.5 7.94l-.88.89 2.91 2.91 6.24-6.24-.88-.89z"
										fill="#ffffff"
									/>
								</VerifiedBadge>
							)}
						</NameRow>
						<TimestampRow>
							<span>{timestamp}</span>
							<span>·</span>
							<GlobeIcon viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm5.91 7H11.3a14.2 14.2 0 0 0-.93-4.38A6 6 0 0 1 13.91 7zM8 14c-.58 0-1.57-1.85-1.74-5h3.48c-.17 3.15-1.16 5-1.74 5zm-1.74-7c.17-3.15 1.16-5 1.74-5s1.57 1.85 1.74 5zm-.63-4.38A14.2 14.2 0 0 0 4.7 7H2.09a6 6 0 0 1 3.54-4.38zM2.09 9H4.7a14.2 14.2 0 0 0 .93 4.38A6 6 0 0 1 2.09 9zm8.28 4.38a14.2 14.2 0 0 0 .93-4.38h2.61a6 6 0 0 1-3.54 4.38z" />
							</GlobeIcon>
						</TimestampRow>
					</HeaderContent>
					<MoreButton aria-label="More options">···</MoreButton>
				</ProfileHeader>

				<PostContent>
					<PostText>{truncatedText}</PostText>
					{shouldTruncate && <SeeMore>... See more</SeeMore>}
				</PostContent>

				{(image || children) && (
					<ImageContainer>
						{children || <PostImage src={image} alt="" />}
					</ImageContainer>
				)}

				{showReactionsRow && (
					<ReactionsRow>
						<ReactionsLeft>
							{reactions > 0 && (
								<>
									<ReactionIcons>
										<ReactionIcon bg="#0866ff" zIndex={3}>
											👍
										</ReactionIcon>
										<ReactionIcon bg="#f7b928" zIndex={2}>
											😢
										</ReactionIcon>
										<ReactionIcon bg="#f7b928" zIndex={1}>
											🤗
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
							<path d="M18.8 5.1c-1.7-1.7-4.5-1.7-6.2 0l-.6.6-.6-.6c-1.7-1.7-4.5-1.7-6.2 0-1.8 1.8-1.8 4.7 0 6.5l6.8 6.8 6.8-6.8c1.8-1.8 1.8-4.7 0-6.5z" />
						</svg>
						<span>Like</span>
					</ActionButton>

					<ActionButton aria-label="Comment">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.04 2 11c0 2.13.73 4.08 2 5.68V22l4.5-2.54c1.1.35 2.27.54 3.5.54 5.52 0 10-4.04 10-9s-4.48-9-10-9zm0 16c-1.13 0-2.21-.2-3.21-.57l-.53-.2-2.26 1.28v-2.46l-.5-.44C4.54 14.46 4 12.78 4 11c0-3.86 3.59-7 8-7s8 3.14 8 7-3.59 7-8 7z" />
						</svg>
						<span>Comment</span>
					</ActionButton>

					<ActionButton aria-label="Share">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2l-8 8h5v6h6v-6h5l-8-8zm-7 16v2h14v-2H5z" />
						</svg>
						<span>Share</span>
					</ActionButton>
				</ActionButtonsRow>
			</PostContainer>
		</PreviewContainer>
	);
}

export default FacebookPreview;
