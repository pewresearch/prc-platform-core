/* eslint-disable max-lines */
/**
 * Social Image Generator
 *
 * Context-free UI for generating social media images: layout controls,
 * live preview, and generate/download. All data via props.
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
} from '@wordpress/element';
import {
	Button,
	Spinner,
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { create, download, rotateRight } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import { renderToCanvas, generateImageFile } from './image-generator';
import { DEFAULT_PLATFORM_SIZES } from './platform-sizes';
import {
	ColorPanel,
	ImagePositionPanel,
	TitleTextPanel,
	LogoPanel,
	SourceImagePanel,
	DEFAULT_FONT_FAMILY_OPTIONS,
} from './layout-editor-panels';

/**
 * Social preview components for default preview rendering.
 */
import {
	InstagramStoryPreview,
	FacebookPreview,
	TwitterPreview,
	ThreadsPreview,
	BlueskyPreview,
	SlackPreview,
	DiscordPreview,
	TeamsPreview,
	LinkedInPreview,
} from '../social-preview';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

function getGenerateButtonLabel(isGenerating, hasGenerated) {
	if (isGenerating) {
		return __('Generating…', 'prc-platform-core');
	}
	if (hasGenerated) {
		return __('Regenerate', 'prc-platform-core');
	}
	return __('Generate', 'prc-platform-core');
}

/**
 * Default live preview: canvas (hidden) + platform-specific social preview.
 *
 * @param {Object} root0                - Component props.
 * @param {Object} root0.canvasRef      - Ref for the canvas element.
 * @param {Object} root0.platformConfig - Platform dimensions config.
 * @param {string} root0.imageDataUrl   - Data URL of the generated image.
 */
function DefaultLivePreview({ canvasRef, platformConfig, imageDataUrl }) {
	const title = 'Title!';
	const description = 'Description!';
	const url = 'https://example.com/';
	const siteName = 'Site Name';

	return (
		<div className="prc-social-image-generator__preview">
			<span
				style={{
					fontSize: '11px',
					fontWeight: 500,
					textTransform: 'uppercase',
					display: 'block',
					marginBottom: '8px',
					color: '#757575',
				}}
			>
				{__('Live Preview', 'prc-platform-core')}
			</span>
			<canvas
				ref={canvasRef}
				width={platformConfig.width}
				height={platformConfig.height}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain',
					display: 'none',
				}}
			/>
			<div style={{ width: '300px' }}>
				{platformConfig.name === 'LinkedIn' && (
					<LinkedInPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
					/>
				)}
				{platformConfig.name === 'Facebook' && (
					<FacebookPreview
						title={title}
						description={description}
						url={url}
						siteName={siteName}
						image={imageDataUrl}
						displayName="Site Name"
						postText="Test Post Text"
						timestamp="10m"
						verified={true}
						reactions={100}
						comments={10}
						shares={10}
					/>
				)}
				{platformConfig.name === 'Twitter' && (
					<TwitterPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
						displayName="Site Name"
						username="username"
						tweetText="Test Tweet Text"
						verified={true}
						timestamp="10m"
						likes={100}
						replies={10}
					/>
				)}
				{platformConfig.name === 'Threads' && (
					<ThreadsPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
					/>
				)}
				{platformConfig.name === 'Bluesky' && (
					<BlueskyPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
						displayName="Site Name"
						handle="example.org"
						postText="Test Post Text"
						verified={true}
						timestamp="10m"
						likes={100}
						reposts={10}
						quotes={10}
						replies={10}
						saves={10}
					/>
				)}
				{platformConfig.name === 'Slack' && (
					<SlackPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
						displayName="Site Name"
						messageText="Test Message Text"
						timestamp="10m"
						readingTime="5 minutes"
						author="Author"
					/>
				)}
				{platformConfig.name === 'Discord' && (
					<DiscordPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
					/>
				)}
				{platformConfig.name === 'Teams' && (
					<TeamsPreview
						title={title}
						description={description}
						url={url}
						image={imageDataUrl}
						siteName={siteName}
					/>
				)}
			</div>
			{platformConfig.name === 'Instagram' && (
				<InstagramStoryPreview
					title={title}
					description={description}
					url={url}
					image={imageDataUrl}
					username="username"
				/>
			)}
			<div
				style={{
					fontSize: '11px',
					color: '#757575',
					marginTop: '8px',
				}}
			>
				{platformConfig.width} × {platformConfig.height}px
			</div>
		</div>
	);
}

