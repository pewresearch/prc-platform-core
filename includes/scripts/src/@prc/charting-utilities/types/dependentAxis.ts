export type dependentAxis = {
	active: boolean;
	label: string;
	scale: 'linear' | 'time' | 'log' | 'sqrt';
	padding: number;
	domain: number[];
	domainPadding: number;
	showZero: boolean;
	tickCount: number | undefined;
	tickValues: string[] | number[] | Date[] | undefined;
	tickFormat: any;
	ticksToLocaleString: boolean;
	abbreviateTicks: boolean;
	abbreviateTicksDecimals: number;
	tickUnit: string; //'%', '$', '€', '£', '¥'
	tickUnitPosition: 'start' | 'end';
	customTickFormat: any; // function(d) { return d; },
	tickLabels: {
		fontSize: number;
		padding: number;
		angle: number;
		dx: number;
		dy: number;
		fill: string;
		textAnchor: 'start' | 'middle' | 'end';
		verticalAnchor: 'start' | 'middle' | 'end';
		fontFamily: string;
		maxWidth: number;
	};
	axisLabel: {
		fontSize: number;
		padding: number;
		angle: number;
		dx: number;
		dy: number;
		fill: string;
		textAnchor: 'start' | 'middle' | 'end';
		verticalAnchor: 'start' | 'middle' | 'end';
		fontFamily: string;
		maxWidth: number;
	};
	ticks: {
		stroke: string;
		size: number;
		strokeWidth: number;
	};
	axis: {
		stroke: string;
		strokeWidth: number;
	};
	grid: {
		stroke: string;
		strokeWidth: number;
		strokeOpacity: number;
		strokeDasharray: string;
	};
};
