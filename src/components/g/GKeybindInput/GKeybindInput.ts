export type GKeybindInputPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GKeybindInputSize = 'sm' | 'md' | 'lg'
export type GKeybindInputWidth = 'auto' | 'full'

export interface GKeybindInputProps {
  modelValue?: string | null
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  preset?: GKeybindInputPreset
  size?: GKeybindInputSize
  width?: GKeybindInputWidth
  background?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  prompt?: string
  cancelOnEscape?: boolean
  title?: string
  ariaLabel?: string
  id?: string
  name?: string
}

export interface GKeybindInputEmits {
  'update:modelValue': [value: string | null]
  change: [value: string | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  'capture-start': []
  'capture-end': [value: string | null]
  clear: []
}

export function buildGKeybindInputClasses(props: {
  preset: GKeybindInputPreset
  size: GKeybindInputSize
  width: GKeybindInputWidth
  background: boolean
  disabled: boolean
  readonly: boolean
  focused: boolean
  capturing: boolean
  hasValue: boolean
  hasError: boolean
  clearable: boolean
}): string[] {
  return [
    'gkeybindinput',
    `gkeybindinput--${props.preset}`,
    `gkeybindinput--${props.size}`,
    `gkeybindinput--${props.width}`,
    props.background ? 'gkeybindinput--background' : '',
    props.disabled ? 'gkeybindinput--disabled' : '',
    props.readonly ? 'gkeybindinput--readonly' : '',
    props.focused ? 'gkeybindinput--focused' : '',
    props.capturing ? 'gkeybindinput--capturing' : '',
    props.hasValue ? 'gkeybindinput--filled' : '',
    props.hasError ? 'gkeybindinput--error' : '',
    props.clearable ? 'gkeybindinput--clearable' : '',
  ].filter(Boolean)
}

const modifierOrder = ['Ctrl', 'Alt', 'Shift', 'Meta'] as const

function normalizeModifierKey(key: string): string | null {
  switch (key) {
    case 'Control':
      return 'Ctrl'
    case 'Alt':
      return 'Alt'
    case 'Shift':
      return 'Shift'
    case 'Meta':
      return 'Meta'
    default:
      return null
  }
}

export function normalizeKeyName(key: string): string {
  if (key === ' ') {
    return 'Space'
  }
  if (key === 'Escape') {
    return 'Esc'
  }
  if (key.startsWith('Arrow')) {
    return key.replace('Arrow', '')
  }
  if (key.length === 1) {
    return key.toUpperCase()
  }
  return key
}

export function formatKeybind(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>): string | null {
  const modifiers = modifierOrder.filter((modifier) => {
    if (modifier === 'Ctrl') {
      return event.ctrlKey
    }
    if (modifier === 'Alt') {
      return event.altKey
    }
    if (modifier === 'Shift') {
      return event.shiftKey
    }
    return event.metaKey
  })

  const modifierKey = normalizeModifierKey(event.key)
  if (modifierKey) {
    return null
  }

  const key = normalizeKeyName(event.key)
  if (key === 'Esc') {
    return null
  }

  return [...modifiers, key].join('+')
}
