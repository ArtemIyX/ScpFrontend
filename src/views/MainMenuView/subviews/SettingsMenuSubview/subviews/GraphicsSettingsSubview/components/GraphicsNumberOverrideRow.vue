<script setup lang="ts">
defineProps<{
  label: string
  cvar: string
  presetValues: string
  modelValue: number | null
  min: number
  max: number
  step: number
  ariaLabel: string
  mode?: 'float'
  precision?: number
}>()

defineEmits<{
  'update:modelValue': [value: number | null]
}>()
</script>

<template>
  <div class="graphics-override-row">
    <div class="graphics-override-row__copy">
      <GText as="span" class="graphics-override-row__label">{{ label }}</GText>
      <div class="graphics-override-row__meta">
        <GText as="span" preset="muted" class="graphics-override-row__cvar">{{ cvar }}</GText>
        <GText as="span" preset="muted" class="graphics-override-row__presets">{{ presetValues }}</GText>
      </div>
    </div>

    <GNumberInput
      class="graphics-override-row__input"
      :model-value="modelValue"
      :mode="mode"
      :min="min"
      :max="max"
      :step="step"
      :precision="precision"
      :step-buttons="false"
      :show-value="false"
      width="full"
      preset="quiet"
      :aria-label="ariaLabel"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.graphics-override-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 6.5rem;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.35rem;
  padding: 0.3rem 0;
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.04);
}

.graphics-override-row__copy {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

.graphics-override-row__meta {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  min-width: 0;
}

.graphics-override-row__label {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(233, 238, 224, 0.9);
}

.graphics-override-row__cvar {
  font-size: 0.67rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.graphics-override-row__presets {
  flex: 0 0 auto;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  opacity: 0.72;
}

.graphics-override-row__input {
  min-width: 0;
}
</style>
