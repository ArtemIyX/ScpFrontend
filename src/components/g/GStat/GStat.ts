import type { GIconName } from '../GIcon/GIcon'

export type GStatPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GStatVariant = 'soft' | 'solid' | 'outline'
export type GStatSize = 'sm' | 'md' | 'lg'
export type GStatWidth = 'auto' | 'full'
export type GStatAs = 'div' | 'section' | 'article'

export interface GStatProps {
  label?: string
  value?: string | number
  detail?: string
  icon?: GIconName
  iconSrc?: string
  preset?: GStatPreset
  variant?: GStatVariant
  size?: GStatSize
  width?: GStatWidth
  background?: boolean
  as?: GStatAs
  ariaLabel?: string
  title?: string
}

export function buildGStatClasses(props: {
  preset: GStatPreset
  variant: GStatVariant
  size: GStatSize
  width: GStatWidth
  background: boolean
  hasIcon: boolean
}) {
  return [
    'gstat',
    `gstat--${props.preset}`,
    `gstat--${props.variant}`,
    `gstat--${props.size}`,
    `gstat--${props.width}`,
    props.background ? 'gstat--background' : '',
    props.hasIcon ? 'gstat--icon' : '',
  ].filter(Boolean)
}
