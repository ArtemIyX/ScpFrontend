export type GLabelPreset = 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GLabelSize = 'sm' | 'md' | 'lg'
export type GLabelKind = 'field' | 'section' | 'caption' | 'tag'
export type GLabelAs = 'span' | 'div' | 'p' | 'label'

export interface GLabelProps {
  text?: string
  preset?: GLabelPreset
  size?: GLabelSize
  kind?: GLabelKind
  as?: GLabelAs
  title?: string
  ariaLabel?: string
}

export function buildGLabelClasses(props: {
  preset: GLabelPreset
  size: GLabelSize
  kind: GLabelKind
}): string[] {
  return [
    'glabel',
    `glabel--${props.preset}`,
    `glabel--${props.size}`,
    `glabel--${props.kind}`,
  ]
}
