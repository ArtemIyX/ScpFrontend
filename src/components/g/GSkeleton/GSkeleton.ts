export type GSkeletonPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GSkeletonSize = 'sm' | 'md' | 'lg'
export type GSkeletonWidth = 'auto' | 'full'
export type GSkeletonShape = 'block' | 'circle'

export interface GSkeletonProps {
  loading?: boolean
  preset?: GSkeletonPreset
  size?: GSkeletonSize
  width?: GSkeletonWidth
  shape?: GSkeletonShape
  lines?: number
  background?: boolean
  titleWidth?: string
  circleSize?: string
  active?: boolean
  ariaLabel?: string
  title?: string
}

export function buildGSkeletonClasses(props: {
  preset: GSkeletonPreset
  size: GSkeletonSize
  width: GSkeletonWidth
  shape: GSkeletonShape
  background: boolean
  loading: boolean
  active: boolean
}) {
  return [
    'gskeleton',
    `gskeleton--${props.preset}`,
    `gskeleton--${props.size}`,
    `gskeleton--${props.width}`,
    `gskeleton--${props.shape}`,
    props.background ? 'gskeleton--background' : '',
    props.loading ? 'gskeleton--loading' : 'gskeleton--ready',
    props.active ? 'gskeleton--active' : '',
  ].filter(Boolean)
}
