/**
 * Layout Editor Panels
 *
 * Sub-components for the social image generator layout editor.
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	Button,
	Flex,
	FlexItem,
	__experimentalNumberControl as NumberControl,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { image as imageIcon, update } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import ColorPickerButton from './color-picker-button';

/**
 * Default font family options for the title.
 * Consumers can pass custom options via the fontFamilyOptions prop.
 */
export const DEFAULT_FONT_FAMILY_OPTIONS = [
	{
		label: 'Georgia (Default)',
		value: "Georgia, 'Times New Roman', Times, serif",
	},
	{
		label: 'Franklin Gothic URW',
		value: "'franklin-gothic-urw', Verdana, Geneva, sans-serif",
	},
	{
		label: 'Abril Text',
		value: "'abril-text', Georgia, 'Times New Roman', Times, serif",
	},
];

/**
 * Color settings panel.
 *
 * @param {Object}   root0              - Component props.
 * @param {Object}   root0.layout       - Current layout state.
 * @param {Function} root0.updateLayout - Layout update callback.
 */
export function ColorPanel({ layout, updateLayout }) {
	return (
		<Panel>
			<PanelBody
				title={__('Colors', 'prc-platform-core')}
				initialOpen={true}
			>
				<PanelRow>
					<ColorPickerButton
						label={__('Background Color', 'prc-platform-core')}
						color={layout.backgroundColor}
						onChange={(color) =>
							updateLayout('root', 'backgroundColor', color)
						}
					/>
				</PanelRow>
				<PanelRow>
					<ColorPickerButton
						label={__('Text Color', 'prc-platform-core')}
						color={layout.title.color}
						onChange={(color) =>
							updateLayout('title', 'color', color)
						}
					/>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
}

/**
 * Image position settings panel.
 *
 * @param {Object}   root0              - Component props.
 * @param {Object}   root0.layout       - Current layout state.
 * @param {Function} root0.updateLayout - Layout update callback.
 */
export function ImagePositionPanel({ layout, updateLayout }) {
	return (
		<Panel>
			<PanelBody
				title={__('Image Position', 'prc-platform-core')}
				initialOpen={true}
			>
				<VStack spacing={3}>
					<NumberControl
						label={__('Top Offset', 'prc-platform-core')}
						value={layout.image.top}
						onChange={(value) => {
							updateLayout(
								'image',
								'top',
								parseInt(value, 10) || 0
							);
						}}
						min={0}
						max={500}
					/>
					<NumberControl
						label={__('Max Height', 'prc-platform-core')}
						value={layout.image.maxHeight}
						onChange={(value) =>
							updateLayout(
								'image',
								'maxHeight',
								parseInt(value, 10) || 100
							)
						}
						min={100}
						max={1200}
					/>
				</VStack>
			</PanelBody>
		</Panel>
	);
}

/**
 * Title text settings panel.
 *
 * @param {Object}   props                     - Component props.
 * @param {Object}   props.layout              - Current layout state.
 * @param {Function} props.updateLayout        - Layout update callback.
 * @param {Array}    [props.fontFamilyOptions] - Options for font family select. Defaults to DEFAULT_FONT_FAMILY_OPTIONS.
 */
export function TitleTextPanel({
	layout,
	updateLayout,
	fontFamilyOptions = DEFAULT_FONT_FAMILY_OPTIONS,
}) {
	return (
		<Panel>
			<PanelBody
				title={__('Title Text', 'prc-platform-core')}
				initialOpen={true}
			>
				<VStack spacing={3}>
					<SelectControl
						label={__('Font Family', 'prc-platform-core')}
						value={layout.title.fontFamily}
						options={fontFamilyOptions}
						onChange={(value) =>
							updateLayout('title', 'fontFamily', value)
						}
					/>
					<NumberControl
						label={__('Font Size', 'prc-platform-core')}
						value={layout.title.fontSize}
						onChange={(value) =>
							updateLayout(
								'title',
								'fontSize',
								parseInt(value, 10) || 48
							)
						}
						min={24}
						max={120}
					/>
					<RangeControl
						label={__('Line Height', 'prc-platform-core')}
						value={layout.title.lineHeight}
						onChange={(value) =>
							updateLayout('title', 'lineHeight', value)
						}
						min={0.8}
						max={2}
						step={0.05}
					/>
					<NumberControl
						label={__('Margin Top', 'prc-platform-core')}
						value={layout.title.marginTop}
						onChange={(value) =>
							updateLayout(
								'title',
								'marginTop',
								parseInt(value, 10) || 0
							)
						}
						min={0}
						max={200}
					/>
					<NumberControl
						label={__('Horizontal Margin', 'prc-platform-core')}
						value={layout.title.marginX}
						onChange={(value) =>
							updateLayout(
								'title',
								'marginX',
								parseInt(value, 10) || 0
							)
						}
						min={0}
						max={200}
					/>
					<NumberControl
						label={__('Max Lines', 'prc-platform-core')}
						value={layout.title.maxLines}
						onChange={(value) =>
							updateLayout(
								'title',
								'maxLines',
								parseInt(value, 10) || 1
							)
						}
						min={1}
						max={8}
					/>
				</VStack>
			</PanelBody>
		</Panel>
	);
}

/**
 * Logo settings panel.
 *
 * @param {Object}   root0              - Component props.
 * @param {Object}   root0.layout       - Current layout state.
 * @param {Function} root0.updateLayout - Layout update callback.
 */
export function LogoPanel({ layout, updateLayout }) {
	return (
		<Panel>
			<PanelBody
				title={__('Logo', 'prc-platform-core')}
				initialOpen={false}
			>
				<VStack spacing={3}>
					<NumberControl
						label={__('Logo Height', 'prc-platform-core')}
						value={layout.logo.height}
						onChange={(value) =>
							updateLayout(
								'logo',
								'height',
								parseInt(value, 10) || 30
							)
						}
						min={20}
						max={150}
					/>
					<NumberControl
						label={__('Bottom Margin', 'prc-platform-core')}
						value={layout.logo.marginBottom}
						onChange={(value) =>
							updateLayout(
								'logo',
								'marginBottom',
								parseInt(value, 10) || 0
							)
						}
						min={0}
						max={200}
					/>
				</VStack>
			</PanelBody>
		</Panel>
	);
}

/**
 * Source image panel. Shows override controls only when onSelectOverride is provided.
 *
 * @param {Object}   props                    - Component props.
 * @param {string}   props.sourceImageUrl     - Current source image URL.
 * @param {boolean}  [props.hasOverride]      - Whether an override is set.
 * @param {Function} [props.onSelectOverride] - Callback when override image is selected.
 * @param {Function} [props.onClearOverride]  - Callback to clear override.
 */
export function SourceImagePanel({
	sourceImageUrl,
	hasOverride = false,
	onSelectOverride,
	onClearOverride,
}) {
	const showOverrideControls = typeof onSelectOverride === 'function';

	const handleSelect = (media) => {
		if (media?.id && media?.url && onSelectOverride) {
			onSelectOverride({
				id: media.id,
				url: media.sizes?.full?.url || media.url || media.source_url,
			});
		}
	};

	return (
		<Panel>
			<PanelBody
				title={__('Source Image', 'prc-platform-core')}
				initialOpen={true}
			>
				<VStack spacing={3}>
					{showOverrideControls && (
						<Text
							style={{
								fontSize: '12px',
								color: hasOverride ? '#1e1e1e' : '#757575',
							}}
						>
							{hasOverride
								? __('Using: Custom Image', 'prc-platform-core')
								: __(
										'Using: Featured Image',
										'prc-platform-core'
									)}
						</Text>
					)}
					{sourceImageUrl && (
						<div
							style={{
								width: '100%',
								maxWidth: '200px',
								borderRadius: '4px',
								overflow: 'hidden',
								border: '1px solid #ddd',
							}}
						>
							<img
								src={sourceImageUrl}
								alt={__('Source image', 'prc-platform-core')}
								style={{
									width: '100%',
									height: 'auto',
									display: 'block',
								}}
							/>
						</div>
					)}
					{showOverrideControls && (
						<Flex gap={2} wrap>
							<FlexItem>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={handleSelect}
										allowedTypes={['image']}
										render={({ open }) => (
											<Button
												variant="secondary"
												onClick={open}
												icon={imageIcon}
												size="compact"
											>
												{hasOverride
													? __(
															'Change Image',
															'prc-platform-core'
														)
													: __(
															'Use Different Image',
															'prc-platform-core'
														)}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</FlexItem>
							{hasOverride && onClearOverride && (
								<FlexItem>
									<Button
										variant="tertiary"
										onClick={onClearOverride}
										icon={update}
										size="compact"
									>
										{__(
											'Revert to Featured',
											'prc-platform-core'
										)}
									</Button>
								</FlexItem>
							)}
						</Flex>
					)}
				</VStack>
			</PanelBody>
		</Panel>
	);
}

/**
 * Live preview canvas component.
 *
 * @param {Object}  root0                - Component props.
 * @param {Object}  root0.canvasRef      - Ref for the canvas element.
 * @param {Object}  root0.platformConfig - Platform dimensions and layout.
 * @param {boolean} root0.isRendering    - Whether the canvas is rendering.
 * @param {string}  root0.sourceImageUrl - URL of the source image.
 */
export function PreviewPanel({
	canvasRef,
	platformConfig,
	isRendering,
	sourceImageUrl,
}) {
	const previewScale = 280 / platformConfig.width;
	const previewHeight = platformConfig.height * previewScale;

	return (
		<div
			className="prc-social-image-generator__preview"
			style={{
				position: 'sticky',
				top: 0,
			}}
		>
			<span
				style={{
					fontSize: '11px',
					fontWeight: 500,
					textTransform: 'uppercase',
					display: 'block',
					marginBottom: '8px',
				}}
			>
				{__('Live Preview', 'prc-platform-core')}
			</span>
			<div
				style={{
					width: '280px',
					height: `${previewHeight}px`,
					border: '1px solid #ddd',
					borderRadius: '4px',
					overflow: 'hidden',
					backgroundColor: '#f0f0f0',
					position: 'relative',
				}}
			>
				<canvas
					ref={canvasRef}
					width={platformConfig.width}
					height={platformConfig.height}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
				{isRendering && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '12px',
							color: '#666',
						}}
					>
						{__('Rendering…', 'prc-platform-core')}
					</div>
				)}
			</div>
			{!sourceImageUrl && (
				<p
					style={{
						fontSize: '12px',
						color: '#757575',
						marginTop: '8px',
					}}
				>
					{__(
						'Set a source image to see preview.',
						'prc-platform-core'
					)}
				</p>
			)}
		</div>
	);
}
