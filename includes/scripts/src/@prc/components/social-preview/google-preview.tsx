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
	font-family: arial, sans-serif;
	margin-bottom: 1rem;
`;

const Label = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #70757a;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const Snippet = styled.div`
	max-width: 600px;
`;

const Header = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 3px;
`;

const FaviconContainer = styled.div`
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	margin-top: 2px;
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
	background: #f1f3f4;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 600;
	color: #70757a;
`;

const SiteInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

const Breadcrumb = styled.div`
	font-size: 14px;
	color: #202124;
	line-height: 1.3;
	margin-bottom: 1px;
`;

const Url = styled.div`
	font-size: 14px;
	color: #202124;
	line-height: 1.3;
	word-break: break-all;
`;

const Title = styled.h3`
	font-size: 20px;
	font-weight: 400;
	color: #1a0dab;
	line-height: 1.3;
	margin: 3px 0 0 0;
	padding: 0;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

const Meta = styled.div`
	font-size: 14px;
	color: #70757a;
	margin: 3px 0;
`;

const Description = styled.p`
	font-size: 14px;
	color: #4d5156;
	line-height: 1.58;
	margin: 3px 0 0 0;
	word-wrap: break-word;
`;

/**
 * Google search result preview component
 * Displays how content will appear in Google search results
 *
 * @param props - SocialPreviewProps
 */
export function GooglePreview({
	title,
	description,
	url,
	favicon,
	siteName,
}: SocialPreviewProps): JSX.Element {
	const domain = React.useMemo(() => {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}, [url]);

	const truncatedTitle =
		title.length > 60 ? `${title.slice(0, 57)}...` : title;
	const truncatedDescription =
		description.length > 160 ? `${description.slice(0, 157)}...` : description;

	const displayDomain = siteName || domain;

	return (
		<PreviewContainer>
			<Label>Google</Label>
			<Snippet>
				<Header>
					<FaviconContainer>
						{favicon ? (
							<Favicon src={favicon} alt="" />
						) : (
							<FaviconPlaceholder>
								{displayDomain.charAt(0).toUpperCase()}
							</FaviconPlaceholder>
						)}
					</FaviconContainer>
					<SiteInfo>
						<Breadcrumb>{displayDomain}</Breadcrumb>
						<Url>{url}</Url>
					</SiteInfo>
				</Header>
				<Title>{truncatedTitle}</Title>
				<Meta>
					<span>12 Sep 2025</span>
					<span> · </span>
				</Meta>
				<Description>{truncatedDescription}</Description>
			</Snippet>
		</PreviewContainer>
	);
}

export default GooglePreview;
