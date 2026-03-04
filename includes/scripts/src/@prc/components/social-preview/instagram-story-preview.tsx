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

const StoryContainer = styled.div`
	width: 270px;
	height: 480px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
	background: #000000;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const StoryImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const StoryPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 48px;
`;

const TopGradient = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 100px;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.6) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`;

const ProgressBar = styled.div`
	position: absolute;
	top: 8px;
	left: 8px;
	right: 8px;
	height: 2px;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 1px;
`;

const ProgressFill = styled.div`
	width: 30%;
	height: 100%;
	background: #ffffff;
	border-radius: 1px;
`;

const Header = styled.div`
	position: absolute;
	top: 16px;
	left: 12px;
	right: 12px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const ProfilePicture = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;
	border: 2px solid #ffffff;
	flex-shrink: 0;
	background: #ffffff;
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

const Username = styled.div`
	font-size: 13px;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const TimeAgo = styled.span`
	font-weight: 400;
	color: rgba(255, 255, 255, 0.7);
	margin-left: 6px;
`;

const BottomGradient = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120px;
	background: linear-gradient(
		to top,
		rgba(0, 0, 0, 0.6) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`;

const CaptionArea = styled.div`
	position: absolute;
	bottom: 16px;
	left: 12px;
	right: 60px;
`;

const Caption = styled.div`
	font-size: 14px;
	color: #ffffff;
	line-height: 1.4;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	word-wrap: break-word;
`;

const ReplyArea = styled.div`
	position: absolute;
	bottom: 16px;
	right: 12px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
`;

const ActionIcon = styled.div`
	color: #ffffff;
	font-size: 24px;
	cursor: pointer;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

/**
 * Instagram Story preview component
 * Displays how content will appear as an Instagram Story
 *
 * @param props                - InstagramPreviewProps
 * @param props.title
 * @param props.description
 * @param props.url
 * @param props.image
 * @param props.username
 * @param props.profilePicture
 */
export function InstagramStoryPreview({
	title = '',
	description = '',
	image,
	username = '',
	profilePicture,
}: InstagramPreviewProps): JSX.Element {
	const safeTitle = title || '';
	const safeDescription = description || '';
	const safeUsername = username || 'username';

	const truncatedCaption =
		safeDescription.length > 100
			? `${safeDescription.slice(0, 97)}...`
			: safeDescription;

	return (
		<PreviewContainer>
			<Label>Instagram Story</Label>
			<StoryContainer>
				{image ? (
					<StoryImage src={image} alt="" />
				) : (
					<StoryPlaceholder>📷</StoryPlaceholder>
				)}
				<TopGradient />
				<ProgressBar>
					<ProgressFill />
				</ProgressBar>
				<Header>
					<ProfilePicture>
						{profilePicture ? (
							<ProfileImage src={profilePicture} alt="" />
						) : (
							<ProfilePlaceholder>
								{safeUsername.charAt(0).toUpperCase()}
							</ProfilePlaceholder>
						)}
					</ProfilePicture>
					<Username>
						{safeUsername}
						<TimeAgo>12h</TimeAgo>
					</Username>
				</Header>
				<BottomGradient />
				<CaptionArea>
					<Caption>{truncatedCaption}</Caption>
				</CaptionArea>
				<ReplyArea>
					<ActionIcon>❤️</ActionIcon>
					<ActionIcon>💬</ActionIcon>
				</ReplyArea>
			</StoryContainer>
		</PreviewContainer>
	);
}

export default InstagramStoryPreview;
