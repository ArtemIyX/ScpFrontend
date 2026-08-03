export type GTooltipPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GTooltipSize = 'sm' | 'md' | 'lg'
export type GTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface GTooltipProps {
  text?: string
  table?: import('@/localization/tags').LocalizationTable
  textKey?: string
  preset?: GTooltipPreset
  size?: GTooltipSize
  placement?: GTooltipPlacement
  disabled?: boolean
  delay?: number
  ariaLabel?: string
}

export function buildGTooltipClasses(props: {
  preset: GTooltipPreset
  size: GTooltipSize
  placement: GTooltipPlacement
  disabled: boolean
  visible: boolean
}) {
  return [
    'gtooltip',
    `gtooltip--${props.preset}`,
    `gtooltip--${props.size}`,
    `gtooltip--${props.placement}`,
    props.disabled ? 'gtooltip--disabled' : '',
    props.visible ? 'gtooltip--visible' : '',
  ].filter(Boolean)
}
