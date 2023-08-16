/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render, Fragment, useMemo, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { ProvideAttachments } from './context';
import AdminColumnButton from './AdminColumnButton';
import AttachmentsModal from './Modal';

import './style.scss';

const AdminColumnAttachmentsReport = ({ postId, postType }) => {
	const [hovered, setIsHovered] = useState(false);

	const handleHover = () => {
		if (!hovered) {
			console.log('Button hovered over for the first time!');
			setIsHovered(true);
		}
	};

	const initialized = useMemo(() => {
		return hovered;
	}, [hovered]);

	return (
		<ProvideAttachments
			postId={postId}
			postType={postType}
			enabled={initialized}
		>
			<AdminColumnButton
				initialized={initialized}
				handleHover={handleHover}
			/>
		</ProvideAttachments>
	);
};

const FrontendAttachmentsReport = ({ postId, postType }) => {
	return (
		<ProvideAttachments postId={postId} postType={postType} enabled={true}>
			<AttachmentsModal
				onClose={() => {
					// Redirect to the current url but remove the ?attachmentsReport=true from the end
					window.location = window.location.href.replace(
						'?attachmentsReport=true',
						''
					);
				}}
			/>
		</ProvideAttachments>
	);
};

function initFrontend() {
	const attach = document.getElementById(
		'js-prc-attachments-report-frontend'
	);
	if (attach) {
		const { posttype, postid } = attach.dataset;
		const postType = posttype;
		const postId = postid;
		render(
			<FrontendAttachmentsReport postId={postId} postType={postType} />,
			attach
		);
	}
}

function initButtons() {
	const buttons = document.querySelectorAll(
		'.prc-view-attachments-report-button'
	);
	buttons.forEach((button) => {
		const { posttype, postid } = button.dataset;
		const postType = posttype;
		const postId = postid;
		render(
			<AdminColumnAttachmentsReport
				postId={postId}
				postType={postType}
			/>,
			button
		);
	});
}

domReady(() => {
	if (document.querySelector('.prc-view-attachments-report-button')) {
		initButtons();
	}
	if (document.getElementById('js-prc-attachments-report-frontend')) {
		initFrontend();
	}
});
