export type GInputPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GInputSize = 'sm' | 'md' | 'lg'
export type GInputWidth = 'auto' | 'full'

export interface GInputProps {
  modelValue?: string | number | null
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  preset?: GInputPreset
  size?: GInputSize
  width?: GInputWidth
  background?: boolean
  type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number'
  name?: string
  id?: string
  autocomplete?: string
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  maxlength?: number
  minlength?: number
  min?: string | number
  max?: string | number
  step?: string | number
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  autofocus?: boolean
  spellcheck?: boolean
  ariaLabel?: string
}

export interface GInputEmits {
  'update:modelValue': [value: string]
  input: [event: InputEvent]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  clear: []
  enter: [event: KeyboardEvent]
}

export function buildGInputClasses(props: {
  preset: GInputPreset
  size: GInputSize
  width: GInputWidth
  background: boolean
  disabled: boolean
  readonly: boolean
  focused: boolean
  hasValue: boolean
  hasError: boolean
  clearable: boolean
  hasPrefix: boolean
  hasSuffix: boolean
}): string[] {
  return [
    'ginput',
    `ginput--${props.preset}`,
    `ginput--${props.size}`,
    `ginput--${props.width}`,
    props.background ? 'ginput--background' : '',
    props.disabled ? 'ginput--disabled' : '',
    props.readonly ? 'ginput--readonly' : '',
    props.focused ? 'ginput--focused' : '',
    props.hasValue ? 'ginput--filled' : '',
    props.hasError ? 'ginput--error' : '',
    props.clearable ? 'ginput--clearable' : '',
    props.hasPrefix ? 'ginput--prefix' : '',
    props.hasSuffix ? 'ginput--suffix' : '',
  ].filter(Boolean)
}
