import { dateFormat } from './dateFormat';
export type independentAxis = {
	active: boolean;
	label: string;
	scale: 'linear' | 'time' | 'log' | 'sqrt';
	dateFormat: dateFormat['format'];
	domain: number[] | Date[] | undefined;
	domainPadding: number;
	padding: number;
	showZero: boolean;
	tickAngle: number;
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
	axis: {
		stroke: string;
		strokeWidth: number;
	};
	ticks: {
		stroke: string;
		size: number;
		strokeWidth: number;
	};
	grid: {
		stroke: string;
		strokeOpacity: number;
		strokeWidth: number;
		strokeDasharray: string;
	};
};
