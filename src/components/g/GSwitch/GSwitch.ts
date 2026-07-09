export type GSwitchPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GSwitchSize = 'sm' | 'md' | 'lg'
export type GSwitchWidth = 'auto' | 'full'

export interface GSwitchProps {
  modelValue?: boolean
  label?: string
  helper?: string
  error?: string
  preset?: GSwitchPreset
  size?: GSwitchSize
  width?: GSwitchWidth
  background?: boolean
  disabled?: boolean
  showState?: boolean
  onLabel?: string
  offLabel?: string
  id?: string
  name?: string
  ariaLabel?: string
}

export interface GSwitchEmits {
  'update:modelValue': [value: boolean]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGSwitchClasses(props: {
  preset: GSwitchPreset
  size: GSwitchSize
  width: GSwitchWidth
  background: boolean
  disabled: boolean
  checked: boolean
  hasError: boolean
  showState: boolean
}): string[] {
  return [
    'gswitch',
    `gswitch--${props.preset}`,
    `gswitch--${props.size}`,
    `gswitch--${props.width}`,
    props.background ? 'gswitch--background' : '',
    props.disabled ? 'gswitch--disabled' : '',
    props.checked ? 'gswitch--checked' : '',
    props.hasError ? 'gswitch--error' : '',
    props.showState ? 'gswitch--state' : '',
  ].filter(Boolean)
}
