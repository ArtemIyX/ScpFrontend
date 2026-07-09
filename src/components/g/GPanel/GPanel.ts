export type GPanelPadding = 'sm' | 'md' | 'lg'
export type GPanelWidth = 'auto' | 'full'
export type GPanelAs = 'div' | 'section' | 'article'

export interface GPanelProps {
  title?: string
  subtitle?: string
  padding?: GPanelPadding
  width?: GPanelWidth
  strong?: boolean
  as?: GPanelAs
}

export function buildGPanelClasses(props: {
  padding: GPanelPadding
  width: GPanelWidth
  strong: boolean
}): string[] {
  return [
    'gpanel',
    'ui-panel',
    `gpanel--${props.padding}`,
    `gpanel--${props.width}`,
    props.strong ? 'gpanel--strong' : '',
    props.strong ? 'ui-panel--strong' : '',
  ].filter(Boolean)
}
