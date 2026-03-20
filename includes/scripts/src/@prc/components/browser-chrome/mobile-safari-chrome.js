/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import styled from '@emotion/styled';

const ChromeContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 40px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 430px;
	margin: 0 auto;
	height: 100%;
	min-height: 800px;
`;

const StatusBar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 24px 0;
	font-size: 14px;
	font-weight: 600;
	color: #000;
	height: 44px;
	box-sizing: border-box;
`;

const Icons = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
`;

const IconBase = styled.div`
	background-color: #000;
	opacity: 0.8;
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
`;

const IconSignal = styled(IconBase)`
	width: 16px;
	height: 10px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" width="3" height="10" rx="1"/></svg>');
`;

const IconWifi = styled(IconBase)`
	width: 16px;
	height: 12px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path d="M8 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-4.5c-1.8 0-3.5.6-4.8 1.6l-1.3-1.6C3.6 6.1 5.7 5.5 8 5.5s4.4.6 6.1 2l-1.3 1.6c-1.3-1-3-1.6-4.8-1.6zm0-4.5C5.1 3 2.5 4 .5 5.8L0 4.5C2.2 2.5 5 1.5 8 1.5s5.8 1 8 3l-.5 1.3C13.5 4 10.9 3 8 3z"/></svg>');
`;

const IconBattery = styled(IconBase)`
	width: 24px;
	height: 12px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12"><rect x="1" y="1" width="20" height="10" rx="3" fill="none" stroke="black" stroke-width="1"/><rect x="3" y="3" width="16" height="6" rx="1"/><path d="M22 4v4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/></svg>');
`;

const UrlBarContainer = styled.div`
	padding: 8px 16px;
	background-color: #f8f8f8;
	border-bottom: 1px solid #e0e0e0;
`;

const UrlBar = styled.div`
	background-color: #e8e8ed;
	border-radius: 12px;
	padding: 10px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const UrlText = styled.span`
	font-size: 14px;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Content = styled.div`
	flex: 1;
	overflow-y: auto;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const BottomSafeArea = styled.div`
	height: 34px;
	background-color: #f8f8f8;
	border-top: 1px solid #e0e0e0;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: env(safe-area-inset-bottom);
`;

const HomeIndicator = styled.div`
	width: 134px;
	height: 5px;
	background-color: #000;
	border-radius: 100px;
	opacity: 0.8;
`;

export default function MobileSafariChrome({ children, url }) {
	const displayUrl = useMemo(() => {
		if (url) {
			return url;
		}
		return typeof window !== 'undefined' ? window.location.hostname : '';
	}, [url]);

	return (
		<ChromeContainer>
			<StatusBar>
				<div>9:41</div>
				<Icons>
					<IconSignal />
					<IconWifi />
					<IconBattery />
				</Icons>
			</StatusBar>
			<UrlBarContainer>
				<UrlBar>
					<UrlText>{displayUrl}</UrlText>
				</UrlBar>
			</UrlBarContainer>
			<Content>{children}</Content>
			<BottomSafeArea>
				<HomeIndicator />
			</BottomSafeArea>
		</ChromeContainer>
	);
}