function LayoutControls({
	layout,
	updateLayout,
	sourceImageUrl,
	hasOverride,
	onSelectOverride,
	onClearOverride,
	fontFamilyOptions,
}) {
	return (
		<div
			style={{
				maxHeight: '480px',
				overflowY: 'auto',
				paddingRight: '8px',
			}}
		>
			<VStack spacing={2}>
				<SourceImagePanel
					sourceImageUrl={sourceImageUrl}
					hasOverride={hasOverride}
					onSelectOverride={onSelectOverride}
					onClearOverride={onClearOverride}
				/>
				<ColorPanel layout={layout} updateLayout={updateLayout} />
				<ImagePositionPanel
					layout={layout}
					updateLayout={updateLayout}
				/>
				<TitleTextPanel
					layout={layout}
					updateLayout={updateLayout}
					fontFamilyOptions={fontFamilyOptions}
				/>
				<LogoPanel layout={layout} updateLayout={updateLayout} />
			</VStack>
		</div>
	);
}

function NoSourceImageMessage() {
	return (
		<div className="prc-social-image-generator__empty">
			<div
				style={{
					padding: '24px',
					textAlign: 'center',
					color: '#757575',
				}}
			>
				<Text>
					{__(
						'Provide a source image to generate social media images.',
						'prc-platform-core'
					)}
				</Text>
			</div>
		</div>
	);
}

/**
 * Action bar: Reset, Generate, Download buttons plus error and generating state.
 *
 * @param {Object}   root0               - Component props.
 * @param {string}   [root0.error]       - Error message to display.
 * @param {string}   root0.generateLabel - Label for generate button.
 * @param {boolean}  root0.hasGenerated  - Whether an image has been generated.
 * @param {Function} root0.onReset       - Reset layout callback.
 * @param {Function} root0.onGenerate    - Generate image callback.
 * @param {Function} root0.onDownload    - Download image callback.
 * @param {boolean}  root0.isGenerating  - Whether generation is in progress.
 */
function GeneratorActionBar({
	error,
	generateLabel,
	hasGenerated,
	onReset,
	onGenerate,
	onDownload,
	isGenerating,
}) {
	return (
		<>
			{error && (
				<div
					style={{
						color: '#cc1818',
						fontSize: '12px',
						marginTop: '16px',
						padding: '8px 12px',
						backgroundColor: '#fcebea',
						borderRadius: '4px',
					}}
				>
					{error}
				</div>
			)}
			<Flex
				justify="space-between"
				style={{
					marginTop: '24px',
					paddingTop: '16px',
					borderTop: '1px solid #e0e0e0',
				}}
			>
				<FlexItem>
					<Button
						variant="tertiary"
						onClick={onReset}
						icon={rotateRight}
					>
						{__('Reset', 'prc-platform-core')}
					</Button>
				</FlexItem>
				<FlexItem>
					<Flex gap={2}>
						<FlexItem>
							<Button
								variant="primary"
								onClick={onGenerate}
								disabled={isGenerating}
								isBusy={isGenerating}
								icon={create}
							>
								{generateLabel}
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								variant="secondary"
								icon={download}
								onClick={onDownload}
								disabled={!hasGenerated}
							>
								{__('Download', 'prc-platform-core')}
							</Button>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
			{isGenerating && (
				<div
					style={{
						marginTop: '12px',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						color: '#757575',
						fontSize: '13px',
					}}
				>
					<Spinner />
					{__('Generating…', 'prc-platform-core')}
				</div>
			)}
		</>
	);
}

/**
 * Social Image Generator component.
 *
 * @param {Object}      props                       - Component props.
 * @param {string}      props.platformType          - Platform key (e.g. 'instagram', 'twitter').
 * @param {string|null} props.sourceImageUrl        - URL of the source image.
 * @param {string}      props.title                 - Title text to render on the image.
 * @param {string}      [props.logoSrc]             - Optional URL of logo image/SVG.
 * @param {Object}      [props.platformSizes]       - Optional custom platform sizes.
 * @param {Array}       [props.fontFamilyOptions]   - Optional font family options.
 * @param {Function}    props.onGenerate            - Callback when image is generated.
 * @param {Function}    [props.onDownload]          - Optional download callback.
 * @param {Function}    [props.renderPreview]       - Optional custom preview render.
 * @param {Function}    [props.onSourceImageSelect] - Optional source override select.
 * @param {Function}    [props.onSourceImageClear]  - Optional source override clear.
 * @param {boolean}     [props.hasSourceOverride]   - Whether source override is set.
 * @param {string}      [props.className]           - Additional CSS class.
 * @param {string}      [props.generatedImageUrl]   - URL of generated image for Download button.
 */
