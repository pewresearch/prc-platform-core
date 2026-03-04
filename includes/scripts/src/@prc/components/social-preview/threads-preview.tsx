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
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
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

const Card = styled.div`
	border: 1px solid #dbdbdb;
	border-radius: 12px;
	overflow: hidden;
	background: #ffffff;
	max-width: 400px;
`;

const ImageContainer = styled.div`
	width: 100%;
	height: 0;
	padding-bottom: 100%; /* Square aspect ratio for Threads */
	position: relative;
	overflow: hidden;
	background: #fafafa;
`;

const Image = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const Content = styled.div`
	padding: 12px;
`;

const Title = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #262626;
	line-height: 1.4;
	margin-bottom: 4px;
	word-wrap: break-word;
`;

const Description = styled.div`
	font-size: 14px;
	color: #737373;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
`;

const Domain = styled.div`
	font-size: 12px;
	color: #737373;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

/**
 * Threads link preview component
 * Displays how content will appear when shared on Threads
 *
 * @param props             - SocialPreviewProps
 * @param props.title
 * @param props.description
 * @param props.url
 * @param props.image
 */
export function ThreadsPreview({
	title,
	description,
	url,
	image,
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
		title.length > 60 ? `${title.slice(0, 57)}...` : title;
	const truncatedDescription =
		description.length > 100
			? `${description.slice(0, 97)}...`
			: description;

	return (
		<PreviewContainer>
			<Label>Threads</Label>
			<Card>
			{(image || children) && (
				<ImageContainer>
					{children || <Image src={image} alt="" />}
				</ImageContainer>
			)}
				<Content>
					<Title>{truncatedTitle}</Title>
					<Description>{truncatedDescription}</Description>
					<Domain>{domain}</Domain>
				</Content>
			</Card>
		</PreviewContainer>
	);
}

export default ThreadsPreview;
