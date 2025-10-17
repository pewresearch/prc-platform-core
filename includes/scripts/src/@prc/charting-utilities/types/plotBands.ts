export type PlotBands = {
  active: boolean
  allowDrag: boolean
  allowResize: boolean
  dimension: string
  bands: {
    x: number[]
    y: number[]
    label: string
    style: {
      band: {
        stroke: string
        fill: string
        fillOpacity: number
      }
      label: {
        fontSize: number
        fill: string
        orientation: 'horizontal' | 'vertical'
        align: 'top' | 'bottom'
        dx: number
        dy: number
        fontFamily?: string
      }
    }
  }[]
}
