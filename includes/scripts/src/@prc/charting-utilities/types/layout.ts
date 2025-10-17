export type Layout = {
  name: string
  parentClass: string | undefined
  type:
    | 'bar'
    | 'diverging-bar'
    | 'line'
    | 'area'
    | 'scatter'
    | 'pie'
    | 'dot-plot'
    | 'stacked-bar'
    | 'single-stacked-bar'
    | 'grouped-bar'
    | 'exploded-bar'
    | 'stacked-area'
    | 'map-usa'
    | 'map-usa-counties'
    | 'map-usa-block'
    | 'map-world'
    | 'map-europe'
  theme: 'light' | 'dark'
  orientation: 'vertical' | 'horizontal'
  width: number
  height: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  overflowX:
    | 'scroll-fixed-y-axis'
    | 'responsive'
    | 'scroll'
    | 'preserve-aspect-ratio'
  horizontalRules: boolean
  mobileBreakpoint: number
}
