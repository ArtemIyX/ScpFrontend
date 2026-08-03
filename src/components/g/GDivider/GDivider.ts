export type GDividerPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GDividerSize = 'sm' | 'md' | 'lg'
export type GDividerOrientation = 'horizontal' | 'vertical'

export interface GDividerProps {
  label?: string
  table?: import('@/localization/tags').LocalizationTable
  labelKey?: string
  preset?: GDividerPreset
  size?: GDividerSize
  orientation?: GDividerOrientation
  inset?: boolean
  ariaLabel?: string
}

export function buildGDividerClasses(props: {
  preset: GDividerPreset
  size: GDividerSize
  orientation: GDividerOrientation
  inset: boolean
}) {
  return [
    'gdivider',
    `gdivider--${props.preset}`,
    `gdivider--${props.size}`,
    `gdivider--${props.orientation}`,
    props.inset ? 'gdivider--inset' : '',
  ].filter(Boolean)
}
