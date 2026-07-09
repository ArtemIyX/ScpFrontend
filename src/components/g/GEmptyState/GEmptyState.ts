import type { GIconName } from '../GIcon/GIcon'

export type GEmptyStatePreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GEmptyStateSize = 'sm' | 'md' | 'lg'
export type GEmptyStateWidth = 'auto' | 'full'

export interface GEmptyStateProps {
  title?: string
  description?: string
  helper?: string
  icon?: GIconName
  iconSrc?: string
  iconSize?: string
  preset?: GEmptyStatePreset
  size?: GEmptyStateSize
  width?: GEmptyStateWidth
  background?: boolean
  centered?: boolean
  titleAttr?: string
  ariaLabel?: string
}

export function buildGEmptyStateClasses(props: {
  preset: GEmptyStatePreset
  size: GEmptyStateSize
  width: GEmptyStateWidth
  background: boolean
  centered: boolean
  hasIcon: boolean
}) {
  return [
    'gemptystate',
    `gemptystate--${props.preset}`,
    `gemptystate--${props.size}`,
    `gemptystate--${props.width}`,
    props.background ? 'gemptystate--background' : '',
    props.centered ? 'gemptystate--centered' : '',
    props.hasIcon ? 'gemptystate--icon' : '',
  ].filter(Boolean)
}
