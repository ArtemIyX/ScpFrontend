export type GFieldPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GFieldSize = 'sm' | 'md' | 'lg'
export type GFieldWidth = 'auto' | 'full'
export type GFieldAlign = 'start' | 'center' | 'end'
export type GFieldLayout = 'stack' | 'row'

export interface GFieldProps {
  label?: string
  helper?: string
  error?: string
  preset?: GFieldPreset
  size?: GFieldSize
  width?: GFieldWidth
  align?: GFieldAlign
  layout?: GFieldLayout
  background?: boolean
  title?: string
  ariaLabel?: string
}

export function buildGFieldClasses(props: {
  preset: GFieldPreset
  size: GFieldSize
  width: GFieldWidth
  align: GFieldAlign
  layout: GFieldLayout
  background: boolean
  hasError: boolean
}) {
  return [
    'gfield',
    `gfield--${props.preset}`,
    `gfield--${props.size}`,
    `gfield--${props.width}`,
    `gfield--${props.align}`,
    `gfield--${props.layout}`,
    props.background ? 'gfield--background' : '',
    props.hasError ? 'gfield--error' : '',
  ].filter(Boolean)
}
