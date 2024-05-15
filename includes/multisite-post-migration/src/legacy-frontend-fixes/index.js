/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

domReady(() => {
	// Fix figure in figure image migration issue:
	document.querySelectorAll('figure').forEach((figure) => {
		const a = figure.querySelector('a');
		const emptyPs = figure.querySelectorAll('p:empty');
		const nestedFigure = figure.querySelector('figure');

		if (a && emptyPs.length === 2 && nestedFigure) {
			a.remove();
			emptyPs.forEach((p) => {
				p.remove();
			});
			figure.replaceWith(nestedFigure);
			nestedFigure.appendChild(figure);
		}
	});
});
