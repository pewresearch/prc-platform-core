import
	Sorter
 from './sorter';

function loadScript(slug, script) {
	if (!window.prcControls[slug]) {
		window.prcControls[slug] = script;
	}
}

window.prcControls = {};

loadScript('Sorter', Sorter);

console.log('Loading @prc/controls...', window.prcControls);
