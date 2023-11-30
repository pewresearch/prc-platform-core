/**
 * External Dependencies
 */
import { EntityPatternModal } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';


/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL } from '../../constants';

export default function SelectA( {
	onSelect = () => {},
	onClose = () => {},
	selectedId = null,
	clientId,
} ) {
	return(
		<EntityPatternModal {...{
			title: __('Choose a block module', 'prc-platform-core'),
			instructions: __('Choosing a block module will always display it, overriding any block area or category queries.', 'prc-platform-core'),
			entityType: POST_TYPE,
			entityTypeLabel: POST_TYPE_LABEL,
			onSelect,
			onClose,
			clientId,
			selectedId,
		}}/>
	);
}
