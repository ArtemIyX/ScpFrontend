<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import GAlert from '@/components/g/GAlert/GAlert.vue'
import GButton from '@/components/g/GButton/GButton.vue'
import GDivider from '@/components/g/GDivider/GDivider.vue'
import GKeybindInput from '@/components/g/GKeybindInput/GKeybindInput.vue'
import GModal from '@/components/g/GModal/GModal.vue'
import GText from '@/components/g/GText/GText.vue'

import {
  areKeyBindingMapsEqual,
  cloneKeyBindingMap,
  countDirtyKeyBindings,
  createDefaultKeyBindingMap,
  createResolvedKeyBindingMap,
  defaultKeyBindingLayout,
  type KeyBindingCategoryDefinition,
  type KeyBindingMap,
} from './KeyBindingsSettingsSubview'

const props = withDefaults(
  defineProps<{
    layout?: KeyBindingCategoryDefinition[]
    initialMappings?: KeyBindingMap
    defaultMappings?: KeyBindingMap
  }>(),
  {
    layout: () => defaultKeyBindingLayout,
    initialMappings: undefined,
    defaultMappings: undefined,
  },
)

const emit = defineEmits<{
  save: [mappings: KeyBindingMap]
  dirtyChange: [dirty: boolean]
}>()

const savedMappings = ref<KeyBindingMap>(
  createResolvedKeyBindingMap(props.layout, props.initialMappings),
)
const draftMappings = ref<KeyBindingMap>(cloneKeyBindingMap(savedMappings.value))
const fallbackDefaults = computed(() => createDefaultKeyBindingMap(props.layout))
const defaultMappings = computed(() => ({
  ...fallbackDefaults.value,
  ...(props.defaultMappings ?? {}),
}))
const showResetModal = ref(false)

const dirtyCount = computed(() =>
  countDirtyKeyBindings(draftMappings.value, savedMappings.value, props.layout),
)
const hasDirtyChanges = computed(
  () => !areKeyBindingMapsEqual(draftMappings.value, savedMappings.value, props.layout),
)

const bindingIndex = computed(() =>
  Object.fromEntries(
    props.layout.flatMap((category) =>
      category.bindings.map((binding) => [
        binding.id,
        {
          ...binding,
          categoryLabel: category.label,
        },
      ]),
    ),
  ),
)

const conflictMap = computed<Record<string, string>>(() => {
  const grouped = new Map<string, string[]>()

  for (const [bindingId, key] of Object.entries(draftMappings.value)) {
    if (!key) {
      continue
    }

    const ids = grouped.get(key) ?? []
    ids.push(bindingId)
    grouped.set(key, ids)
  }

  const conflicts: Record<string, string> = {}

  for (const [key, ids] of grouped.entries()) {
    if (ids.length < 2) {
      continue
    }

    for (const bindingId of ids) {
      const duplicateNames = ids
        .filter((id) => id !== bindingId)
        .map((id) => {
          const binding = bindingIndex.value[id]
          return binding ? `${binding.label} in ${binding.categoryLabel}` : id
        })

      conflicts[bindingId] = `Key ${key} is already used by ${duplicateNames.join(', ')}.`
    }
  }

  return conflicts
})

const conflictCount = computed(() => Object.keys(conflictMap.value).length)
const hasConflicts = computed(() => conflictCount.value > 0)

function applyMappings(source: KeyBindingMap): void {
  draftMappings.value = createResolvedKeyBindingMap(props.layout, source)
}

function setBinding(bindingId: string, value: string | null): void {
  draftMappings.value = {
    ...draftMappings.value,
    [bindingId]: value,
  }
}

function saveChanges(): boolean {
  if (hasConflicts.value) {
    return false
  }

  savedMappings.value = cloneKeyBindingMap(draftMappings.value)
  emit('save', cloneKeyBindingMap(savedMappings.value))
  return true
}

function discardChanges(): void {
  applyMappings(savedMappings.value)
}

