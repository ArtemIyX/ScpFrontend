import type {
  KeyBindingSettingCategory,
  KeyBindingSettingData,
  KeyBindingSettingVisualData,
} from '@/proto/gen/keybings_settings'

export interface KeyBindingViewItem {
  id: string
  label: string
  value: string | null
  sortOrder: number
}

export interface KeyBindingCategoryView {
  id: string
  label: string
  bindings: KeyBindingViewItem[]
}

export type KeyBindingMap = Record<string, string | null>

export function normalizeKeyBindingValue(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function slugifyKeyBindingLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sortKeyBindingVisualData(
  bindings: KeyBindingSettingVisualData[],
): KeyBindingSettingVisualData[] {
  return [...bindings].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder
    }

    return left.displayKey.localeCompare(right.displayKey)
  })
}

export function sortKeyBindingCategories(
  categories: KeyBindingSettingCategory[],
): KeyBindingSettingCategory[] {
  return [...categories].sort((left, right) => left.categoryName.localeCompare(right.categoryName))
}

export function mapProtoKeyBindingCategories(
  categories: KeyBindingSettingCategory[],
): KeyBindingCategoryView[] {
  return sortKeyBindingCategories(categories).map((category, index) => ({
    id: `${slugifyKeyBindingLabel(category.categoryName) || 'category'}-${index}`,
    label: category.categoryName,
    bindings: sortKeyBindingVisualData(category.keyBindings).map((binding) => ({
      id: binding.uniqueId,
      label: binding.displayKey,
      value: normalizeKeyBindingValue(binding.key),
      sortOrder: binding.sortOrder,
    })),
  }))
}

export function createKeyBindingMapFromCategories(
  categories: KeyBindingSettingCategory[],
): KeyBindingMap {
  return Object.fromEntries(
    categories.flatMap((category) =>
      category.keyBindings.map((binding) => [binding.uniqueId, normalizeKeyBindingValue(binding.key)]),
    ),
  )
}

export function applyKeyBindingDataToCategories(
  categories: KeyBindingSettingCategory[],
  updates: KeyBindingSettingData[],
): KeyBindingSettingCategory[] {
  if (updates.length === 0) {
    return categories
  }

  const updatesById = new Map(
    updates.map((update) => [update.uniqueId, normalizeKeyBindingValue(update.key) ?? '']),
  )

  return categories.map((category) => ({
    ...category,
    keyBindings: category.keyBindings.map((binding) => {
      const nextKey = updatesById.get(binding.uniqueId)
      if (nextKey === undefined) {
        return binding
      }

      return {
        ...binding,
        key: nextKey,
      }
    }),
  }))
}
