import Autocomplete from './autocomplete';
import HeadingLevelToolbar from './heading-level-toolbar';
import {
	InnerBlocksAsContextTemplate,
	getInnerBlocksContextAsQuery,
	InnerBlocksAsSyncedContent,
} from './innerblocks';
import InspectorPopoutPanel from './inspector-popout-panel';
import {
	registerListStore,
	ListStoreItem,
	actions,
	reducer,
} from './list-store';
import MarkedRangeControl from './marked-range-control';
import MediaDropZone from './media-dropzone';
import MediaImageSlot from './media-image-slot';
import Placeholder from './placeholder';
import Select from './select';
import Slider from './slider';
import TaxonomySelect from './taxonomy-select';
import TermSelect from './term-select';
import Transition from './transition';
import { URLSearchField, URLSearchToolbar } from './url-search';
import WPEntitySearch from './wp-entity-search';
import MailchimpSegmentSelect from './mailchimp-segment-select';
import MailchimpSegmentList from './mailchimp-segment-list';
import EntityPatternModal from './entity-pattern-modal';
import EntityCreateNewModal from './entity-create-new-modal';
import LoadingIndicator from './loading-indicator';
import DetachBlocksToolbarControl from './detach-blocks-toolbar-control';
import StyledComponentContext from './styled-component-context';

function loadScript(slug, script) {
	if (!window.prcComponents[slug]) {
		window.prcComponents[slug] = script;
	}
}

window.prcComponents = {};

loadScript('Autocomplete', Autocomplete);
loadScript('HeadingLevelToolbar', HeadingLevelToolbar);
loadScript('InnerBlocksAsContextTemplate', InnerBlocksAsContextTemplate);
loadScript('getInnerBlocksContextAsQuery', getInnerBlocksContextAsQuery);
loadScript('InnerBlocksAsSyncedContent', InnerBlocksAsSyncedContent);
loadScript('InspectorPopoutPanel', InspectorPopoutPanel);
loadScript('registerListStore', registerListStore);
loadScript('ListStoreItem', ListStoreItem);
loadScript('listStoreActions', actions);
loadScript('listStoreReducer', reducer);
loadScript('MarkedRangeControl', MarkedRangeControl);
loadScript('MediaDropZone', MediaDropZone);
loadScript('MediaImageSlot', MediaImageSlot);
loadScript('Placeholder', Placeholder);
loadScript('Select', Select);
loadScript('Slider', Slider);
loadScript('TermSelect', TermSelect);
loadScript('TaxonomySelect', TaxonomySelect);
loadScript('Transition', Transition);
loadScript('URLSearchField', URLSearchField);
loadScript('URLSearchToolbar', URLSearchToolbar);
loadScript('WPEntitySearch', WPEntitySearch);
loadScript('InnerBlocksAsContextTemplate', InnerBlocksAsContextTemplate);
loadScript('getInnerBlocksContextAsQuery', getInnerBlocksContextAsQuery);
loadScript('InnerBlocksAsSyncedContent', InnerBlocksAsSyncedContent);
loadScript('MailchimpSegmentSelect', MailchimpSegmentSelect);
loadScript('MailchimpSegmentList', MailchimpSegmentList);
loadScript('EntityPatternModal', EntityPatternModal);
loadScript('EntityCreateNewModal', EntityCreateNewModal);
loadScript('LoadingIndicator', LoadingIndicator);
loadScript('DetachBlocksToolbarControl', DetachBlocksToolbarControl);
loadScript('StyledComponentContext', StyledComponentContext);

console.log('Loading @prc/components...', window.prcComponents);
