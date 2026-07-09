export type GNumberInputPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GNumberInputSize = 'sm' | 'md' | 'lg'
export type GNumberInputWidth = 'auto' | 'full'
export type GNumberInputMode = 'integer' | 'float'

export interface GNumberInputProps {
  modelValue?: number | null
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  preset?: GNumberInputPreset
  size?: GNumberInputSize
  width?: GNumberInputWidth
  background?: boolean
  mode?: GNumberInputMode
  min?: number
  max?: number
  step?: number
  precision?: number
  stepButtons?: boolean
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  showValue?: boolean
  valueSuffix?: string
  id?: string
  name?: string
  ariaLabel?: string
}

export interface GNumberInputEmits {
  'update:modelValue': [value: number | null]
  input: [event: InputEvent]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  increment: [value: number]
  decrement: [value: number]
}

export function buildGNumberInputClasses(props: {
  preset: GNumberInputPreset
  size: GNumberInputSize
  width: GNumberInputWidth
  background: boolean
  disabled: boolean
  readonly: boolean
  focused: boolean
  hasValue: boolean
  hasError: boolean
  stepButtons: boolean
  showValue: boolean
  mode: GNumberInputMode
}): string[] {
  return [
    'gnumberinput',
    `gnumberinput--${props.preset}`,
    `gnumberinput--${props.size}`,
    `gnumberinput--${props.width}`,
    `gnumberinput--${props.mode}`,
    props.background ? 'gnumberinput--background' : '',
    props.disabled ? 'gnumberinput--disabled' : '',
    props.readonly ? 'gnumberinput--readonly' : '',
    props.focused ? 'gnumberinput--focused' : '',
    props.hasValue ? 'gnumberinput--filled' : '',
    props.hasError ? 'gnumberinput--error' : '',
    props.stepButtons ? 'gnumberinput--step-buttons' : '',
    props.showValue ? 'gnumberinput--show-value' : '',
  ].filter(Boolean)
}

export function clampNumber(value: number, min?: number, max?: number): number {
  let result = value
  if (typeof min === 'number' && Number.isFinite(min)) {
    result = Math.max(min, result)
  }
  if (typeof max === 'number' && Number.isFinite(max)) {
    result = Math.min(max, result)
  }
  return result
}

export function normalizeNumber(value: number, mode: GNumberInputMode, precision?: number): number {
  if (mode === 'integer') {
    return Math.round(value)
  }

  const resolvedPrecision = typeof precision === 'number' ? precision : 2
  return Number(value.toFixed(Math.max(0, resolvedPrecision)))
}

export function parseNumberInput(value: string, mode: GNumberInputMode): number | null {
  if (value.trim().length === 0) {
    return null
  }

  const parsed = mode === 'integer' ? Number.parseInt(value, 10) : Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}
