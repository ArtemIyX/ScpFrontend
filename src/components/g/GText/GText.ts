export type GTextPreset =
  | 'body'
  | 'muted'
  | 'title'
  | 'header'
  | 'caps'
  | 'technical'
  | 'handwrite'

export interface GTextProps {
  text?: string
  preset?: GTextPreset
  as?: 'p' | 'span' | 'div'
}

export function buildGTextClasses(preset: GTextPreset): string[] {
  return ['gtext', `gtext--${preset}`]
}
