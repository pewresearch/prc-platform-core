export type MapProjectionPreset =
	| 'default'
	| 'europe'
	| 'asia'
	| 'east-asia'
	| 'south-asia'
	| 'southeast-asia'
	| 'middle-east'
	| 'africa'
	| 'north-africa'
	| 'sub-saharan-africa'
	| 'north-america'
	| 'central-america'
	| 'south-america'
	| 'oceania'
	| 'custom';

export type MapTopologyRegion = MapProjectionPreset; // Same options but controls which topology file to load

export type Map = {
	ignoreSmallStateLabels: boolean;
	ignoredLabels: string[];
	abbreviateLabels: boolean;
	blockRectSize: number;
	pathBackgroundFill: string;
	pathStroke: string;
	pathStrokeWidth: number;
	showCountyBoundaries: boolean;
	showStateBoundaries: boolean;
	zoomActive: boolean;
	// Projection controls for custom map views
	projectionPreset: MapProjectionPreset; // Which preset projection to use (or 'custom')
	topologyRegion: MapTopologyRegion; // Which regional topology file to load (independent of projection)
	centerLongitude: number;
	centerLatitude: number;
	rotateLambda: number; // yaw
	rotatePhi: number; // pitch
	rotateGamma: number; // roll
	customScale: number; // scale multiplier (1 = default fitSize)
};
