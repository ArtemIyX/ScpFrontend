export type GRadioPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GRadioSize = 'sm' | 'md' | 'lg'
export type GRadioWidth = 'auto' | 'full'
export type GRadioVariant = 'circle' | 'square' | 'lever'

export interface GRadioProps {
  modelValue?: string | number | boolean | null
  value?: string | number | boolean | null
  label?: string
  helper?: string
  error?: string
  preset?: GRadioPreset
  size?: GRadioSize
  width?: GRadioWidth
  variant?: GRadioVariant
  background?: boolean
  disabled?: boolean
  id?: string
  name?: string
  ariaLabel?: string
}

export interface GRadioEmits {
  'update:modelValue': [value: string | number | boolean | null]
  change: [event: Event, value: string | number | boolean | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGRadioClasses(props: {
  preset: GRadioPreset
  size: GRadioSize
  width: GRadioWidth
  variant: GRadioVariant
  background: boolean
  disabled: boolean
  checked: boolean
  hasError: boolean
}) {
  return [
    'gradio',
    `gradio--${props.preset}`,
    `gradio--${props.size}`,
    `gradio--${props.width}`,
    `gradio--${props.variant}`,
    props.background ? 'gradio--background' : '',
    props.disabled ? 'gradio--disabled' : '',
    props.checked ? 'gradio--checked' : '',
    props.hasError ? 'gradio--error' : '',
  ].filter(Boolean)
}
