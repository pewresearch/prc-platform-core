/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * useDeviceBoundAttribute
 * Bind an attribute value to the current device.
 *
 * @param {string} clientId      - The client ID of the block.
 * @param {string} attributeName - The name of the attribute to update.
 *
 * @return {Array} An array containing the current device attribute value and a function to update the attribute.
 * @example
 * const [maxWidth, setMaxWidth] = useDeviceBoundAttribute(clientId, 'maxWidth');
 * console.log(maxWidth);
 * setMaxWidth('100%');
 */
export default function useDeviceBoundAttribute(clientId, attributeName) {
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const { attributes, deviceType } = useSelect(
		(select) => {
			const device = select('core/editor').getDeviceType();
			return {
				attributes:
					select('core/block-editor').getBlockAttributes(clientId),
				deviceType: device.toLowerCase(),
			};
		},
		[clientId]
	);

	const attributeValue = attributes[attributeName] || {
		desktop: '',
		tablet: '',
		mobile: '',
	};
	const currentDeviceAttributeValue = attributeValue[deviceType] ?? '';

	const updateAttributeForCurrentDevice = (value) => {
		updateBlockAttributes(clientId, {
			[attributeName]: {
				...attributeValue,
				[deviceType]: value,
			},
		});
	};

	return [currentDeviceAttributeValue, updateAttributeForCurrentDevice];
}
