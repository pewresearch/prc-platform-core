/* eslint-disable camelcase */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Icon, IconButton, Spinner } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

// Little hack to store details in memory so as the component re-renders we dont have to fetch each time, pseudo redux.
window.prcBylineTermIds = window.prcBylineTermIds || [];

const ICON_SIZE = 20;

// randomly return either John or Jane
function getRandomName() {
	return 0.5 < Math.random() ? 'John Doe' : 'Jane Doe';
}

// randomy return either Research Assistant or Senior Researcher
function getRandomJobTitle() {
	return 0.5 < Math.random() ? 'Research Assistant' : 'Senior Researcher';
}

function BylineItem({ value, onRemove, lastItem = false }) {
	const { termId } = value;
	const [bylineName, setName] = useState(getRandomName());
	const [bylineJobTitle, setJobTitle] = useState(getRandomJobTitle());
	const [loading, toggleLoading] = useState(true);

	useEffect(() => {
		if (false === termId) {
			// Exit early, initial state.
			toggleLoading(false);
			return;
		}
		const bylineTerms = window.prcBylineTermIds;
		const i = bylineTerms.find((t) => t.termId === termId);
		// if window.prcBylineTermIds has a value for this termId, then use it, otherwise do apiFetch and get the name from the rest api.
		if (i) {
			setName(i.name);
			setJobTitle(i.jobTitle);
		} else {
			apiFetch({
				path: `/wp/v2/bylines/${termId}`,
			}).then((byline) => {
				const { staffName, staffJobTitle } = byline.staffInfo;
				setName(staffName);
				setJobTitle(staffJobTitle);
				// if window.prcBylineTermIds doesnt have the termId, then add it
				if (!bylineTerms.find((t) => t.termId === termId)) {
					window.prcBylineTermIds.push({
						termId,
						name: staffName,
						jobTitle: staffJobTitle,
					});
				}
			});
		}
	}, [termId]);

	// When the name is neither John nor Jane then we know we have a real name and can set loading to false.
	useEffect(() => {
		if (!['John Doe', 'Jane Doe'].includes(bylineName)) {
			toggleLoading(false);
		}
	}, [bylineName]);

	return (
		<div
			className="prc-byline-item"
			style={{
				background: 'white',
				paddingBottom: '0.5em',
				marginBottom: '0.5em',
				borderBottom: lastItem ? 'none' : '1px solid #EAEAEA',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', cursor: 'grab' }}>
					<Icon icon={dragHandle} size={ICON_SIZE} />
				</div>
				<div
					style={{
						display: 'flex',
						flexGrow: '1',
						paddingLeft: '1em',
						cursor: 'grab',
					}}
				>
					{loading ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Spinner /> <span>Loading...</span>
						</div>
					) : (
						<span>
							<strong>{__(`${bylineName}`)}</strong>
							{0 < bylineJobTitle.length && (
								<span
									style={{
										display: 'block',
										fontSize: '0.8em',
										color: '#666',
									}}
								>
									{__(`${bylineJobTitle}`)}
								</span>
							)}
						</span>
					)}
				</div>
				<div style={{ display: 'flex' }}>
					<IconButton
						icon="no-alt"
						onClick={() => {
							onRemove();
							// remove from window.prcBylineTermIds
							const i = window.prcBylineTermIds.findIndex(
								(t) => t.termId === termId,
							);
							if (-1 < i) {
								window.prcBylineTermIds.splice(i, 1);
							}
						}}
						size={ICON_SIZE}
					/>
				</div>
			</div>
			{false === termId && <p style={{ color: 'red' }}>Term not found</p>}
		</div>
	);
}

export default BylineItem;
