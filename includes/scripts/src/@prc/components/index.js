// UI Components
import DetachBlocksToolbarControl from './detach-blocks-toolbar-control';
import EntityCreateNewModal from './entity-create-new-modal';
import EntityPatternModal from './entity-pattern-modal';
import HeadingLevelToolbar from './heading-level-toolbar';
import InspectorPopoutPanel from './inspector-popout-panel';
import LoadingIndicator from './loading-indicator';
import MailchimpSegmentList from './mailchimp-segment-list';
import MailchimpSegmentSelect from './mailchimp-segment-select';
import MarkedRangeControl from './marked-range-control';
import MediaDropZone from './media-dropzone';
import MediaImageSlot from './media-image-slot';
import Placeholder from './placeholder';
import ResponsiveImage from './responsive-image';
import StyledComponentContext from './styled-component-context';
import TaxonomySelect from './taxonomy-select';
import TermSelect from './term-select';
import Transition from './transition';
import WPEntitySearch from './wp-entity-search';

// Store-related
import {
	registerListStore,
	ListStoreItem,
	actions,
	reducer,
} from './list-store';

// InnerBlocks utilities
import {
	InnerBlocksAsContextTemplate,
	getInnerBlocksContextAsQuery,
	InnerBlocksAsSyncedContent,
} from './innerblocks';

// URL Search
import { URLSearchField, URLSearchToolbar } from './url-search';

// Initialize global namespace
window.prcComponents = {};

// Helper to register components/scripts
function loadScript(slug, script) {
	if (!window.prcComponents[slug]) {
		window.prcComponents[slug] = script;
	}
}

// UI Components
loadScript('DetachBlocksToolbarControl', DetachBlocksToolbarControl);
loadScript('EntityCreateNewModal', EntityCreateNewModal);
loadScript('EntityPatternModal', EntityPatternModal);
loadScript('HeadingLevelToolbar', HeadingLevelToolbar);
loadScript('InspectorPopoutPanel', InspectorPopoutPanel);
loadScript('LoadingIndicator', LoadingIndicator);
loadScript('MailchimpSegmentList', MailchimpSegmentList);
loadScript('MailchimpSegmentSelect', MailchimpSegmentSelect);
loadScript('MarkedRangeControl', MarkedRangeControl);
loadScript('MediaDropZone', MediaDropZone);
loadScript('MediaImageSlot', MediaImageSlot);
loadScript('Placeholder', Placeholder);
loadScript('ResponsiveImage', ResponsiveImage);
loadScript('StyledComponentContext', StyledComponentContext);
loadScript('TaxonomySelect', TaxonomySelect);
loadScript('TermSelect', TermSelect);
loadScript('Transition', Transition);
loadScript('WPEntitySearch', WPEntitySearch);

// Store-related
loadScript('registerListStore', registerListStore);
loadScript('ListStoreItem', ListStoreItem);
loadScript('listStoreActions', actions);
loadScript('listStoreReducer', reducer);

// InnerBlocks utilities
loadScript('InnerBlocksAsContextTemplate', InnerBlocksAsContextTemplate);
loadScript('getInnerBlocksContextAsQuery', getInnerBlocksContextAsQuery);
loadScript('InnerBlocksAsSyncedContent', InnerBlocksAsSyncedContent);

// URL Search
loadScript('URLSearchField', URLSearchField);
loadScript('URLSearchToolbar', URLSearchToolbar);

console.log('Loading @prc/components...', window.prcComponents);
