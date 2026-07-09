import type { GIconName } from '../GIcon/GIcon'

export type GAccordionPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GAccordionVariant = 'soft' | 'solid' | 'outline'
export type GAccordionSize = 'sm' | 'md' | 'lg'
export type GAccordionWidth = 'auto' | 'full'
export type GAccordionValue = string | number

export interface GAccordionItem {
  value: GAccordionValue
  title: string
  subtitle?: string
  note?: string
  icon?: GIconName
  iconSrc?: string
  badge?: string | number
  disabled?: boolean
}

export interface GAccordionProps {
  modelValue?: GAccordionValue | GAccordionValue[] | null
  items?: GAccordionItem[]
  multiple?: boolean
  preset?: GAccordionPreset
  variant?: GAccordionVariant
  size?: GAccordionSize
  width?: GAccordionWidth
  background?: boolean
  flush?: boolean
  ariaLabel?: string
}

export interface GAccordionEmits {
  'update:modelValue': [value: GAccordionValue | GAccordionValue[] | null]
  change: [value: GAccordionValue | GAccordionValue[] | null, item?: GAccordionItem | null]
  open: [item: GAccordionItem]
  close: [item: GAccordionItem]
  keydown: [event: KeyboardEvent]
}

export function buildGAccordionClasses(props: {
  preset: GAccordionPreset
  variant: GAccordionVariant
  size: GAccordionSize
  width: GAccordionWidth
  background: boolean
  flush: boolean
}) {
  return [
    'gaccordion',
    `gaccordion--${props.preset}`,
    `gaccordion--${props.variant}`,
    `gaccordion--${props.size}`,
    `gaccordion--${props.width}`,
    props.background ? 'gaccordion--background' : '',
    props.flush ? 'gaccordion--flush' : '',
  ].filter(Boolean)
}
