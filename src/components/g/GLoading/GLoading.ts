export type GLoadingPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GLoadingSize = 'sm' | 'md' | 'lg'
export type GLoadingWidth = 'auto' | 'full'

export interface GLoadingProps {
  label?: string
  table?: import('@/localization/tags').LocalizationTable
  labelKey?: string
  helper?: string
  helperKey?: string
  preset?: GLoadingPreset
  size?: GLoadingSize
  width?: GLoadingWidth
  background?: boolean
  centered?: boolean
  active?: boolean
  ariaLabel?: string
  title?: string
}

export function buildGLoadingClasses(props: {
  preset: GLoadingPreset
  size: GLoadingSize
  width: GLoadingWidth
  background: boolean
  centered: boolean
  active: boolean
}) {
  return [
    'gloading',
    `gloading--${props.preset}`,
    `gloading--${props.size}`,
    `gloading--${props.width}`,
    props.background ? 'gloading--background' : '',
    props.centered ? 'gloading--centered' : '',
    props.active ? 'gloading--active' : '',
  ].filter(Boolean)
}