function openResetModal(): void {
  showResetModal.value = true
}

function closeResetModal(): void {
  showResetModal.value = false
}

function resetToDefaults(): void {
  applyMappings(defaultMappings.value)
  closeResetModal()
}

function isDirty(): boolean {
  return hasDirtyChanges.value
}

watch(
  () => props.initialMappings,
  (nextMappings) => {
    const resolved = createResolvedKeyBindingMap(props.layout, nextMappings)
    savedMappings.value = resolved
    if (!hasDirtyChanges.value) {
      draftMappings.value = cloneKeyBindingMap(resolved)
    }
  },
)

watch(
  hasDirtyChanges,
  (value) => {
    emit('dirtyChange', value)
  },
  { immediate: true },
)

defineExpose({
  isDirty,
  hasConflicts,
  saveChanges,
  discardChanges,
  resetToDefaults,
})
</script>

<template>
  <section class="key-bindings-settings" aria-label="Key-bindings settings">
    <header class="key-bindings-settings__header">
      <div class="key-bindings-settings__heading">
        <h1 class="key-bindings-settings__title">Key-bindings</h1>
        <GText as="p" preset="muted" class="key-bindings-settings__summary">
          Keep every action on its own key, clear bindings you do not want, and save the draft
          before leaving this section.
        </GText>
      </div>

      <div class="key-bindings-settings__toolbar">
        <GText
          as="p"
          preset="caps"
          class="key-bindings-settings__status"
          :class="{ 'key-bindings-settings__status--dirty': hasDirtyChanges }"
        >
          {{
            hasDirtyChanges
              ? `${dirtyCount} unsaved change${dirtyCount === 1 ? '' : 's'}`
              : 'Bindings synced'
          }}
        </GText>

        <div class="key-bindings-settings__actions">
          <GButton preset="ghost" shape="soft" :disabled="!hasDirtyChanges" @click="discardChanges">
            Cancel
          </GButton>
          <GButton preset="danger" shape="soft" @click="openResetModal">Reset</GButton>
          <GButton
            preset="accent"
            shape="soft"
            :disabled="!hasDirtyChanges || hasConflicts"
            @click="saveChanges"
          >
            Save
          </GButton>
        </div>
      </div>
    </header>

    <GAlert
      v-if="hasConflicts"
      preset="warning"
      variant="soft"
      width="full"
      title="Duplicate keys detected"
      class="key-bindings-settings__alert"
    >
      Resolve the highlighted bindings before saving. Each warning shows which action already owns
      that key.
    </GAlert>

    <section
      v-for="category in layout"
      :key="category.id"
      class="key-bindings-settings__category"
      :aria-label="`${category.label} key bindings`"
    >
      <GDivider :label="category.label" preset="quiet" class="key-bindings-settings__divider" />

      <div class="key-bindings-settings__list">
        <div
          v-for="binding in category.bindings"
          :key="binding.id"
          class="key-bindings-settings__row"
          :class="{
            'key-bindings-settings__row--dirty':
              draftMappings[binding.id] !== savedMappings[binding.id],
            'key-bindings-settings__row--error': Boolean(conflictMap[binding.id]),
          }"
        >
          <GText as="p" preset="header" class="key-bindings-settings__binding-name">
            {{ binding.label
            }}{{ draftMappings[binding.id] !== savedMappings[binding.id] ? ' *' : '' }}
          </GText>

          <GKeybindInput
            :model-value="draftMappings[binding.id]"
            width="full"
            size="sm"
            preset="quiet"
            clearable
            :error="conflictMap[binding.id]"
            :helper="conflictMap[binding.id]"
            :aria-label="`${binding.label} key binding`"
            @update:model-value="setBinding(binding.id, $event)"
          />
        </div>
      </div>
    </section>

    <GModal
      v-model="showResetModal"
      width="md"
      title="Reset key bindings"
      subtitle="This replaces the current draft with the default mapping set."
      status="Confirm"
      aria-label="Reset key bindings confirmation"
    >
      <div class="key-bindings-settings__modal-copy">
        <GText as="p" preset="muted">
          Unsaved edits will be replaced by the defaults. You can still review the reset result
          before pressing Save.
        </GText>
      </div>

      <template #footer>
        <div class="key-bindings-settings__modal-actions">
          <GButton preset="ghost" shape="soft" @click="closeResetModal">Keep draft</GButton>
          <GButton preset="danger" shape="soft" @click="resetToDefaults">Reset to defaults</GButton>
        </div>
      </template>
    </GModal>
  </section>
