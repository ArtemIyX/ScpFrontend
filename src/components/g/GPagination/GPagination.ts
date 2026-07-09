export type GPaginationPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GPaginationSize = 'sm' | 'md' | 'lg'
export type GPaginationWidth = 'auto' | 'full'

export interface GPaginationItem {
  value?: number
  label: string
  current?: boolean
  disabled?: boolean
  ellipsis?: boolean
}

export interface GPaginationProps {
  modelValue?: number | null
  pageCount?: number
  boundaryCount?: number
  siblingCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  disabled?: boolean
  preset?: GPaginationPreset
  size?: GPaginationSize
  width?: GPaginationWidth
  background?: boolean
  ariaLabel?: string
  firstLabel?: string
  lastLabel?: string
  previousLabel?: string
  nextLabel?: string
}

export interface GPaginationEmits {
  'update:modelValue': [value: number]
  change: [value: number]
  previous: [value: number]
  next: [value: number]
  first: [value: number]
  last: [value: number]
  keydown: [event: KeyboardEvent]
}

export function buildGPaginationClasses(props: {
  preset: GPaginationPreset
  size: GPaginationSize
  width: GPaginationWidth
  background: boolean
  disabled: boolean
}) {
  return [
    'gpagination',
    `gpagination--${props.preset}`,
    `gpagination--${props.size}`,
    `gpagination--${props.width}`,
    props.background ? 'gpagination--background' : '',
    props.disabled ? 'gpagination--disabled' : '',
  ].filter(Boolean)
}
