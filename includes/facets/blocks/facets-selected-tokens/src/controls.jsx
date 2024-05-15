/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */

/**
 * Internal Dependencies
 */
import ColorControls from './color-controls';

export default function Controls({
	attributes,
	setAttributes,
	context,
	colors,
	clientId,
}) {
	return <ColorControls colors={colors} clientId={clientId} />;
}
