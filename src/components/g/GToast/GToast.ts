export type GToastPreset = 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GToastVariant = 'solid' | 'soft' | 'outline'
export type GToastSize = 'sm' | 'md' | 'lg'
export type GToastAs = 'div' | 'section' | 'article'

export interface GToastProps {
  title?: string
  message?: string
  status?: string
  preset?: GToastPreset
  variant?: GToastVariant
  size?: GToastSize
  closable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  as?: GToastAs
  role?: 'status' | 'alert' | 'note'
  ariaLabel?: string
}

export interface GToastEmits {
  close: [reason?: 'button']
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  pointerenter: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
}

export function buildGToastClasses(props: {
  preset: GToastPreset
  variant: GToastVariant
  size: GToastSize
  closable: boolean
}): string[] {
  return [
    'gtoast',
    `gtoast--${props.preset}`,
    `gtoast--${props.variant}`,
    `gtoast--${props.size}`,
    props.closable ? 'gtoast--closable' : '',
  ].filter(Boolean)
}
