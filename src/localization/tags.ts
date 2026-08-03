/** Gameplay-tag names for localization tables owned by the game client. */
export const LocalizationTable = {
  Input: 'Local.Input',
  Menu: 'Local.Menu',
  Settings: 'Local.Settings',
  SettingsAudio: 'Local.Settings.Audio',
  SettingsControls: 'Local.Settings.Controls',
  SettingsDisplay: 'Local.Settings.Display',
  SettingsGameplay: 'Local.Settings.Gameplay',
  SettingsGraphics: 'Local.Settings.Graphics',
  SettingsKeyBindings: 'Local.Settings.KeyBindings',
} as const

export type LocalizationTable = (typeof LocalizationTable)[keyof typeof LocalizationTable]
