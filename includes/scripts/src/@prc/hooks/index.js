import useClientWidth from './use-client-width';
import useDebounce from './use-debounce';
import useFetch from './use-fetch';
import useKeyPress from './use-keypress';
import useHasSelectedInnerBlock from './use-has-innerblock-selected';
import useLocalStorage from './use-local-storage';
import useMultiEntityRecords from './use-multi-entity-records';
import useTaxonomy from './use-taxonomy';
import useWindowSize from './use-window-size';
import useAfterPreview from './use-after-preview';
import useAfterPublish from './use-after-publish';
import usePostIdsAsOptions from './use-postids-as-options';
import useDeviceBoundAttribute from './use-device-bound-attribute';

function loadScript(slug, script) {
	if (!window.prcHooks[slug]) {
		window.prcHooks[slug] = script;
	}
}

window.prcHooks = {};

loadScript('useClientWidth', useClientWidth);
loadScript('useDebounce', useDebounce);
loadScript('useFetch', useFetch);
loadScript('useKeyPress', useKeyPress);
loadScript('useLocalStorage', useLocalStorage);
loadScript('useWindowSize', useWindowSize);
loadScript('useTaxonomy', useTaxonomy);
loadScript('useHasSelectedInnerBlock', useHasSelectedInnerBlock);
loadScript('useMultiEntityRecords', useMultiEntityRecords);
loadScript('useAfterPreview', useAfterPreview);
loadScript('useAfterPublish', useAfterPublish);
loadScript('usePostIdsAsOptions', usePostIdsAsOptions);
loadScript('useDeviceBoundAttribute', useDeviceBoundAttribute);

console.log('Loading @prc/hooks...', window.prcHooks);
