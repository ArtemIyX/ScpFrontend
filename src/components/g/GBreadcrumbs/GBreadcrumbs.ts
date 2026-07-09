import type { GIconName } from '../GIcon/GIcon'

export type GBreadcrumbsPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GBreadcrumbsSize = 'sm' | 'md' | 'lg'
export type GBreadcrumbsWidth = 'auto' | 'full'
export type GBreadcrumbsSeparator = 'chevron' | 'slash' | 'dot'

export interface GBreadcrumbItem {
  label: string
  value?: string | number
  href?: string
  target?: string
  rel?: string
  current?: boolean
  disabled?: boolean
  icon?: GIconName
  iconSrc?: string
  meta?: string
  ariaLabel?: string
}

export interface GBreadcrumbsProps {
  items?: GBreadcrumbItem[]
  preset?: GBreadcrumbsPreset
  size?: GBreadcrumbsSize
  width?: GBreadcrumbsWidth
  separator?: GBreadcrumbsSeparator
  background?: boolean
  truncate?: boolean
  ariaLabel?: string
}

export interface GBreadcrumbsEmits {
  click: [event: MouseEvent, item: GBreadcrumbItem, index: number]
  select: [item: GBreadcrumbItem, index: number]
}

export function buildGBreadcrumbsClasses(props: {
  preset: GBreadcrumbsPreset
  size: GBreadcrumbsSize
  width: GBreadcrumbsWidth
  background: boolean
  truncate: boolean
}) {
  return [
    'gbreadcrumbs',
    `gbreadcrumbs--${props.preset}`,
    `gbreadcrumbs--${props.size}`,
    `gbreadcrumbs--${props.width}`,
    props.background ? 'gbreadcrumbs--background' : '',
    props.truncate ? 'gbreadcrumbs--truncate' : '',
  ].filter(Boolean)
}
