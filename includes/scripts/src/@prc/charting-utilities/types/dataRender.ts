export type DataRender = {
	x: string;
	y: string;
	x2?: string | null;
	y2?: string | null;
	sortKey: string;
	sortOrder: 'ascending' | 'descending' | 'reverse' | 'none';
	categories: string[];
	xScale: 'linear' | 'time' | 'log' | 'sqrt';
	yScale: 'linear' | 'time' | 'log' | 'sqrt';
	mapScale: 'ordinal' | 'threshold' | 'quantile' | 'quantize' | 'linear';
	mapScaleDomain: string[] | number[];
	xFormat?:
		| 'YYYY-MM-DD'
		| 'YYYY-MM'
		| 'MM/DD/YYYY'
		| 'MM/YYYY'
		| 'DD/MM/YYYY'
		| 'YYYY'
		| 'MM'
		| 'MM/DD'
		| 'DD/MM'
		| null;
	yFormat?: string | null;
	numberFormat:
		| 'en-US'
		| 'en-GB'
		| 'de-DE'
		| 'fr-FR'
		| 'es-ES'
		| 'it-IT'
		| 'ja-JP'
		| 'ko-KR'
		| 'pt-BR'
		| 'zh-CN'
		| 'zh-TW';
	isHighlightedColor: string;
	// Group Breaks - for visually separating data by category
	groupBreaksActive?: boolean;
	groupBreaksCategory?: string;
	groupBreaksCategoryValues?: string[] | number[];
	groupBreaks?: {
		breakStyles?: {
			variation?: 'empty' | 'solid' | 'dotted' | 'dashed' | 'heartbeat';
			stroke?: string;
			strokeWidth?: number;
			height?: number;
			strokeDasharray?: string;
		};
		labelStyles?: {
			fill?: string;
			fontStyle?: 'normal' | 'italic' | 'bold';
		};
	};
};
