export type Line = {
  interpolation:
    | 'curveBasis'
    | 'curveBasisClosed'
    | 'curveBasisOpen'
    | 'curveStep'
    | 'curveStepAfter'
    | 'curveStepBefore'
    // | 'curveBundle' doesn't work with area charts, but i don't think anyone will miss it
    | 'curveLinear'
    | 'curveLinearClosed'
    | 'curveCardinal'
    | 'curveCardinalClosed'
    | 'curveCardinalOpen'
    | 'curveCatmullRom'
    | 'curveCatmullRomClosed'
    | 'curveCatmullRomOpen'
    | 'curveMonotoneX'
    | 'curveMonotoneY'
    | 'curveNatural';
  strokeDasharray: string;
  strokeWidth: number;
  showPoints: boolean;
  showArea: boolean;
  areaFillOpacity: number;
};
