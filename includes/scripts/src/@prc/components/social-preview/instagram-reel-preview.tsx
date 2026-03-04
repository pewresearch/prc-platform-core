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

const ReelContainer = styled.div`
	width: 270px;
	height: 480px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
	background: #000000;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ReelImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ReelPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #405de6 0%, #833ab4 50%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 48px;
`;

const PlayButton = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60px;
	height: 60px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: rgba(0, 0, 0, 0.7);
	}
`;

const PlayIcon = styled.div`
	width: 0;
	height: 0;
	border-left: 20px solid #ffffff;
	border-top: 12px solid transparent;
	border-bottom: 12px solid transparent;
	margin-left: 4px;
`;

const TopGradient = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 80px;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.5) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`;

const Header = styled.div`
	position: absolute;
	top: 12px;
	left: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ReelBadge = styled.div`
	background: rgba(0, 0, 0, 0.5);
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 600;
	color: #ffffff;
	display: flex;
	align-items: center;
	gap: 4px;
`;

const ReelIcon = styled.span`
	font-size: 12px;
`;

const BottomGradient = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 180px;
	background: linear-gradient(
		to top,
		rgba(0, 0, 0, 0.7) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`;

const ContentArea = styled.div`
	position: absolute;
	bottom: 16px;
	left: 12px;
	right: 50px;
`;

const ProfileRow = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
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
	font-size: 12px;
	font-weight: 600;
`;

const Username = styled.div`
	font-size: 13px;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const FollowButton = styled.button`
	background: transparent;
	border: 1px solid #ffffff;
	border-radius: 8px;
	padding: 4px 12px;
	font-size: 12px;
	font-weight: 600;
	color: #ffffff;
	cursor: pointer;
	margin-left: auto;
`;

const Caption = styled.div`
	font-size: 13px;
	color: #ffffff;
	line-height: 1.4;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	word-wrap: break-word;
	margin-bottom: 8px;
`;

const AudioRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const AudioIcon = styled.span`
	font-size: 12px;
`;

const AudioText = styled.div`
	font-size: 12px;
	color: #ffffff;
	opacity: 0.9;
`;

const SideActions = styled.div`
	position: absolute;
	bottom: 100px;
	right: 12px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
`;

const ActionButton = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
`;

const ActionIcon = styled.div`
	font-size: 24px;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ActionCount = styled.div`
	font-size: 11px;
	color: #ffffff;
	font-weight: 500;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

/**
 * Format number to short form (1.2K, 1.2M, etc.)
 */
function formatCount(num: number): string {
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toString();
}

/**
 * Instagram Reel preview component
 * Displays how content will appear as an Instagram Reel
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
 */
export function InstagramReelPreview({
	title = '',
	description = '',
	image,
	username = '',
	profilePicture,
	likes = 0,
	comments = 0,
}: InstagramPreviewProps): JSX.Element {
	const safeDescription = description || '';
	const safeUsername = username || 'username';

	const truncatedCaption =
		safeDescription.length > 150
			? `${safeDescription.slice(0, 147)}...`
			: safeDescription;

	return (
		<PreviewContainer>
			<Label>Instagram Reel</Label>
			<ReelContainer>
				{image ? (
					<ReelImage src={image} alt="" />
				) : (
					<ReelPlaceholder>🎬</ReelPlaceholder>
				)}
				<TopGradient />
				<Header>
					<ReelBadge>
						<ReelIcon>🎞️</ReelIcon>
						Reels
					</ReelBadge>
				</Header>
				<PlayButton>
					<PlayIcon />
				</PlayButton>
				<BottomGradient />
				<ContentArea>
					<ProfileRow>
						<ProfilePicture>
							{profilePicture ? (
								<ProfileImage src={profilePicture} alt="" />
							) : (
								<ProfilePlaceholder>
									{safeUsername.charAt(0).toUpperCase()}
								</ProfilePlaceholder>
							)}
						</ProfilePicture>
						<Username>{safeUsername}</Username>
						<FollowButton>Follow</FollowButton>
					</ProfileRow>
					<Caption>{truncatedCaption}</Caption>
					<AudioRow>
						<AudioIcon>🎵</AudioIcon>
						<AudioText>Original audio</AudioText>
					</AudioRow>
				</ContentArea>
				<SideActions>
					<ActionButton>
						<ActionIcon>🤍</ActionIcon>
						<ActionCount>{formatCount(likes)}</ActionCount>
					</ActionButton>
					<ActionButton>
						<ActionIcon>💬</ActionIcon>
						<ActionCount>{formatCount(comments)}</ActionCount>
					</ActionButton>
					<ActionButton>
						<ActionIcon>📤</ActionIcon>
					</ActionButton>
					<ActionButton>
						<ActionIcon>⋯</ActionIcon>
					</ActionButton>
				</SideActions>
			</ReelContainer>
		</PreviewContainer>
	);
}

export default InstagramReelPreview;
