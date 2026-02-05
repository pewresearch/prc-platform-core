/**
 * Style overrides for individual label customization
 */
export interface LabelStyleOverride {
	color?: string;
	fontWeight?: string | number;
	fontSize?: number;
	fontStyle?: 'normal' | 'italic' | 'underline' | 'strikethrough';
	fontFamily?: string;
	maxWidth?: number;
}

/**
 * Position offset for a label
 */
export interface LabelPositionOffset {
	dx: number;
	dy: number;
}

/**
 * Per-data-point label customizations stored in block attributes.
 * Keys are formatted as "xValue::category" (e.g., "2020::Democrats")
 */
export interface LabelCustomizations {
	customPositions?: Record<string, LabelPositionOffset>;
	customLabels?: Record<string, string>;
	customVisibility?: Record<string, boolean>;
	customStyles?: Record<string, LabelStyleOverride>;
}

export type Labels = {
	active: boolean;
	showFirstLastPointsOnly: boolean;
	color: 'inherit' | 'contrast' | 'black' | 'white';
	// altColor: 'white',
	fontWeight: number;
	fontSize: number;
	fontFamily: string;
	textAnchor: 'start' | 'middle' | 'end';
	labelPositionBar: 'inside' | 'outside' | 'center';
	labelCutoff: number;
	labelCutoffMobile: number;
	labelPositionDX: number;
	labelPositionDY: number;
	pieLabelRadius?: number;
	abbreviateValue: boolean;
	absoluteValue: boolean;
	truncateDecimal: boolean;
	toFixedDecimal: number;
	toLocaleString: boolean;
	labelUnit: string; //'%', '$', '€', '£', '¥'
	labelUnitPosition: 'start' | 'end';
	customLabelFormat?:
		| ((value: number | Date | string, category: string) => string)
		| null;
	// function(d) { return d; },
} & LabelCustomizations;
