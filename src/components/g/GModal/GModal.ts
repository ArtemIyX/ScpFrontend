export type GModalPadding = 'sm' | 'md' | 'lg'
export type GModalWidth = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type GModalHeight = 'auto' | 'full'
export type GModalAs = 'div' | 'section' | 'article'

export interface GModalProps {
  modelValue?: boolean
  title?: string
  subtitle?: string
  status?: string
  padding?: GModalPadding
  width?: GModalWidth
  height?: GModalHeight
  strong?: boolean
  closable?: boolean
  backdropClosable?: boolean
  escapeClosable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  as?: GModalAs
  ariaLabel?: string
  ariaDescribedby?: string
}

export interface GModalEmits {
  'update:modelValue': [value: boolean]
  open: []
  close: [reason?: 'button' | 'backdrop' | 'escape']
  backdropClick: [event: MouseEvent]
  escape: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGModalClasses(props: {
  padding: GModalPadding
  width: GModalWidth
  height: GModalHeight
  strong: boolean
}): string[] {
  return [
    'gmodal',
    `gmodal--${props.padding}`,
    `gmodal--width-${props.width}`,
    `gmodal--height-${props.height}`,
    props.strong ? 'gmodal--strong' : '',
  ].filter(Boolean)
}
