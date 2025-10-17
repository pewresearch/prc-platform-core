export type DiffColumn = {
  active: boolean
  category: string
  columnHeader: string
  dx: number
  dy: number
  style: {
    rectStrokeWidth: number
    rectStrokeColor: string
    rectFill: string
    fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter' | number
    fontSize: string
    fontStyle: 'normal' | 'italic' | 'oblique'
    fontFamily: string
    headerFontSize: string
    width: number
    marginLeft: number
    heightOffset: number
  }
}
