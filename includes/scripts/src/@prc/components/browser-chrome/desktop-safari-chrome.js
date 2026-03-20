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
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	width: 100%;
	min-height: 600px;
`;

const TitleBar = styled.div`
	background-color: #f6f6f6;
	border-bottom: 1px solid #d1d1d1;
	display: flex;
	flex-direction: column;
`;

const TrafficLights = styled.div`
	display: flex;
	gap: 8px;
	padding: 12px 16px 0;
`;

const TrafficLight = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
`;

const TrafficLightClose = styled(TrafficLight)`
	background-color: #ff5f56;
	border: 1px solid #e0443e;
`;

const TrafficLightMinimize = styled(TrafficLight)`
	background-color: #ffbd2e;
	border: 1px solid #dea123;
`;

const TrafficLightMaximize = styled(TrafficLight)`
	background-color: #27c93f;
	border: 1px solid #1aab29;
`;

const Toolbar = styled.div`
	display: flex;
	align-items: center;
	padding: 8px 16px 12px;
	gap: 16px;
`;

const NavButtons = styled.div`
	display: flex;
	gap: 12px;
`;

const NavButton = styled.div`
	width: 12px;
	height: 12px;
	border-top: 2px solid #888;
	border-right: 2px solid #888;
	opacity: 0.5;
`;

const NavButtonBack = styled(NavButton)`
	transform: rotate(-135deg);
`;

const NavButtonForward = styled(NavButton)`
	transform: rotate(45deg);
`;

const UrlBar = styled.div`
	flex: 1;
	background-color: #fff;
	border: 1px solid #d1d1d1;
	border-radius: 6px;
	padding: 6px 12px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const UrlText = styled.span`
	font-size: 13px;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Actions = styled.div`
	display: flex;
	gap: 16px;
`;

const ActionButton = styled.div`
	width: 16px;
	height: 16px;
	background-color: #888;
	opacity: 0.5;
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
`;

const ActionButtonShare = styled(ActionButton)`
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>');
`;

const ActionButtonNewTab = styled(ActionButton)`
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>');
`;

const Content = styled.div`
	flex: 1;
	overflow-y: auto;
	position: relative;
	display: flex;
	flex-direction: column;
`;

export default function DesktopSafariChrome({ children, url }) {
	const displayUrl = useMemo(() => {
		if (url) {
			return url;
		}
		return typeof window !== 'undefined' ? window.location.hostname : '';
	}, [url]);

	return (
		<ChromeContainer>
			<TitleBar>
				<TrafficLights>
					<TrafficLightClose />
					<TrafficLightMinimize />
					<TrafficLightMaximize />
				</TrafficLights>
				<Toolbar>
					<NavButtons>
						<NavButtonBack />
						<NavButtonForward />
					</NavButtons>
					<UrlBar>
						<UrlText>{displayUrl}</UrlText>
					</UrlBar>
					<Actions>
						<ActionButtonShare />
						<ActionButtonNewTab />
					</Actions>
				</Toolbar>
			</TitleBar>
			<Content>{children}</Content>
		</ChromeContainer>
	);
}
