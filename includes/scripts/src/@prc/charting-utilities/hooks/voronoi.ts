import { Voronoi as VoronoiProps } from '../types/configTypes';

export const getVoronoiProps = (props: VoronoiProps) => {
  const { fill, stroke, strokeWidth, strokeOpacity } = props;
  return {
    fill: fill,
    stroke: stroke,
    strokeWidth: strokeWidth,
    strokeOpacity: strokeOpacity,
  };
};
