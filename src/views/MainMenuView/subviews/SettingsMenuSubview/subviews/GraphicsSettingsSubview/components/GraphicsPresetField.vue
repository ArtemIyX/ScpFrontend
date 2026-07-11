<script setup lang="ts">
import type { GRailItem } from '@/components/g/GRail/GRail'

defineProps<{
  label: string
  helper: string
  items: GRailItem[]
  modelValue: string | number | boolean | null
  railAriaLabel: string
  customizeOpen: boolean
  openCustomizeLabel: string
  closeCustomizeLabel: string
  helpText?: string
  helpDelay?: number
  helpAriaLabel?: string
}>()

defineEmits<{
  'update:modelValue': [value: string | number | boolean | null]
  'toggle-customize': []
}>()
</script>

<template>
  <GField
    :label="label"
    :helper="helper"
    width="full"
    class="graphics-preset-field"
  >
    <template #head>
      <div class="graphics-preset-field__head-actions">
        <GTooltip
          v-if="helpText"
          :delay="helpDelay ?? 600"
          placement="top"
          size="lg"
          preset="quiet"
          :text="helpText"
          :aria-label="helpAriaLabel"
        >
          <GBadge preset="quiet" variant="outline" size="sm" class="graphics-preset-field__help-badge">?</GBadge>
        </GTooltip>

        <GButton
          size="sm"
          shape="chip"
          icon-only
          :preset="customizeOpen ? 'accent' : 'ghost'"
          :pressed="customizeOpen"
          :aria-label="customizeOpen ? closeCustomizeLabel : openCustomizeLabel"
          :title="customizeOpen ? 'Hide customization' : 'Open customization'"
          class="graphics-preset-field__action"
          @click="$emit('toggle-customize')"
        >
          <template #icon>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 4.25h10M5.25 8h5.5M7 11.75h2"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.4"
              />
            </svg>
          </template>
        </GButton>
      </div>
    </template>

    <div class="graphics-preset-field__stack">
      <GRail
        :model-value="modelValue"
        :items="items"
        width="full"
        preset="quiet"
        :aria-label="railAriaLabel"
        @update:model-value="$emit('update:modelValue', $event)"
      />

      <div v-if="customizeOpen" class="graphics-preset-field__custom-panel">
        <div class="graphics-preset-field__custom-grid">
          <slot />
        </div>
      </div>
    </div>
  </GField>
</template>

<style scoped>
.graphics-preset-field {
  position: relative;
}

.graphics-preset-field :deep(.gfield__head) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.22rem;
  padding-bottom: 0.45rem;
}

.graphics-preset-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.graphics-preset-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

.graphics-preset-field__head-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.graphics-preset-field__help-badge {
  min-width: 1.8rem;
  padding-inline: 0.45rem;
  cursor: help;
}

.graphics-preset-field__action {
  margin-top: -0.05rem;
}

.graphics-preset-field__action :deep(svg) {
  width: 0.95rem;
  height: 0.95rem;
}

.graphics-preset-field__stack {
  display: grid;
  gap: 0.9rem;
}

.graphics-preset-field__custom-panel {
  display: grid;
  gap: 0.7rem;
  padding: 0.9rem 1rem 1rem;
  border: 1px solid rgba(198, 255, 74, 0.1);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.03), transparent 16%),
    linear-gradient(180deg, rgba(11, 15, 14, 0.74), rgba(7, 9, 9, 0.88));
}

.graphics-preset-field__custom-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 1rem;
}

@media (max-width: 64rem) {
  .graphics-preset-field__custom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