export default function SocialImageGenerator({
	platformType = 'instagram',
	sourceImageUrl = null,
	title = '',
	logoSrc = null,
	platformSizes = null,
	fontFamilyOptions = DEFAULT_FONT_FAMILY_OPTIONS,
	onGenerate,
	onDownload = null,
	renderPreview = null,
	onSourceImageSelect = null,
	onSourceImageClear = null,
	hasSourceOverride = false,
	className = '',
	generatedImageUrl = null,
}) {
	const canvasRef = useRef(null);
	const [isRendering, setIsRendering] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState(null);
	const [lastGeneratedObjectUrl, setLastGeneratedObjectUrl] = useState(null);

	const sizes = useMemo(
		() => platformSizes || DEFAULT_PLATFORM_SIZES,
		[platformSizes]
	);
	const platformConfig = sizes[platformType];
	const defaultLayout = platformConfig?.layout;

	const [layout, setLayout] = useState(() =>
		defaultLayout ? deepClone(defaultLayout) : {}
	);

	useEffect(() => {
		if (platformConfig?.layout) {
			setLayout(deepClone(platformConfig.layout));
		}
	}, [platformType, platformConfig?.layout]);

	const updateLayout = useCallback((section, key, value) => {
		setLayout((prev) => {
			if (section === 'root') {
				return { ...prev, [key]: value };
			}
			return {
				...prev,
				[section]: { ...prev[section], [key]: value },
			};
		});
	}, []);

	const handleReset = useCallback(() => {
		if (defaultLayout) {
			setLayout(deepClone(defaultLayout));
		}
	}, [defaultLayout]);

	// Preview render effect
	useEffect(() => {
		if (!canvasRef.current || !sourceImageUrl || !platformConfig) {
			return;
		}

		const renderPreviewCanvas = async () => {
			setIsRendering(true);
			try {
				await renderToCanvas({
					canvas: canvasRef.current,
					sourceImageUrl,
					title: title || 'Sample Title',
					platformType,
					layoutOverrides: layout,
					logoSrc,
					platformSizes: sizes,
				});
			} catch (err) {
				// Preview render failed silently
			}
			setIsRendering(false);
		};

		const timeoutId = setTimeout(renderPreviewCanvas, 150);
		return () => clearTimeout(timeoutId);
	}, [
		sourceImageUrl,
		title,
		platformType,
		layout,
		platformConfig,
		logoSrc,
		sizes,
	]);

	const imageDataUrl = canvasRef.current?.toDataURL?.() ?? null;

	const executeGeneration = useCallback(async () => {
		if (!sourceImageUrl) {
			setError('No source image available');
			return;
		}
		if (!title) {
			setError('Title is required');
			return;
		}

		setIsGenerating(true);
		setError(null);

		try {
			const filename = `social-image-${platformType}.png`;
			const file = await generateImageFile({
				sourceImageUrl,
				title,
				platformType,
				filename,
				layoutOverrides: layout,
				logoSrc,
				platformSizes: sizes,
			});

			// Revoke previous object URL
			if (lastGeneratedObjectUrl) {
				URL.revokeObjectURL(lastGeneratedObjectUrl);
			}
			const objectUrl = URL.createObjectURL(file);
			setLastGeneratedObjectUrl(objectUrl);

			onGenerate({
				file,
				blob: file,
				platformType,
				layout,
			});
		} catch (err) {
			setError(err?.message || 'Generation failed');
		} finally {
			setIsGenerating(false);
		}
	}, [
		sourceImageUrl,
		title,
		platformType,
		layout,
		logoSrc,
		sizes,
		onGenerate,
		lastGeneratedObjectUrl,
	]);

	const downloadUrl = generatedImageUrl || lastGeneratedObjectUrl;
	const hasGenerated = !!downloadUrl;

	const handleDownload = useCallback(() => {
		if (!downloadUrl) return;
		if (typeof onDownload === 'function') {
			onDownload();
			return;
		}
		const link = document.createElement('a');
		link.href = downloadUrl;
		link.download = `social-image-${platformType}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [downloadUrl, onDownload, platformType]);

	if (!platformConfig) {
		return null;
	}

	if (!sourceImageUrl && !hasSourceOverride) {
		return <NoSourceImageMessage />;
	}

	const generateLabel = getGenerateButtonLabel(isGenerating, hasGenerated);

	const previewContent =
		typeof renderPreview === 'function' ? (
			renderPreview({
				canvasRef,
				platformConfig,
				imageDataUrl,
				isRendering,
			})
		) : (
			<DefaultLivePreview
				canvasRef={canvasRef}
				platformConfig={platformConfig}
				imageDataUrl={imageDataUrl}
			/>
		);

	return (
		<div className={`prc-social-image-generator ${className}`.trim()}>
			<Flex align="flex-start" justify="flex-start" gap={6}>
				<FlexBlock style={{ maxWidth: '320px' }}>
					<LayoutControls
						layout={layout}
						updateLayout={updateLayout}
						sourceImageUrl={sourceImageUrl}
						hasOverride={hasSourceOverride}
						onSelectOverride={onSourceImageSelect}
						onClearOverride={onSourceImageClear}
						fontFamilyOptions={fontFamilyOptions}
					/>
				</FlexBlock>
				<FlexItem>{previewContent}</FlexItem>
			</Flex>

			<GeneratorActionBar
				error={error}
				generateLabel={generateLabel}
				hasGenerated={hasGenerated}
				onReset={handleReset}
				onGenerate={executeGeneration}
				onDownload={handleDownload}
				isGenerating={isGenerating}
			/>
		</div>
	);
}
