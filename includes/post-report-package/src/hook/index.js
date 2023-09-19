/**
 * Internal Dependencies
 */
import usePostReportPackage from './usePostReportPackage';
import useBackChapters from './useBackChapters';

function loadScript(slug, script) {
	if (!window.prcPostReportPackageHook[slug]) {
		window.prcPostReportPackageHook[slug] = script;
	}
}

window.prcPostReportPackageHook = {};

loadScript('usePostReportPackage', usePostReportPackage);
loadScript('useBackChapters', useBackChapters);
