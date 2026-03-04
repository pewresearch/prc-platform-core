/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { BlueskyPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
		sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #0085ff;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const PostContainer = styled.div`
	background: #ffffff;
	max-width: 500px;
	padding: 16px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
`;

const ProfileHeader = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 10px;
	margin-bottom: 8px;
`;

const Avatar = styled.div`
	width: 42px;
	height: 42px;
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
	background: #0085ff;
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
	gap: 4px;
	line-height: 1.25;
`;

const DisplayName = styled.span`
	font-size: 15px;
	font-weight: 700;
	color: #000000;
`;

const VerifiedBadge = styled.svg`
	width: 16px;
	height: 16px;
	flex-shrink: 0;
`;

const Handle = styled.div`
	font-size: 14px;
	color: #666666;
	margin-top: 1px;
`;

const PostText = styled.div`
	font-size: 15px;
	color: #000000;
	line-height: 1.5;
	margin-bottom: 12px;
	word-wrap: break-word;
	white-space: pre-wrap;
`;

const LinkCard = styled.div`
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.02);
	}
`;

const CardImageContainer = styled.div`
	width: 100%;
	height: 0;
	padding-bottom: 52.5%;
	position: relative;
	overflow: hidden;
	background: #f5f5f5;
`;

const CardImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const CardContent = styled.div`
	padding: 12px;
`;

const CardTitle = styled.div`
	font-size: 15px;
	font-weight: 700;
	color: #000000;
	line-height: 1.3;
	margin-bottom: 4px;
	word-wrap: break-word;
`;

const CardDescription = styled.div`
	font-size: 14px;
	color: #666666;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const CardDomain = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	color: #666666;
`;

const GlobeIcon = styled.svg`
	width: 14px;
	height: 14px;
	flex-shrink: 0;
`;

const TimestampRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 12px 0;
	margin-top: 12px;
	border-top: 1px solid #e0e0e0;
	font-size: 14px;
	color: #666666;
`;

const TimestampSeparator = styled.span`
	color: #666666;
`;

const ReplyIndicator = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const StatsRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 12px 0;
	border-top: 1px solid #e0e0e0;
	font-size: 14px;
	color: #666666;
`;

const StatItem = styled.span`
	& strong {
		font-weight: 700;
		color: #000000;
	}
`;

const EngagementRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 12px;
	border-top: 1px solid #e0e0e0;
`;

const ActionButton = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	color: #666666;
	font-size: 13px;
	border-radius: 25%;
	transition: all 0.2s;

	&:hover {
		background-color: rgba(0, 133, 255, 0.1);
		color: #0085ff;
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

const ActionCount = styled.span`
	font-size: 13px;
	min-width: 16px;
`;

/**
 * Bluesky post preview component
 * Displays how content will appear when shared on Bluesky
 *
 * @param props                - BlueskyPreviewProps
 * @param props.title          - Title for the link card
 * @param props.description    - Description for the link card
 * @param props.url            - URL for the shared link
 * @param props.image          - Image URL for the link card
 * @param props.children       - Optional custom content for image container
 * @param props.displayName    - Display name shown in header
 * @param props.handle         - Bluesky handle
 * @param props.profilePicture - Avatar image URL
 * @param props.postText       - Actual post content
 * @param props.verified       - Show verified badge
 * @param props.timestamp      - Full timestamp
 * @param props.likes          - Number of likes
 * @param props.reposts        - Number of reposts
 * @param props.quotes         - Number of quotes
 * @param props.replies        - Number of replies
 * @param props.saves          - Number of saves
 */
export function BlueskyPreview({
	title,
	description,
	url,
	image,
	children,
	displayName = 'Pew Research Center',
	handle = 'pewresearch.org',
	profilePicture,
	postText,
	verified = true,
	timestamp = '10:51 AM · Dec 9, 2025',
	likes = 0,
	reposts = 0,
	quotes = 0,
	replies = 0,
	saves = 0,
}: BlueskyPreviewProps): JSX.Element {
	const domain = React.useMemo(() => {
		try {
			const hostname = new URL(url).hostname;
			return hostname.startsWith('www.') ? hostname : `www.${hostname}`;
		} catch {
			return url;
		}
	}, [url]);

	const truncatedTitle =
		title.length > 70 ? `${title.slice(0, 67)}...` : title;
	const truncatedDescription =
		description.length > 150
			? `${description.slice(0, 147)}...`
			: description;

	// Use postText if provided, otherwise fall back to description for post content
	const displayPostText = postText || description;

	// Format the handle (add @ if not present)
	const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

	// Check if there are any engagement stats to show
	const hasStats = reposts > 0 || quotes > 0 || likes > 0 || saves > 0;

	return (
		<PreviewContainer>
			<Label>Bluesky</Label>
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
									viewBox="0 0 24 24"
									aria-label="Verified account"
								>
									<path
										fill="#0085ff"
										d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
									/>
								</VerifiedBadge>
							)}
						</NameRow>
						<Handle>{formattedHandle}</Handle>
					</HeaderContent>
				</ProfileHeader>

				<PostText>{displayPostText}</PostText>

				<LinkCard>
					{(image || children) && (
						<CardImageContainer>
							{children || <CardImage src={image} alt="" />}
						</CardImageContainer>
					)}
					<CardContent>
						<CardTitle>{truncatedTitle}</CardTitle>
						<CardDescription>{truncatedDescription}</CardDescription>
						<CardDomain>
							<GlobeIcon viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
							</GlobeIcon>
							<span>{domain}</span>
						</CardDomain>
					</CardContent>
				</LinkCard>

				<TimestampRow>
					<span>{timestamp}</span>
					<TimestampSeparator>·</TimestampSeparator>
					<ReplyIndicator>
						<GlobeIcon viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
						</GlobeIcon>
						<span>Everybody can reply</span>
					</ReplyIndicator>
				</TimestampRow>

				<EngagementRow>
					<ActionButton aria-label="Reply">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
								fill="currentColor"
							/>
						</svg>
						{replies > 0 && <ActionCount>{replies}</ActionCount>}
					</ActionButton>

					<ActionButton aria-label="Repost">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
								fill="currentColor"
							/>
						</svg>
						{reposts > 0 && <ActionCount>{reposts}</ActionCount>}
					</ActionButton>

					<ActionButton aria-label="Like">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
								fill="currentColor"
							/>
						</svg>
						{likes > 0 && <ActionCount>{likes}</ActionCount>}
					</ActionButton>

					<ActionButton aria-label="Save">
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

					<ActionButton aria-label="More options">
						<svg viewBox="0 0 24 24" fill="none">
							<path
								d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
								fill="currentColor"
							/>
						</svg>
					</ActionButton>
				</EngagementRow>
			</PostContainer>
		</PreviewContainer>
	);
}

export default BlueskyPreview;
