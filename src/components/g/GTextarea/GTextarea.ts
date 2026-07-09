export type GTextareaPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GTextareaSize = 'sm' | 'md' | 'lg'
export type GTextareaWidth = 'auto' | 'full'
export type GTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface GTextareaProps {
  modelValue?: string | number | null
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  preset?: GTextareaPreset
  size?: GTextareaSize
  width?: GTextareaWidth
  background?: boolean
  rows?: number
  resize?: GTextareaResize
  maxlength?: number
  minlength?: number
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  spellcheck?: boolean
  showCounter?: boolean
  ariaLabel?: string
  id?: string
  name?: string
}

export interface GTextareaEmits {
  'update:modelValue': [value: string]
  input: [event: InputEvent]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  enter: [event: KeyboardEvent]
}

export function buildGTextareaClasses(props: {
  preset: GTextareaPreset
  size: GTextareaSize
  width: GTextareaWidth
  background: boolean
  disabled: boolean
  readonly: boolean
  focused: boolean
  hasValue: boolean
  hasError: boolean
  showCounter: boolean
}): string[] {
  return [
    'gtextarea',
    `gtextarea--${props.preset}`,
    `gtextarea--${props.size}`,
    `gtextarea--${props.width}`,
    props.background ? 'gtextarea--background' : '',
    props.disabled ? 'gtextarea--disabled' : '',
    props.readonly ? 'gtextarea--readonly' : '',
    props.focused ? 'gtextarea--focused' : '',
    props.hasValue ? 'gtextarea--filled' : '',
    props.hasError ? 'gtextarea--error' : '',
    props.showCounter ? 'gtextarea--counter' : '',
  ].filter(Boolean)
}
