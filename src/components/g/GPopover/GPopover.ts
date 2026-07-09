import type { GIconName } from '../GIcon/GIcon'

export type GPopoverPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GPopoverVariant = 'soft' | 'solid' | 'outline'
export type GPopoverSize = 'sm' | 'md' | 'lg'
export type GPopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
export type GPopoverTrigger = 'click' | 'hover' | 'manual'

export interface GPopoverProps {
  modelValue?: boolean
  title?: string
  message?: string
  icon?: GIconName
  iconSrc?: string
  preset?: GPopoverPreset
  variant?: GPopoverVariant
  size?: GPopoverSize
  placement?: GPopoverPlacement
  trigger?: GPopoverTrigger
  closable?: boolean
  outsideClosable?: boolean
  escapeClosable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  ariaLabel?: string
  ariaDescribedby?: string
}

export interface GPopoverEmits {
  'update:modelValue': [value: boolean]
  open: []
  close: [reason?: 'button' | 'outside' | 'escape']
  click: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

export function buildGPopoverClasses(props: {
  preset: GPopoverPreset
  variant: GPopoverVariant
  size: GPopoverSize
  placement: GPopoverPlacement
  open: boolean
  closable: boolean
  hasIcon: boolean
}) {
  return [
    'gpopover',
    `gpopover--${props.preset}`,
    `gpopover--${props.variant}`,
    `gpopover--${props.size}`,
    `gpopover--${props.placement}`,
    props.open ? 'gpopover--open' : '',
    props.closable ? 'gpopover--closable' : '',
    props.hasIcon ? 'gpopover--icon' : '',
  ].filter(Boolean)
}
