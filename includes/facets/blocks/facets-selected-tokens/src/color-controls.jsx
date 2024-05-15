/* eslint-disable no-restricted-imports */
/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

export default function ColorControls({ colors, clientId }) {
	const colorProps = useMultipleOriginColorsAndGradients();

	const colorSettings = useMemo(() => {
		const {
			tokenBorderColor,
			setTokenBorderColor,
			tokenBackgroundColor,
			setTokenBackgroundColor,
		} = colors;

		return [
			{
				colorValue: tokenBorderColor?.color,
				onColorChange: setTokenBorderColor,
				label: __('Token Border Color'),
			},
			{
				colorValue: tokenBackgroundColor?.color,
				onColorChange: setTokenBackgroundColor,
				label: __('Token Background Color'),
			},
		];
	}, [colors]);

	return (
		<InspectorControls group="color">
			<ColorGradientSettingsDropdown
				settings={colorSettings}
				panelId={clientId}
				hasColorsOrGradients={false}
				disableCustomColors={false}
				__experimentalIsRenderedInSidebar
				{...colorProps}
			/>
		</InspectorControls>
	);
}
