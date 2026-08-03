export type GSliderPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GSliderSize = 'sm' | 'md' | 'lg'
export type GSliderWidth = 'auto' | 'full'

export interface GSliderProps {
  modelValue?: number | null
  label?: string
  table?: import('@/localization/tags').LocalizationTable
  labelKey?: string
  helper?: string
  helperKey?: string
  error?: string
  preset?: GSliderPreset
  size?: GSliderSize
  width?: GSliderWidth
  background?: boolean
  min?: number
  max?: number
  step?: number | string
  disabled?: boolean
  showValue?: boolean
  valueSuffix?: string
  ariaLabel?: string
  id?: string
  name?: string
}

export interface GSliderEmits {
  'update:modelValue': [value: number]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGSliderClasses(props: {
  preset: GSliderPreset
  size: GSliderSize
  width: GSliderWidth
  background: boolean
  disabled: boolean
  hasError: boolean
  showValue: boolean
}) {
  return [
    'gslider',
    `gslider--${props.preset}`,
    `gslider--${props.size}`,
    `gslider--${props.width}`,
    props.background ? 'gslider--background' : '',
    props.disabled ? 'gslider--disabled' : '',
    props.hasError ? 'gslider--error' : '',
    props.showValue ? 'gslider--value' : '',
  ].filter(Boolean)
}
