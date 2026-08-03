export type GButtonPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GButtonSize = 'sm' | 'md' | 'lg'
export type GButtonShape = 'soft' | 'block' | 'chip'
export type GButtonWidth = 'auto' | 'full'
export type GButtonBackground = boolean

export interface GButtonProps {
  text?: string
  table?: import('@/localization/tags').LocalizationTable
  textKey?: string
  preset?: GButtonPreset
  size?: GButtonSize
  shape?: GButtonShape
  width?: GButtonWidth
  background?: GButtonBackground
  type?: 'button' | 'submit' | 'reset'
  iconOnly?: boolean
  busy?: boolean
  disabled?: boolean
  pressed?: boolean
  ariaLabel?: string
  title?: string
}

export interface GButtonEmits {
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  pointerenter: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGButtonClasses(props: {
  preset: GButtonPreset
  size: GButtonSize
  shape: GButtonShape
  width: GButtonWidth
  background: GButtonBackground
  iconOnly: boolean
  busy: boolean
  disabled: boolean
  pressed: boolean
}): string[] {
  return [
    'gbutton',
    `gbutton--${props.preset}`,
    `gbutton--${props.size}`,
    `gbutton--${props.shape}`,
    `gbutton--${props.width}`,
    props.background ? 'gbutton--background' : '',
    props.iconOnly ? 'gbutton--icon-only' : '',
    props.busy ? 'gbutton--busy' : '',
    props.disabled ? 'gbutton--disabled' : '',
    props.pressed ? 'gbutton--pressed' : '',
  ].filter(Boolean)
}
