<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import { buildGProgressClasses, type GProgressProps } from './GProgress'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GProgressProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  variant: 'bar',
  background: false,
  min: 0,
  max: 100,
  showValue: true,
  valuePosition: 'suffix',
})

const attrs = useAttrs()

const numericValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) {
    return props.min
  }

  return props.modelValue
})

const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, ((numericValue.value - props.min) / range) * 100))
})

const classes = computed(() =>
  buildGProgressClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    variant: props.variant,
    background: props.background,
    hasError: Boolean(props.error),
    showValue: props.showValue,
  }),
)

const valueText = computed(() => {
  const value = Number.isInteger(numericValue.value)
    ? String(Math.trunc(numericValue.value))
    : String(Number(numericValue.value.toFixed(2)))
  return `${props.valuePrefix ?? ''}${value}${props.valueSuffix ?? ''}`
})

const progressStyle = computed(() => ({
  '--gprogress-percent': `${percent.value}%`,
}))
</script>

<template>
  <div :class="classes">
    <div class="gprogress__head">
      <GText v-if="label" as="span" preset="header" class="gprogress__label">
        {{ label }}
      </GText>

      <div v-if="showValue" class="gprogress__value">
        <slot name="value" :value="numericValue" :percent="percent" :text="valueText">
          <GText as="span" preset="caps" class="gprogress__value-text">
            <template v-if="valueLabel && valuePosition === 'prefix'">{{ valueLabel }} </template>
            {{ valueText }}
            <template v-if="valueLabel && valuePosition === 'suffix'"> {{ valueLabel }}</template>
          </GText>
        </slot>
      </div>
    </div>

    <div
      class="gprogress__track"
      :style="progressStyle"
      role="progressbar"
      :aria-label="ariaLabel || label"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="numericValue"
      :aria-valuetext="valueLabel ? `${valueLabel} ${valueText}` : valueText"
      v-bind="attrs"
    >
      <span class="gprogress__fill" aria-hidden="true"></span>
      <span v-if="variant === 'striped'" class="gprogress__shine" aria-hidden="true"></span>
      <span v-if="variant === 'ring'" class="gprogress__ring-text" aria-hidden="true">
        {{ valueText }}
      </span>
    </div>

    <span class="gprogress__meta">
      <GText v-if="helper && !error" as="span" preset="muted" class="gprogress__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="gprogress__helper gprogress__helper--error">
        {{ error }}
      </GText>
    </span>
  </div>
</template>

<style scoped src="./GProgress.css"></style>
