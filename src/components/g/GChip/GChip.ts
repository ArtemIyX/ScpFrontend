export type GChipPreset = 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GChipVariant = 'solid' | 'soft' | 'outline'
export type GChipSize = 'sm' | 'md' | 'lg'
export type GChipAs = 'span' | 'div' | 'button'

export interface GChipProps {
  text?: string
  preset?: GChipPreset
  variant?: GChipVariant
  size?: GChipSize
  interactive?: boolean
  selected?: boolean
  removable?: boolean
  disabled?: boolean
  as?: GChipAs
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  removeLabel?: string
  title?: string
}

export interface GChipEmits {
  click: [event: MouseEvent]
  remove: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  pointerenter: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
}

export function buildGChipClasses(props: {
  preset: GChipPreset
  variant: GChipVariant
  size: GChipSize
  interactive: boolean
  selected: boolean
  removable: boolean
  disabled: boolean
}) {
  return [
    'gchip',
    `gchip--${props.preset}`,
    `gchip--${props.variant}`,
    `gchip--${props.size}`,
    props.interactive ? 'gchip--interactive' : '',
    props.selected ? 'gchip--selected' : '',
    props.removable ? 'gchip--removable' : '',
    props.disabled ? 'gchip--disabled' : '',
  ].filter(Boolean)
}
