/**
 * Internal Dependencies
 */
import Icon from './icon';
import IconLibraryIndex from './icon-library-index.json';
import './style.scss';

if (!window.prcIcons) {
	window.prcIcons = {
		Icon,
		IconLibraryIndex,
	};
}
