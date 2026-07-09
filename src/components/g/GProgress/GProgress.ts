export type GProgressPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GProgressSize = 'sm' | 'md' | 'lg'
export type GProgressWidth = 'auto' | 'full'
export type GProgressVariant = 'bar' | 'striped' | 'ring'
export type GProgressValuePosition = 'prefix' | 'suffix'

export interface GProgressProps {
  modelValue?: number | null
  label?: string
  helper?: string
  error?: string
  preset?: GProgressPreset
  size?: GProgressSize
  width?: GProgressWidth
  variant?: GProgressVariant
  background?: boolean
  min?: number
  max?: number
  showValue?: boolean
  valueLabel?: string
  valuePrefix?: string
  valueSuffix?: string
  valuePosition?: GProgressValuePosition
  ariaLabel?: string
}

export function buildGProgressClasses(props: {
  preset: GProgressPreset
  size: GProgressSize
  width: GProgressWidth
  variant: GProgressVariant
  background: boolean
  hasError: boolean
  showValue: boolean
}): string[] {
  return [
    'gprogress',
    `gprogress--${props.preset}`,
    `gprogress--${props.size}`,
    `gprogress--${props.width}`,
    `gprogress--${props.variant}`,
    props.background ? 'gprogress--background' : '',
    props.hasError ? 'gprogress--error' : '',
    props.showValue ? 'gprogress--value' : '',
  ].filter(Boolean)
}
