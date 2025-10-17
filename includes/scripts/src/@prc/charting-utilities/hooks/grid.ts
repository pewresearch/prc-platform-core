import { ScaleLinear, ScaleTime, ScaleBand, ScalePoint } from 'd3-scale'
import { independentAxis, dependentAxis } from '../types/configTypes'

export const getGridProps = (
  config: independentAxis | dependentAxis,
  scale:
    | ScaleLinear<number, number>
    | ScaleTime<number, number>
    | ScaleBand<string>
    | ScalePoint<string>,
  width: number,
  height: number,
) => {
  const { stroke, strokeWidth, strokeOpacity, strokeDasharray } = config.grid
  return {
    scale: scale,
    width: width,
    height: height,
    stroke: stroke,
    strokeWidth: strokeWidth,
    strokeOpacity: strokeOpacity,
    strokeDasharray: strokeDasharray,
    numTicks: config.tickCount,
    tickValues:
      config.scale === 'time'
        ? (config as independentAxis).tickValues?.map(t => {
            var date = new Date(t)
            date.setDate(date.getDate() + 1)
            return date
          })
        : (config.tickValues as number[]),
  }
}
