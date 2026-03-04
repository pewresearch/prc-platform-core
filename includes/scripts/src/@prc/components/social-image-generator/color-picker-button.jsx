/**
 * Color Picker Button Component
 *
 * A button that displays a color indicator and opens a color picker popover.
 */

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import {
	Button,
	Flex,
	FlexItem,
	ColorPicker,
	Popover,
	ColorIndicator,
} from '@wordpress/components';

/**
 * Color Picker Button Component.
 * Displays a color indicator that opens a color picker popover.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.color    - The current color value.
 * @param {Function} props.onChange - Callback when color changes.
 * @param {string}   props.label    - Label for the color picker.
 * @return {JSX.Element} The color picker button component.
 */
export default function ColorPickerButton({ color, onChange, label }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="prc-social-image-generator__color-picker">
			<span
				style={{
					fontSize: '11px',
					fontWeight: 500,
					textTransform: 'uppercase',
					display: 'block',
					marginBottom: '8px',
				}}
			>
				{label}
			</span>
			<Flex gap={2}>
				<FlexItem>
					<Button
						onClick={() => setIsOpen(!isOpen)}
						style={{
							padding: '4px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							background: '#fff',
						}}
					>
						<ColorIndicator colorValue={color} />
					</Button>
				</FlexItem>
				<FlexItem>
					<span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
						{color}
					</span>
				</FlexItem>
			</Flex>
			{isOpen && (
				<Popover
					placement="left-start"
					onClose={() => setIsOpen(false)}
				>
					<div style={{ padding: '16px' }}>
						<ColorPicker
							color={color}
							onChange={onChange}
							enableAlpha={false}
						/>
					</div>
				</Popover>
			)}
		</div>
	);
}
