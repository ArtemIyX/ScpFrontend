export interface KeyBindingDefinition {
  id: string
  label: string
  defaultKey: string | null
  helper?: string
}

export interface KeyBindingCategoryDefinition {
  id: string
  label: string
  bindings: KeyBindingDefinition[]
}

export type KeyBindingMap = Record<string, string | null>

export const defaultKeyBindingLayout: KeyBindingCategoryDefinition[] = [
  {
    id: 'movement',
    label: 'Movement',
    bindings: [
      { id: 'moveForward', label: 'Move Forward', defaultKey: 'W' },
      { id: 'moveBackward', label: 'Move Backward', defaultKey: 'S' },
      { id: 'moveLeft', label: 'Move Left', defaultKey: 'A' },
      { id: 'moveRight', label: 'Move Right', defaultKey: 'D' },
      { id: 'sprint', label: 'Sprint', defaultKey: 'Shift' },
      { id: 'crouch', label: 'Crouch', defaultKey: 'Ctrl' },
    ],
  },
  {
    id: 'character',
    label: 'Character',
    bindings: [
      { id: 'jump', label: 'Jump', defaultKey: 'Space' },
      { id: 'interact', label: 'Interact', defaultKey: 'E' },
      { id: 'reload', label: 'Reload', defaultKey: 'R' },
      { id: 'flashlight', label: 'Flashlight', defaultKey: 'F' },
      { id: 'inventory', label: 'Inventory', defaultKey: 'Tab' },
    ],
  },
]

export function flattenKeyBindingLayout(
  layout: KeyBindingCategoryDefinition[],
): KeyBindingDefinition[] {
  return layout.flatMap((category) => category.bindings)
}

export function createDefaultKeyBindingMap(layout: KeyBindingCategoryDefinition[]): KeyBindingMap {
  return Object.fromEntries(
    flattenKeyBindingLayout(layout).map((binding) => [binding.id, binding.defaultKey ?? null]),
  )
}

export function createResolvedKeyBindingMap(
  layout: KeyBindingCategoryDefinition[],
  mappings?: KeyBindingMap,
): KeyBindingMap {
  return {
    ...createDefaultKeyBindingMap(layout),
    ...(mappings ?? {}),
  }
}

export function cloneKeyBindingMap(mappings: KeyBindingMap): KeyBindingMap {
  return { ...mappings }
}

export function areKeyBindingMapsEqual(
  left: KeyBindingMap,
  right: KeyBindingMap,
  layout: KeyBindingCategoryDefinition[],
): boolean {
  return flattenKeyBindingLayout(layout).every(
    (binding) => (left[binding.id] ?? null) === (right[binding.id] ?? null),
  )
}

export function countDirtyKeyBindings(
  current: KeyBindingMap,
  baseline: KeyBindingMap,
  layout: KeyBindingCategoryDefinition[],
): number {
  return flattenKeyBindingLayout(layout).filter(
    (binding) => (current[binding.id] ?? null) !== (baseline[binding.id] ?? null),
  ).length
}
