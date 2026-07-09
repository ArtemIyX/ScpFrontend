export type GListPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GListMarker = 'bullet' | 'indexed' | 'none'
export type GListSize = 'sm' | 'md' | 'lg'
export type GListWidth = 'auto' | 'full'

export interface GListProps {
  label?: string
  helper?: string
  preset?: GListPreset
  marker?: GListMarker
  size?: GListSize
  width?: GListWidth
  background?: boolean
  compact?: boolean
  title?: string
  ariaLabel?: string
  id?: string
}

export function buildGListClasses(props: {
  preset: GListPreset
  marker: GListMarker
  size: GListSize
  width: GListWidth
  background: boolean
  compact: boolean
}) {
  return [
    'glist',
    `glist--${props.preset}`,
    `glist--${props.marker}`,
    `glist--${props.size}`,
    `glist--${props.width}`,
    props.background ? 'glist--background' : '',
    props.compact ? 'glist--compact' : '',
  ].filter(Boolean)
}
