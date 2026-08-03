export type GCheckboxPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GCheckboxSize = 'sm' | 'md' | 'lg'
export type GCheckboxWidth = 'auto' | 'full'

export interface GCheckboxProps {
  modelValue?: boolean
  label?: string
  table?: import('@/localization/tags').LocalizationTable
  labelKey?: string
  helper?: string
  helperKey?: string
  error?: string
  preset?: GCheckboxPreset
  size?: GCheckboxSize
  width?: GCheckboxWidth
  background?: boolean
  disabled?: boolean
  indeterminate?: boolean
  id?: string
  name?: string
  ariaLabel?: string
}

export interface GCheckboxEmits {
  'update:modelValue': [value: boolean]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGCheckboxClasses(props: {
  preset: GCheckboxPreset
  size: GCheckboxSize
  width: GCheckboxWidth
  background: boolean
  disabled: boolean
  checked: boolean
  indeterminate: boolean
  hasError: boolean
}) {
  return [
    'gcheckbox',
    `gcheckbox--${props.preset}`,
    `gcheckbox--${props.size}`,
    `gcheckbox--${props.width}`,
    props.background ? 'gcheckbox--background' : '',
    props.disabled ? 'gcheckbox--disabled' : '',
    props.checked ? 'gcheckbox--checked' : '',
    props.indeterminate ? 'gcheckbox--indeterminate' : '',
    props.hasError ? 'gcheckbox--error' : '',
  ].filter(Boolean)
}
