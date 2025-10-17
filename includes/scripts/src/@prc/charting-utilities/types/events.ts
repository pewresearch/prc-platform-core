// TODO: harden the data type of the event object
export type Events = {
  click?: (data: any, event: MouseEvent | any) => void
  mouseenter?: (data: any, event: MouseEvent | any) => void
  mouseleave?: (data: any, event: MouseEvent | any) => void
  focus?: (data: any, event: FocusEvent | any) => void
  blur?: (data: any, event: FocusEvent | any) => void
}
