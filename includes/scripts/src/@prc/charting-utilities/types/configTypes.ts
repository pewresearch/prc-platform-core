import { Animate } from './animate'
import { Bar } from './bar'
import { Colors } from './colors'
import { DataRender } from './dataRender'
import { DiffColumn } from './diffColumn'
import { DotPlot } from './dotPlot'
import { Events } from './events'
import { ExplodedBar } from './explodedBar'
import { Labels } from './labels'
import { Layout } from './layout'
import { Legend } from './legend'
import { Line } from './line'
import { Metadata } from './metadata'
import { DivergingBar } from './divergingBar'
import { Nodes } from './nodes'
import { Pie } from './pie'
import { PlotBands } from './plotBands'
import { Tooltip } from './tooltip'
import { independentAxis } from './independentAxis'
import { dependentAxis } from './dependentAxis'
import { Voronoi } from './voronoi'
import { RegressionLine } from './regressionLine'
import { Map } from './map'
import { Custom } from './custom'
import { ErrorBars } from './errorBars'
import { AnnotationsConfig, TextAnnotation, MetadataText } from './text'

type BaseConfig = {
  animate: Animate
  bar: Bar
  colors: Colors
  dataRender: DataRender
  diffColumn: DiffColumn
  divergingBar: DivergingBar
  dotPlot: DotPlot
  errorBars: ErrorBars
  events: Events
  explodedBar: ExplodedBar
  labels: Labels
  layout: Layout
  legend: Legend
  line: Line
  metadata: Metadata
  nodes: Nodes
  pie: Pie
  plotBands: PlotBands
  tooltip: Tooltip
  independentAxis: independentAxis
  dependentAxis: dependentAxis
  voronoi: Voronoi
  regression: RegressionLine
  map: Map
  custom: Custom
  annotations: AnnotationsConfig
}

export type {
  BaseConfig,
  Animate,
  Bar,
  Colors,
  DataRender,
  DiffColumn,
  DotPlot,
  ErrorBars,
  Events,
  ExplodedBar,
  Labels,
  Layout,
  Legend,
  Line,
  Metadata,
  Nodes,
  Pie,
  PlotBands,
  Tooltip,
  independentAxis,
  dependentAxis,
  Voronoi,
  RegressionLine,
  DivergingBar,
  Map,
  Custom,
  AnnotationsConfig,
  TextAnnotation,
  MetadataText,
}
