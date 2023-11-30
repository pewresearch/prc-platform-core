/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render, createPortal } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { ProvideFacets } from './context';
import Facets from './Facets';
import TopOfLoop from './TopOfLoop';

function initFacets() {
	/**
	 * The data for facets comes from the global variable window.prcFacets.data
	 * which gets cached by the app server on the page by Varnish.
	 *
	 * @see /plugins/prc-facets/inc/api.php for data model.
	 */
	const { prcFacets } = window;
	const { data } = prcFacets;

	// eslint-disable-next-line no-undef
	const loop = document.querySelector('.ui.divided.paginated.items');
	// eslint-disable-next-line no-undef
	const facetsAttach = document.getElementById('js-prc-facets-attach');
	const groupBlock = facetsAttach.parentElement;
	// eslint-disable-next-line no-undef
	const topOfResultsAttach = document.getElementById('js-pagination-results');

	if (window.prcFacets.debug.enabled) {
		console.log('prcFacets pre-render pipeline', {
			loop,
			facetsAttach,
			topOfResultsAttach,
			data,
		});
	}

	if (null !== loop && null !== facetsAttach && false !== prcFacets) {
		setTimeout(() => {
			render(
				<ProvideFacets seed={data} domRef={groupBlock}>
					{null !== topOfResultsAttach
						? createPortal(<TopOfLoop />, topOfResultsAttach)
						: null}
					<Facets />
				</ProvideFacets>,
				facetsAttach
			);
		}, 500);
	}
}

domReady(() => {
	initFacets();
});
