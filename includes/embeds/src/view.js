/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';

import './style.scss';

domReady(() => {
	const embedFooters = document.querySelectorAll(
		'.prc-platform__embed-footer'
	);

	embedFooters.forEach((embedFooter) => {
		const embedCodeButton = embedFooter.querySelector(
			'[aria-controls="prc-platform__embed-footer__code"]'
		);
		console.log(embedCodeButton);
		const embedCode = embedFooter.querySelector(
			'.prc-platform__embed-footer__code'
		);

		embedCodeButton.addEventListener('click', (e) => {
			e.stopPropagation();
			embedCode.classList.toggle('active');
		});
	});
});
