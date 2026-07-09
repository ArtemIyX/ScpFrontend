export type GMenuListPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GMenuListSize = 'sm' | 'md' | 'lg'
export type GMenuListWidth = 'auto' | 'full'
export type GMenuListItemTone = 'default' | 'accent' | 'danger' | 'warning' | 'purple'

export interface GMenuListItem {
  kind?: 'item'
  value: string | number
  label: string
  description?: string
  meta?: string
  shortcut?: string
  badge?: string
  disabled?: boolean
  selected?: boolean
  tone?: GMenuListItemTone
}

export interface GMenuListSeparator {
  kind: 'separator'
  label?: string
}

export type GMenuListEntry = GMenuListItem | GMenuListSeparator

export interface GMenuListProps {
  modelValue?: string | number | null
  items?: GMenuListEntry[]
  label?: string
  helper?: string
  preset?: GMenuListPreset
  size?: GMenuListSize
  width?: GMenuListWidth
  maxHeight?: string
  background?: boolean
  disabled?: boolean
  readonly?: boolean
  title?: string
  ariaLabel?: string
  id?: string
}

export interface GMenuListEmits {
  'update:modelValue': [value: string | number | null]
  select: [item: GMenuListItem]
  itemClick: [item: GMenuListItem]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGMenuListClasses(props: {
  preset: GMenuListPreset
  size: GMenuListSize
  width: GMenuListWidth
  background: boolean
  disabled: boolean
  readonly: boolean
}) {
  return [
    'gmenulist',
    `gmenulist--${props.preset}`,
    `gmenulist--${props.size}`,
    `gmenulist--${props.width}`,
    props.background ? 'gmenulist--background' : '',
    props.disabled ? 'gmenulist--disabled' : '',
    props.readonly ? 'gmenulist--readonly' : '',
  ].filter(Boolean)
}

export function isMenuListSeparator(entry: GMenuListEntry): entry is GMenuListSeparator {
  return entry.kind === 'separator'
}

export function isMenuListItem(entry: GMenuListEntry): entry is GMenuListItem {
  return entry.kind !== 'separator'
}
