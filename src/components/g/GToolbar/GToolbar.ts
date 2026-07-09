export type GToolbarPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GToolbarSize = 'sm' | 'md' | 'lg'
export type GToolbarWidth = 'auto' | 'full'
export type GToolbarAlign = 'start' | 'center' | 'end' | 'between'
export type GToolbarAs = 'div' | 'section' | 'nav'

export interface GToolbarProps {
  title?: string
  subtitle?: string
  status?: string
  preset?: GToolbarPreset
  size?: GToolbarSize
  width?: GToolbarWidth
  align?: GToolbarAlign
  wrap?: boolean
  background?: boolean
  as?: GToolbarAs
  ariaLabel?: string
}

export function buildGToolbarClasses(props: {
  preset: GToolbarPreset
  size: GToolbarSize
  width: GToolbarWidth
  align: GToolbarAlign
  wrap: boolean
  background: boolean
}) {
  return [
    'gtoolbar',
    `gtoolbar--${props.preset}`,
    `gtoolbar--${props.size}`,
    `gtoolbar--${props.width}`,
    `gtoolbar--${props.align}`,
    props.wrap ? 'gtoolbar--wrap' : '',
    props.background ? 'gtoolbar--background' : '',
  ].filter(Boolean)
}
