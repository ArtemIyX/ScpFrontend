export type GTilePreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GTileSize = 'sm' | 'md' | 'lg'
export type GTileWidth = 'auto' | 'full'
export type GTileAs = 'div' | 'section' | 'article'

export interface GTileProps {
  label?: string
  value?: string
  subtitle?: string
  status?: string
  preset?: GTilePreset
  size?: GTileSize
  width?: GTileWidth
  icon?: boolean
  as?: GTileAs
  ariaLabel?: string
  title?: string
}

export function buildGTileClasses(props: {
  preset: GTilePreset
  size: GTileSize
  width: GTileWidth
  icon: boolean
}): string[] {
  return [
    'gtile',
    `gtile--${props.preset}`,
    `gtile--${props.size}`,
    `gtile--${props.width}`,
    props.icon ? 'gtile--icon' : '',
  ].filter(Boolean)
}
