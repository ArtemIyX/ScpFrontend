export type GComboPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GComboSize = 'sm' | 'md' | 'lg'
export type GComboWidth = 'auto' | 'full'
export type GComboAlign = 'start' | 'end'

export interface GComboOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface GComboProps {
  modelValue?: string | number | null
  options?: GComboOption[]
  label?: string
  table?: import('@/localization/tags').LocalizationTable
  labelKey?: string
  helper?: string
  helperKey?: string
  error?: string
  errorKey?: string
  placeholder?: string
  placeholderKey?: string
  preset?: GComboPreset
  size?: GComboSize
  width?: GComboWidth
  align?: GComboAlign
  background?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  title?: string
  ariaLabel?: string
  id?: string
  name?: string
}

export interface GComboEmits {
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null, option?: GComboOption | null]
  open: []
  close: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  select: [option: GComboOption]
  clear: []
}

export function buildGComboClasses(props: {
  preset: GComboPreset
  size: GComboSize
  width: GComboWidth
  align: GComboAlign
  background: boolean
  disabled: boolean
  readonly: boolean
  open: boolean
  hasValue: boolean
  hasError: boolean
  clearable: boolean
}) {
  return [
    'gcombo',
    `gcombo--${props.preset}`,
    `gcombo--${props.size}`,
    `gcombo--${props.width}`,
    `gcombo--${props.align}`,
    props.background ? 'gcombo--background' : '',
    props.disabled ? 'gcombo--disabled' : '',
    props.readonly ? 'gcombo--readonly' : '',
    props.open ? 'gcombo--open' : '',
    props.hasValue ? 'gcombo--filled' : '',
    props.hasError ? 'gcombo--error' : '',
    props.clearable ? 'gcombo--clearable' : '',
  ].filter(Boolean)
}
