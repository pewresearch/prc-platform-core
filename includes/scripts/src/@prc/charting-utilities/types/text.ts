// Text annotation types
type TextAnnotation = {
	id?: string;
	x: number;
	y: number;
	text: string;
	fontSize?: number;
	fontWeight?: 'normal' | 'bold' | '600' | '700';
	fontStyle?: 'normal' | 'italic';
	fontFamily?: string;
	fill?: string;
	textAnchor?: 'start' | 'middle' | 'end';
	verticalAnchor?: 'start' | 'middle' | 'end';
	rotation?: number;
	link?: string;
	backgroundColor?: string;
	padding?: number;
	borderRadius?: number;
	opacity?: number;
	maxWidth?: number;
	activeOnMobile?: boolean;
	positioningContext?: 'chart' | 'inner'; // 'chart' = full chart area including padding, 'inner' = data area only
	onDrag?: (id: string, newX: number, newY: number) => void;
	onDragStart?: () => void;
	onDragEnd?: () => void;
};

type AnnotationsConfig = {
	active: boolean;
	activeOnMobile: boolean;
	items: TextAnnotation[];
};

// Metadata text types
type MetadataText = {
	title?: string;
	subtitle?: string;
	note?: string;
	tag?: string;
};

export type { TextAnnotation, AnnotationsConfig, MetadataText };
