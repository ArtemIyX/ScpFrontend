export type GListItemTone = 'default' | 'accent' | 'danger' | 'warning' | 'purple'

export interface GListItemProps {
  text?: string
  secondary?: string
  tone?: GListItemTone
  selected?: boolean
  disabled?: boolean
}

export function buildGListItemClasses(props: {
  tone: GListItemTone
  selected: boolean
  disabled: boolean
}) {
  return [
    'glistitem',
    `glistitem--${props.tone}`,
    props.selected ? 'glistitem--selected' : '',
    props.disabled ? 'glistitem--disabled' : '',
  ].filter(Boolean)
}
