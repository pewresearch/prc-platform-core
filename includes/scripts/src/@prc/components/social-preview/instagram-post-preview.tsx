/**
 * External Dependencies
 */
import * as React from 'react';
import styled from '@emotion/styled';

/**
 * Internal Dependencies
 */
import type { InstagramPreviewProps } from './types';

const PreviewContainer = styled.div`
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #737373;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const PostCard = styled.div`
	width: 400px;
	background: #ffffff;
	border: 1px solid #dbdbdb;
	border-radius: 8px;
	overflow: hidden;
`;

const PostHeader = styled.div`
	display: flex;
	align-items: center;
	padding: 12px;
	gap: 10px;
`;

const ProfilePicture = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #fafafa;
`;

const ProfileImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ProfilePlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	font-weight: 600;
`;

const HeaderInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

const Username = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #262626;
`;

const Location = styled.div`
	font-size: 12px;
	color: #262626;
`;

const MoreButton = styled.button`
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	font-size: 16px;
	color: #262626;
`;

const ImageContainer = styled.div`
	width: 100%;
	aspect-ratio: 1 / 1;
	background: #fafafa;
	overflow: hidden;
`;

const PostImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ImagePlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #fafafa 0%, #efefef 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 64px;
	color: #dbdbdb;
`;

const EngagementBar = styled.div`
	display: flex;
	align-items: center;
	padding: 12px;
	gap: 16px;
`;

const ActionButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	font-size: 24px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const SaveButton = styled(ActionButton)`
	margin-left: auto;
`;

const LikeCount = styled.div`
	padding: 0 12px;
	font-size: 14px;
	font-weight: 600;
	color: #262626;
`;

const CaptionArea = styled.div`
	padding: 0 12px 12px;
`;

const CaptionText = styled.div`
	font-size: 14px;
	color: #262626;
	line-height: 1.5;
	word-wrap: break-word;
`;

const CaptionUsername = styled.span`
	font-weight: 600;
	margin-right: 6px;
`;

const MoreLink = styled.span`
	color: #8e8e8e;
	cursor: pointer;
`;

const ViewComments = styled.div`
	padding: 0 12px 8px;
	font-size: 14px;
	color: #8e8e8e;
	cursor: pointer;
`;

const TimeAgo = styled.div`
	padding: 0 12px 12px;
	font-size: 10px;
	color: #8e8e8e;
	text-transform: uppercase;
	letter-spacing: 0.2px;
`;

/**
 * Format number to short form (1.2K, 1.2M, etc.)
 */
function formatCount(num: number): string {
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
	}
	return num.toLocaleString();
}

/**
 * Instagram Post preview component
 * Displays how content will appear as an Instagram Post
 *
 * @param props                - InstagramPreviewProps
 * @param props.title
 * @param props.description
 * @param props.url
 * @param props.image
 * @param props.username
 * @param props.profilePicture
 * @param props.likes
 * @param props.comments
 * @param props.siteName
 */
export function InstagramPostPreview({
	title = '',
	description = '',
	image,
	username = '',
	profilePicture,
	likes = 0,
	comments = 0,
	siteName,
}: InstagramPreviewProps): JSX.Element {
	const safeDescription = description || '';
	const safeUsername = username || 'username';

	const maxCaptionLength = 125;
	const showMore = safeDescription.length > maxCaptionLength;
	const truncatedCaption = showMore
		? `${safeDescription.slice(0, maxCaptionLength)}...`
		: safeDescription;

	return (
		<PreviewContainer>
			<Label>Instagram Post</Label>
			<PostCard>
				<PostHeader>
					<ProfilePicture>
						{profilePicture ? (
							<ProfileImage src={profilePicture} alt="" />
						) : (
							<ProfilePlaceholder>
								{safeUsername.charAt(0).toUpperCase()}
							</ProfilePlaceholder>
						)}
					</ProfilePicture>
					<HeaderInfo>
						<Username>{safeUsername}</Username>
						{siteName && <Location>{siteName}</Location>}
					</HeaderInfo>
					<MoreButton>⋯</MoreButton>
				</PostHeader>
				<ImageContainer>
					{image ? (
						<PostImage src={image} alt="" />
					) : (
						<ImagePlaceholder>📷</ImagePlaceholder>
					)}
				</ImageContainer>
				<EngagementBar>
					<ActionButton aria-label="Like">🤍</ActionButton>
					<ActionButton aria-label="Comment">💬</ActionButton>
					<ActionButton aria-label="Share">📤</ActionButton>
					<SaveButton aria-label="Save">🔖</SaveButton>
				</EngagementBar>
				<LikeCount>{formatCount(likes)} likes</LikeCount>
				<CaptionArea>
					<CaptionText>
						<CaptionUsername>{safeUsername}</CaptionUsername>
						{truncatedCaption}
						{showMore && <MoreLink> more</MoreLink>}
					</CaptionText>
				</CaptionArea>
				{comments > 0 && (
					<ViewComments>
						View all {formatCount(comments)} comments
					</ViewComments>
				)}
				<TimeAgo>2 hours ago</TimeAgo>
			</PostCard>
		</PreviewContainer>
	);
}

export default InstagramPostPreview;
