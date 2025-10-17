export type RegressionLine = {
  active: boolean;
  type:
    | 'linear'
    | 'exponential'
    | 'polynomial'
    | 'logarithmic'
    | 'power'
    | 'quadratic'
    | 'loess';
  strokeDasharray: string;
  strokeWidth: number;
  stroke: string;
};
