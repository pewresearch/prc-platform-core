/**
 * External Dependencies
 */
import * as React from 'react';

/**
 * Internal Dependencies
 */
import type {
	SocialPreviewProps,
	SocialNetwork,
	SocialPreviewWrapperProps,
	InstagramPreviewProps,
} from './types';
import { FacebookPreview } from './facebook-preview';
import { TwitterPreview } from './twitter-preview';
import { ThreadsPreview } from './threads-preview';
import { BlueskyPreview } from './bluesky-preview';
import { SlackPreview } from './slack-preview';
import { DiscordPreview } from './discord-preview';
import { GooglePreview } from './google-preview';
import { LinkedInPreview } from './linkedin-preview';
import { TeamsPreview } from './teams-preview';
import { InstagramStoryPreview } from './instagram-story-preview';
import { InstagramReelPreview } from './instagram-reel-preview';
import { InstagramPostPreview } from './instagram-post-preview';

/**
 * Component map for social network previews
 */
const PreviewComponents: Record<
	SocialNetwork,
	React.ComponentType<SocialPreviewProps>
> = {
	facebook: FacebookPreview,
	twitter: TwitterPreview,
	threads: ThreadsPreview,
	bluesky: BlueskyPreview,
	slack: SlackPreview,
	discord: DiscordPreview,
	google: GooglePreview,
	linkedin: LinkedInPreview,
	teams: TeamsPreview,
	'instagram-story': InstagramStoryPreview,
	'instagram-reel': InstagramReelPreview,
	'instagram-post': InstagramPostPreview,
};

/**
 * SocialPreview wrapper component
 * Renders previews for multiple social networks
 *
 * @param props          - SocialPreviewWrapperProps
 * @param props.networks
 */
export function SocialPreview({
	networks = ['facebook', 'twitter', 'google'],
	...previewProps
}: SocialPreviewWrapperProps): JSX.Element {
	return (
		<>
			{networks.map((network) => {
				const PreviewComponent = PreviewComponents[network];
				if (!PreviewComponent) {
					return null;
				}
				return <PreviewComponent key={network} {...previewProps} />;
			})}
		</>
	);
}

// Export individual preview components
export { FacebookPreview } from './facebook-preview';
export { TwitterPreview } from './twitter-preview';
export { ThreadsPreview } from './threads-preview';
export { BlueskyPreview } from './bluesky-preview';
export { SlackPreview } from './slack-preview';
export { DiscordPreview } from './discord-preview';
export { GooglePreview } from './google-preview';
export { LinkedInPreview } from './linkedin-preview';
export { TeamsPreview } from './teams-preview';
export { InstagramStoryPreview } from './instagram-story-preview';
export { InstagramReelPreview } from './instagram-reel-preview';
export { InstagramPostPreview } from './instagram-post-preview';

// Export types
export type {
	SocialPreviewProps,
	SocialNetwork,
	SocialPreviewWrapperProps,
	InstagramPreviewProps,
} from './types';
