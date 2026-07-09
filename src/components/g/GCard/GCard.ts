export type GCardPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GCardSize = 'sm' | 'md' | 'lg'
export type GCardWidth = 'auto' | 'full'
export type GCardAs = 'div' | 'section' | 'article'

export interface GCardProps {
  title?: string
  subtitle?: string
  meta?: string
  preset?: GCardPreset
  size?: GCardSize
  width?: GCardWidth
  strong?: boolean
  as?: GCardAs
  ariaLabel?: string
  titleAttr?: string
}

export function buildGCardClasses(props: {
  preset: GCardPreset
  size: GCardSize
  width: GCardWidth
  strong: boolean
}): string[] {
  return [
    'gcard',
    `gcard--${props.preset}`,
    `gcard--${props.size}`,
    `gcard--${props.width}`,
    props.strong ? 'gcard--strong' : '',
  ].filter(Boolean)
}
