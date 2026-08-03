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
  /** Gameplay-tag table and localization key. The key is rendered until Unreal replies. */
  table?: import('@/localization/tags').LocalizationTable
  textKey?: string
  preset?: GTextPreset
  as?: 'p' | 'span' | 'div'
}

export function buildGTextClasses(preset: GTextPreset): string[] {
  return ['gtext', `gtext--${preset}`]
}
