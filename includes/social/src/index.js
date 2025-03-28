import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';

domReady(() => {
	const resetAdminBarButton = document.getElementById(
		'wp-admin-bar-reset-shortlink'
	);
	if (resetAdminBarButton) {
		const link = resetAdminBarButton.querySelector('a.ab-item');
		if (link) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const restUrl = link.href;
				apiFetch({
					url: restUrl,
					method: 'POST',
					data: { shortlink: 'true' },
				})
					.then((response) => {
						window.location.reload();
					})
					.catch((error) => {
						alert('Failed to update shortlink');
						console.error('Failed to update shortlink');
					});
			});
		}
	}
});
