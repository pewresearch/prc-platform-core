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

/**
 * Select a block module to statically display.
 * @param {Object}   props            Component props.
 * @param {Function} props.onSelect   Callback function to select a block module.
 * @param {Function} props.onClose    Callback function to close the modal.
 * @param {number}   props.selectedId The selected block module ID.
 * @param {number}   props.clientId   The block client ID.
 */
export default function SelectA({
	onSelect = () => {},
	onClose = () => {},
	selectedId = null,
	clientId,
}) {
	return (
		<EntityPatternModal
			{...{
				title: __('Choose a block module', 'prc-platform-core'),
				instructions: __(
					'Choosing a block module will always display it, overriding any block area or category queries.',
					'prc-platform-core'
				),
				entityType: POST_TYPE,
				entityTypeLabel: POST_TYPE_LABEL,
				onSelect,
				onClose,
				clientId,
				selectedId,
			}}
		/>
	);
}
