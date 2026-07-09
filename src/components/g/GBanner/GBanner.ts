import type { GIconName } from '../GIcon/GIcon'

export type GBannerPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GBannerVariant = 'soft' | 'solid' | 'outline'
export type GBannerSize = 'sm' | 'md' | 'lg'
export type GBannerWidth = 'auto' | 'full'
export type GBannerAs = 'div' | 'section' | 'article'

export interface GBannerProps {
  title?: string
  message?: string
  icon?: GIconName
  iconSrc?: string
  preset?: GBannerPreset
  variant?: GBannerVariant
  size?: GBannerSize
  width?: GBannerWidth
  closable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  as?: GBannerAs
  ariaLabel?: string
  titleAttr?: string
}

export interface GBannerEmits {
  close: [reason: 'button']
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGBannerClasses(props: {
  preset: GBannerPreset
  variant: GBannerVariant
  size: GBannerSize
  width: GBannerWidth
  closable: boolean
  hasIcon: boolean
}) {
  return [
    'gbanner',
    `gbanner--${props.preset}`,
    `gbanner--${props.variant}`,
    `gbanner--${props.size}`,
    `gbanner--${props.width}`,
    props.closable ? 'gbanner--closable' : '',
    props.hasIcon ? 'gbanner--icon' : '',
  ].filter(Boolean)
}

