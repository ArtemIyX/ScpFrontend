export type GTabsPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GTabsSize = 'sm' | 'md' | 'lg'
export type GTabsWidth = 'auto' | 'full'
export type GTabsAlign = 'start' | 'center' | 'end'

export interface GTabsItem {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
  count?: string | number
}

export interface GTabsProps {
  modelValue?: string | number | null
  tabs?: GTabsItem[]
  preset?: GTabsPreset
  size?: GTabsSize
  width?: GTabsWidth
  align?: GTabsAlign
  background?: boolean
  disabled?: boolean
  ariaLabel?: string
  title?: string
}

export interface GTabsEmits {
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null, tab?: GTabsItem | null]
  select: [tab: GTabsItem]
  keydown: [event: KeyboardEvent]
}

export function buildGTabsClasses(props: {
  preset: GTabsPreset
  size: GTabsSize
  width: GTabsWidth
  align: GTabsAlign
  background: boolean
  disabled: boolean
}): string[] {
  return [
    'gtabs',
    `gtabs--${props.preset}`,
    `gtabs--${props.size}`,
    `gtabs--${props.width}`,
    `gtabs--${props.align}`,
    props.background ? 'gtabs--background' : '',
    props.disabled ? 'gtabs--disabled' : '',
  ].filter(Boolean)
}
