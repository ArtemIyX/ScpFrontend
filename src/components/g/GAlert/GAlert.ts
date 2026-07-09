import type { GIconName } from '../GIcon/GIcon'

export type GAlertPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GAlertVariant = 'soft' | 'solid' | 'outline'
export type GAlertSize = 'sm' | 'md' | 'lg'
export type GAlertWidth = 'auto' | 'full'
export type GAlertAs = 'div' | 'section' | 'article'

export interface GAlertProps {
  title?: string
  message?: string
  icon?: GIconName
  iconSrc?: string
  preset?: GAlertPreset
  variant?: GAlertVariant
  size?: GAlertSize
  width?: GAlertWidth
  closable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  as?: GAlertAs
  ariaLabel?: string
  titleAttr?: string
}

export interface GAlertEmits {
  close: [reason: 'button']
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}

export function buildGAlertClasses(props: {
  preset: GAlertPreset
  variant: GAlertVariant
  size: GAlertSize
  width: GAlertWidth
  closable: boolean
  hasIcon: boolean
}) {
  return [
    'galert',
    `galert--${props.preset}`,
    `galert--${props.variant}`,
    `galert--${props.size}`,
    `galert--${props.width}`,
    props.closable ? 'galert--closable' : '',
    props.hasIcon ? 'galert--icon' : '',
  ].filter(Boolean)
}

