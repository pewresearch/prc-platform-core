/**
 * External Dependencies
 */
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';

/**
 * Internal Dependencies
 */
import './style.scss';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

loadScript('DataTable', DataTable);
loadScript('datatablesResponsiveDt', 'datatables.net-responsive-dt');
