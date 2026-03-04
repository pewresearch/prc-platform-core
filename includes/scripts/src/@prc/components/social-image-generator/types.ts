/**
 * Types for the Social Image Generator component.
 */

import type { ReactNode, RefObject } from 'react';

export interface LayoutConfig {
	backgroundColor: string;
	image: {
		top: number;
		maxHeight: number;
	};
	title: {
		fontFamily: string;
		fontSize: number;
		lineHeight: number;
		color: string;
		marginTop: number;
		marginX: number;
		maxLines: number;
	};
	logo: {
		height: number;
		marginBottom: number;
	};
}

export interface PlatformSizeConfig {
	name: string;
	icon: ReactNode;
	width: number;
	height: number;
	layout: LayoutConfig;
}

export interface FontFamilyOption {
	label: string;
	value: string;
}

export interface SocialImageGeneratorProps {
	/** Platform key (e.g. 'instagram', 'twitter'). */
	platformType: string;
	/** URL of the source image. */
	sourceImageUrl: string | null;
	/** Title text to render on the image. */
	title: string;
	/** Optional URL of logo image/SVG to render at bottom. */
	logoSrc?: string | null;
	/** Optional custom platform size definitions. */
	platformSizes?: Record<string, PlatformSizeConfig> | null;
	/** Optional font family options for the title selector. */
	fontFamilyOptions?: FontFamilyOption[];
	/** Callback when user generates an image; consumer handles upload/storage. */
	onGenerate: (payload: {
		file: File;
		blob: Blob;
		platformType: string;
		layout: LayoutConfig;
	}) => void;
	/** Optional callback for download action. If omitted, uses default browser download of last generated image. */
	onDownload?: (() => void) | null;
	/** Optional custom render for the preview area. Receives { canvasRef, platformConfig, imageDataUrl }. */
	renderPreview?: (props: {
		canvasRef: RefObject<HTMLCanvasElement | null>;
		platformConfig: PlatformSizeConfig;
		imageDataUrl: string | null;
		isRendering: boolean;
	}) => ReactNode;
	/** Optional callback when user selects a source image override. */
	onSourceImageSelect?:
		| ((imageData: { id: number; url: string }) => void)
		| null;
	/** Optional callback to clear source image override. */
	onSourceImageClear?: (() => void) | null;
	/** Whether a source image override is active. */
	hasSourceOverride?: boolean;
	/** Additional CSS class. */
	className?: string;
	/** Optional: URL of already-generated image (e.g. after upload). Enables Download button. */
	generatedImageUrl?: string | null;
}

export interface GenerateImageOptions {
	sourceImageUrl: string;
	title: string;
	platformType?: string;
	layoutOverrides?: Partial<LayoutConfig> | null;
	logoSrc?: string | null;
	platformSizes?: Record<string, PlatformSizeConfig> | null;
}
