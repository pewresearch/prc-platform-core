import { dateFormat } from './dateFormat'

export type Tooltip = {
  active: boolean
  activeOnMobile: boolean
  headerActive: boolean
  headerValue: 'independentValue' | 'categoryValue'
  format: string | null
  offsetX: number
  offsetY: number
  abbreviateValue: boolean
  absoluteValue: boolean
  toFixedDecimal: number
  toLocaleString: boolean
  customFormat: any // function(d) { return d; },
  rlsFormat: boolean
  caretPosition: 'top' | 'left' | 'bottom' | 'right'
  dateFormat: dateFormat['format']
  deemphasizeSiblings: boolean
  deemphasizeOpacity: number
  style: {
    minWidth: number
    maxWidth: number
    maxHeight: number
    minHeight: number
    width: number | 'auto' | '100%'
    height: number | 'auto'
    fontSize: string | number
    fontFamily: string
    background: string
    color: string
    padding: string
    border: string
    borderRadius: string
  }
}
