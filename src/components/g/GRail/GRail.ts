export type GRailPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GRailSize = 'sm' | 'md' | 'lg'
export type GRailWidth = 'auto' | 'full'
export type GRailAlign = 'start' | 'center' | 'end'
export type GRailValue = string | number | boolean

export interface GRailItem {
  value: GRailValue
  title?: string
  subtitle?: string
  meta?: string
  disabled?: boolean
  recommended?: boolean
  preset?: GRailPreset
}

export interface GRailProps {
  modelValue?: GRailValue | null
  items?: GRailItem[]
  label?: string
  helper?: string
  error?: string
  preset?: GRailPreset
  size?: GRailSize
  width?: GRailWidth
  align?: GRailAlign
  background?: boolean
  disabled?: boolean
  title?: string
  ariaLabel?: string
  id?: string
  name?: string
}

export interface GRailEmits {
  'update:modelValue': [value: GRailValue | null]
  change: [value: GRailValue | null, item?: GRailItem | null]
  select: [item: GRailItem]
  keydown: [event: KeyboardEvent]
}

export function buildGRailClasses(props: {
  preset: GRailPreset
  size: GRailSize
  width: GRailWidth
  align: GRailAlign
  background: boolean
  disabled: boolean
  hasError: boolean
}) {
  return [
    'grail',
    `grail--${props.preset}`,
    `grail--${props.size}`,
    `grail--${props.width}`,
    `grail--${props.align}`,
    props.background ? 'grail--background' : '',
    props.disabled ? 'grail--disabled' : '',
    props.hasError ? 'grail--error' : '',
  ].filter(Boolean)
}
