export type GSectionPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GSectionSize = 'sm' | 'md' | 'lg'
export type GSectionWidth = 'auto' | 'full'

export interface GSectionProps {
  title?: string
  subtitle?: string
  status?: string
  preset?: GSectionPreset
  size?: GSectionSize
  width?: GSectionWidth
  background?: boolean
  titleAs?: 'h2' | 'h3' | 'h4' | 'div'
  ariaLabel?: string
}

export function buildGSectionClasses(props: {
  preset: GSectionPreset
  size: GSectionSize
  width: GSectionWidth
  background: boolean
}) {
  return [
    'gsection',
    `gsection--${props.preset}`,
    `gsection--${props.size}`,
    `gsection--${props.width}`,
    props.background ? 'gsection--background' : '',
  ].filter(Boolean)
}
