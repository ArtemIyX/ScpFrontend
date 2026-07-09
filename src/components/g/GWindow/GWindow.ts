export type GWindowPadding = 'sm' | 'md' | 'lg'
export type GWindowWidth = 'auto' | 'full'
export type GWindowHeight = 'auto' | 'full'
export type GWindowAs = 'div' | 'section' | 'article'

export interface GWindowProps {
  title?: string
  subtitle?: string
  status?: string
  padding?: GWindowPadding
  width?: GWindowWidth
  height?: GWindowHeight
  strong?: boolean
  closable?: boolean
  as?: GWindowAs
  closeLabel?: string
}

export interface GWindowEmits {
  close: [event: MouseEvent]
}

export function buildGWindowClasses(props: {
  padding: GWindowPadding
  width: GWindowWidth
  height: GWindowHeight
  strong: boolean
}): string[] {
  return [
    'gwindow',
    'ui-panel',
    `gwindow--${props.padding}`,
    `gwindow--width-${props.width}`,
    `gwindow--height-${props.height}`,
    props.strong ? 'gwindow--strong' : '',
    props.strong ? 'ui-panel--strong' : '',
  ].filter(Boolean)
}
