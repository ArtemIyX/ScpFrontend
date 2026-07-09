export type GIconName =
  | 'search'
  | 'close'
  | 'plus'
  | 'minus'
  | 'check'
  | 'info'
  | 'warning'
  | 'menu'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'

export type GIconPreset = 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GIconSize = 'sm' | 'md' | 'lg'

export interface GIconProps {
  name?: GIconName
  src?: string
  size?: GIconSize | string
  preset?: GIconPreset
  decorative?: boolean
  ariaLabel?: string
  title?: string
  spin?: boolean
}

export function buildGIconClasses(props: {
  name: GIconName
  hasSrc: boolean
  size: GIconSize | string
  preset: GIconPreset
  spin: boolean
}) {
  return [
    'gicon',
    `gicon--${props.name}`,
    props.hasSrc ? 'gicon--src' : '',
    `gicon--${props.preset}`,
    props.size === 'sm' || props.size === 'md' || props.size === 'lg' ? `gicon--${props.size}` : '',
    props.spin ? 'gicon--spin' : '',
  ].filter(Boolean)
}