</template>

<style scoped>
.key-bindings-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.key-bindings-settings__header {
  display: grid;
  gap: 1rem;
}

.key-bindings-settings__heading {
  display: grid;
  gap: 0.55rem;
}

.key-bindings-settings__title {
  margin: 0;
  color: rgba(240, 244, 238, 0.96);
  font-family: var(--ui-body-font);
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 0 1.2rem rgba(198, 255, 74, 0.12);
}

.key-bindings-settings__summary {
  max-width: 40rem;
  margin: 0;
}

.key-bindings-settings__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.9rem 1rem;
  border: 0.0625rem solid rgba(198, 255, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.04), transparent 88%),
    linear-gradient(180deg, rgba(13, 17, 16, 0.92), rgba(8, 10, 10, 0.94));
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.key-bindings-settings__status {
  margin: 0;
  color: rgba(186, 197, 178, 0.74);
}

.key-bindings-settings__status--dirty {
  color: rgba(255, 214, 102, 0.94);
}

.key-bindings-settings__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.key-bindings-settings__alert {
  margin-top: 0.1rem;
}

.key-bindings-settings__category {
  display: grid;
  gap: 0.9rem;
}

.key-bindings-settings__divider {
  margin-top: 0.2rem;
}

.key-bindings-settings__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 0.85rem;
}

.key-bindings-settings__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10.5rem, 12.75rem);
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border: 0.0625rem solid rgba(198, 255, 74, 0.08);
  background:
    linear-gradient(180deg, rgba(18, 22, 21, 0.92), rgba(8, 11, 11, 0.94)),
    linear-gradient(90deg, rgba(198, 255, 74, 0.02), transparent 30%);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    0 0.85rem 1.6rem rgba(0, 0, 0, 0.16);
}

.key-bindings-settings__row--dirty {
  border-color: rgba(255, 197, 58, 0.26);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.05),
    inset 0 0 0 0.0625rem rgba(255, 197, 58, 0.08),
    0 0.85rem 1.6rem rgba(0, 0, 0, 0.16);
}

.key-bindings-settings__row--error {
  border-color: rgba(255, 110, 92, 0.28);
  background:
    linear-gradient(180deg, rgba(31, 18, 18, 0.94), rgba(11, 8, 8, 0.95)),
    linear-gradient(90deg, rgba(255, 110, 92, 0.08), transparent 34%);
}

.key-bindings-settings__binding-name {
  margin: 0;
  color: rgba(244, 248, 236, 0.98);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
}

.key-bindings-settings__modal-copy {
  display: grid;
  gap: 0.75rem;
}

.key-bindings-settings__modal-copy :deep(p) {
  margin: 0;
}

.key-bindings-settings__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 56rem) {
  .key-bindings-settings__list {
    grid-template-columns: 1fr;
  }

  .key-bindings-settings__row {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

@media (max-width: 48rem) {
  .key-bindings-settings__toolbar {
    align-items: stretch;
  }

  .key-bindings-settings__actions {
    justify-content: stretch;
    width: 100%;
  }

  .key-bindings-settings__actions :deep(.gbutton) {
    flex: 1 1 10rem;
  }

  .key-bindings-settings__modal-actions {
    flex-direction: column;
  }
}
</style>
