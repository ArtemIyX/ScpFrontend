export type GBadgePreset = 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GBadgeVariant = 'solid' | 'soft' | 'outline'
export type GBadgeSize = 'sm' | 'md' | 'lg'
export type GBadgeAs = 'span' | 'div' | 'button'

export interface GBadgeProps {
  text?: string
  preset?: GBadgePreset
  variant?: GBadgeVariant
  size?: GBadgeSize
  dot?: boolean
  interactive?: boolean
  as?: GBadgeAs
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
  title?: string
}

export interface GBadgeEmits {
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  pointerenter: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
}

export function buildGBadgeClasses(props: {
  preset: GBadgePreset
  variant: GBadgeVariant
  size: GBadgeSize
  dot: boolean
  interactive: boolean
  disabled: boolean
}): string[] {
  return [
    'gbadge',
    `gbadge--${props.preset}`,
    `gbadge--${props.variant}`,
    `gbadge--${props.size}`,
    props.dot ? 'gbadge--dot' : '',
    props.interactive ? 'gbadge--interactive' : '',
    props.disabled ? 'gbadge--disabled' : '',
  ].filter(Boolean)
}
