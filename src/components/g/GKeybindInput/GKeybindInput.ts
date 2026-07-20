export type GKeybindInputPreset =
  | 'surface'
  | 'accent'
  | 'danger'
  | 'warning'
  | 'purple'
  | 'ghost'
  | 'quiet'
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

function getActiveModifiers(
  event: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>,
): string[] {
  return modifierOrder.filter((modifier) => {
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

export function formatKeybindDisplayValue(value: string): string {
  if (value.startsWith('Key') && value.length === 4) {
    return value.charAt(3).toUpperCase()
  }

  if (value.startsWith('Digit') && value.length === 6) {
    return value.charAt(5)
  }

  if (value.startsWith('Numpad') && value.length === 7) {
    return `Num ${value.charAt(6)}`
  }

  return value
    .replace(/^(Shift|Control|Alt|Meta)(Left|Right)$/, '$1 $2')
    .replace(/^Arrow(Left|Up|Right|Down)$/, '$1')
}

export function formatKeybind(
  event: Pick<KeyboardEvent, 'key' | 'code' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>,
): string | null {
  if (event.key === 'Escape') {
    return null
  }

  return event.code || normalizeKeyName(event.key)
}

function normalizeMouseButton(button: number): string | null {
  switch (button) {
    case 0:
      return 'Mouse Left'
    case 1:
      return 'Mouse Middle'
    case 2:
      return 'Mouse Right'
    case 3:
      return 'Mouse 4'
    case 4:
      return 'Mouse 5'
    default:
      return null
  }
}

export function formatPointerKeybind(
  event: Pick<PointerEvent, 'button' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>,
): string | null {
  const button = normalizeMouseButton(event.button)
  if (!button) {
    return null
  }

  const modifiers = getActiveModifiers(event)
  return [...modifiers, button].join('+')
}
