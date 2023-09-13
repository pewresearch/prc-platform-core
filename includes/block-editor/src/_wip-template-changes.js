import { select, subscribe, dispatch } from '@wordpress/data

const postTypeStyleChanges = (postType) => {
	const blockEditor = document.querySelector(
		'.block-editor-block-list__layout.is-root-container',
	);

	if (
		null !== blockEditor &&
		['post', 'interactives', 'chart', 'fact-sheets', 'short-read'].includes(
			postType,
		)
	) {
		blockEditor.classList.add('post-content');
	}
};

const widePostTypes = [
	'template-block',
	'topic-page',
	'homepage',
	'page',
	'blockmeister_pattern',
];

// @TODO Redo this...
const watchForTemplateChange = (postType) => {
	const loadStyle = (id, url) => {
		if (document.head.querySelector(`link[id="${id}"]`)) {
			return;
		}
		// Get HTML head element
		const head = document.getElementsByTagName('HEAD')[0];

		// Create new link Element
		const link = document.createElement('link');

		// set the attributes for link element
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.id = id;
		link.href = url;
		// Append link element to HTML head
		head.appendChild(link);
	};

	subscribe(() => {
		// Need to figure out a better way to watch for a change here...
		const template = select('core/editor').getEditedPostAttribute('template');
		const pageStyle = document.head.querySelector(
			'link[id="prc-block-editor-page-css"]',
		);
		const sidebarStyle = document.head.querySelector(
			'link[id="prc-block-editor-sidebar-css"]',
		);
		const wideStyle = document.head.querySelector(
			'link[id="prc-block-editor-wide-css"]',
		);

		if ('page' === postType) {
			loadStyle(
				'prc-block-editor-page-css',
				'/wp-content/themes/prc_parent/src/gutenberg/editor-page.css?ver=5.4.2',
			);
		}

		if ('homepage' === postType) {
			loadStyle(
				'prc-block-editor-page-css',
				'/wp-content/themes/prc_parent/src/gutenberg/editor-wide.css?ver=5.4.2',
			);
		}

		if ('templates/template-sidebar.php' === template && 'page' !== postType) {
			// If the style already exists from a prior state change or from loading from saved data then do nothing and ensure its not disabled.
			if (null !== sidebarStyle) {
				sidebarStyle.disabled = false;
			} else {
				// If this is the first time we're matching these conditions then load the style.
				loadStyle(
					'prc-block-editor-sidebar-css',
					'https://www.pewresearch.org/wp-content/themes/prc_parent/src/gutenberg/editor-sidebar.css?ver=5.4.2',
				);
			}

			// If the wide style exists and it should not then disable it.
			if (null !== wideStyle) {
				wideStyle.disabled = true;
			}
		} else if (
			'templates/template-wide.php' === template ||
			'templates/template-new.php' === template
		) {
			if (null !== wideStyle) {
				wideStyle.disabled = false;
			} else {
				loadStyle(
					'prc-block-editor-wide-css',
					'https://www.pewresearch.org/wp-content/themes/prc_parent/src/gutenberg/editor-wide.css?ver=5.4.2',
				);
			}
			if (null !== sidebarStyle) {
				sidebarStyle.disabled = true;
			}
		} else {
			if (null !== sidebarStyle) {
				sidebarStyle.disabled = true;
			}
			if (null !== wideStyle) {
				if (!widePostTypes.includes(postType)) {
					wideStyle.disabled = true;
				} else {
					wideStyle.disabled = false;
				}
			}
		}
	});
};
