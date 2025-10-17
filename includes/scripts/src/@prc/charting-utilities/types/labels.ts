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
};
